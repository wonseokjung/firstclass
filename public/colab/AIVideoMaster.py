import os
import time
import base64
import subprocess
from io import BytesIO
from PIL import Image as PILImage
from google import genai
from google.genai import types

class AIVideoAgent:
    def __init__(self, api_key):
        if not api_key:
            raise ValueError("API Key is required.")
        self.client = genai.Client(api_key=api_key)
        self.text_model = "gemini-2.0-flash"
        self.image_model = "gemini-2.0-flash-exp-image-generation"
        self.audio_model = "gemini-2.5-flash-preview-tts"
        self.video_model = "veo-3.1-fast-generate-preview"

    def generate_text(self, prompt, system_instruction=None):
        """텍스트 생성 (대본, 기획 등)"""
        response = self.client.models.generate_content(
            model=self.text_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction
            )
        )
        return response.text

    def generate_image(self, prompt, aspect_ratio="16:9"):
        """이미지 생성"""
        response = self.client.models.generate_content(
            model=self.image_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                image_config=types.ImageConfig(aspect_ratio=aspect_ratio)
            )
        )
        image_data = response.candidates[0].content.parts[0].inline_data.data
        return PILImage.open(BytesIO(base64.b64decode(image_data)))

    def generate_audio(self, text, voice_name="Puck", output_path="output_audio.mp3"):
        """음성 생성 (TTS)"""
        response = self.client.models.generate_content(
            model=self.audio_model,
            contents=text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=voice_name)
                    )
                )
            )
        )
        audio_bytes = response.candidates[0].content.parts[0].inline_data.data
        with open(output_path, "wb") as f:
            f.write(audio_bytes)
        return output_path

    def generate_video(self, prompt, image_ref=None, aspect_ratio="16:9", duration=8, output_path="output_video.mp4"):
        """영상 생성 (Veo)"""
        config = types.GenerateVideosConfig(
            aspect_ratio=aspect_ratio,
            duration_seconds=duration
        )
        
        # 만약 이미지가 제공되면 이미지-투-비디오(I2V)로 동작
        content_parts = [prompt]
        if image_ref:
            # image_ref는 PIL Image 객체라고 가정
            buffered = BytesIO()
            image_ref.save(buffered, format="JPEG")
            img_bytes = buffered.getvalue()
            content_parts.insert(0, types.Part.from_bytes(data=img_bytes, mime_type="image/jpeg"))

        operation = self.client.models.generate_videos(
            model=self.video_model,
            prompt=prompt,
            config=config
        )

        print(f"🎬 영상 생성 중... (Operation: {operation.name})")
        while not operation.done:
            time.sleep(10)
            operation = self.client.operations.get(operation)
        
        generated_video = operation.result.generated_videos[0]
        self.client.files.download(file=generated_video.video)
        generated_video.video.save(output_path)
        return output_path

    def extend_video(self, video_id, prompt, output_path="extended_video.mp4"):
        """영상 길이 연장"""
        operation = self.client.models.extend_video(
            model=self.video_model,
            video=video_id,
            prompt=prompt
        )
        
        print(f"⌛ 영상 연장 중... (Operation: {operation.name})")
        while not operation.done:
            time.sleep(10)
            operation = self.client.operations.get(operation)
            
        generated_video = operation.result.generated_videos[0]
        self.client.files.download(file=generated_video.video)
        generated_video.video.save(output_path)
        return output_path

    def merge_media(self, video_path, audio_path, output_path="final_video.mp4"):
        """FFmpeg를 사용하여 영상과 음성 합성"""
        try:
            cmd = [
                'ffmpeg', '-y',
                '-i', video_path,
                '-i', audio_path,
                '-c:v', 'copy',
                '-c:a', 'aac',
                '-map', '0:v:0',
                '-map', '1:a:0',
                '-shortest',
                output_path
            ]
            subprocess.run(cmd, check=True)
            return output_path
        except Exception as e:
            print(f"❌ 합성 실패: {e}")
            return video_path
