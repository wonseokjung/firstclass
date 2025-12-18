// 빌드 시 버전 자동 업데이트
const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, '../public/version.json');

// 고유한 빌드 ID 생성
const buildId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

const version = {
  version: buildId,
  buildTime: new Date().toISOString(),
  timestamp: Date.now()
};

fs.writeFileSync(versionFile, JSON.stringify(version, null, 2));
console.log('✅ version.json 업데이트:', version.version, '(' + version.buildTime + ')');

