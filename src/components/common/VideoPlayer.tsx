import React, { forwardRef } from 'react';

/**
 * VideoPlayer Component
 * 
 * ⚠️ 중요: 이 컴포넌트의 iframe 속성들은 절대 수정하지 마세요!
 * 
 * referrerPolicy="strict-origin-when-cross-origin"는 반드시 필요합니다.
 * 이것이 없으면 배포 환경(HTTPS)에서 YouTube/Vimeo 영상이 재생되지 않습니다.
 * 
 * allow 속성도 모두 필요합니다. 하나라도 빠지면 영상 기능이 제대로 작동하지 않습니다.
 */

interface VideoPlayerProps {
  src: string;
  title: string;
  className?: string;
}

const VideoPlayer = forwardRef<HTMLIFrameElement, VideoPlayerProps>(
  ({ src, title, className = '' }, ref) => {
    return (
      <iframe
        ref={ref}
        src={src}
        title={title}
        frameBorder="0"
        allowFullScreen
        className={className}
        // ⚠️ 아래 속성들은 절대 삭제하거나 수정하지 마세요!
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;

