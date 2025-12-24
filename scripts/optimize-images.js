const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 최적화할 큰 이미지들
const imagesToOptimize = [
  'public/images/lady.png',
  'public/images/unclebae.png',
  'public/images/aibuilidng.png',
  'public/images/baruch_graduation.png',
  'public/images/40+prompt.png',
  'public/images/gemini2.png',
  'public/images/aicoding.png',
  'public/images/business.png',
  'public/images/gemini.jpg',
  'public/images/gemini3.png',
];

const MAX_WIDTH = 1920;
const QUALITY = 85; // 높은 품질 유지

async function optimizeImage(inputPath) {
  const fullPath = path.join(__dirname, '..', inputPath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⏭️ 파일 없음: ${inputPath}`);
    return;
  }

  const originalSize = fs.statSync(fullPath).size;
  const ext = path.extname(inputPath).toLowerCase();
  
  // WebP 출력 경로
  const webpPath = fullPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  
  // 원본 백업
  const backupPath = fullPath + '.backup';
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(fullPath, backupPath);
  }

  try {
    // 이미지 정보 가져오기
    const metadata = await sharp(fullPath).metadata();
    
    // WebP로 변환 + 리사이징
    await sharp(fullPath)
      .resize(Math.min(metadata.width, MAX_WIDTH), null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: QUALITY })
      .toFile(webpPath);

    // 원본도 최적화 (PNG/JPG 유지하되 리사이징)
    const optimizedBuffer = await sharp(fullPath)
      .resize(Math.min(metadata.width, MAX_WIDTH), null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .png({ quality: QUALITY, compressionLevel: 9 })
      .toBuffer();
    
    fs.writeFileSync(fullPath, optimizedBuffer);

    const newSize = fs.statSync(fullPath).size;
    const webpSize = fs.statSync(webpPath).size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);

    console.log(`✅ ${path.basename(inputPath)}`);
    console.log(`   원본: ${(originalSize / 1024 / 1024).toFixed(2)}MB → PNG: ${(newSize / 1024 / 1024).toFixed(2)}MB, WebP: ${(webpSize / 1024 / 1024).toFixed(2)}MB (${savings}% 절약)`);
  } catch (error) {
    console.error(`❌ 오류 ${inputPath}:`, error.message);
  }
}

async function main() {
  console.log('🖼️ 이미지 최적화 시작...\n');
  console.log(`설정: 최대 너비 ${MAX_WIDTH}px, 품질 ${QUALITY}%\n`);

  for (const img of imagesToOptimize) {
    await optimizeImage(img);
    console.log('');
  }

  console.log('✨ 완료! 원본은 .backup 파일로 보관됨');
}

main();



