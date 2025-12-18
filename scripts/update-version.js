// 빌드 시 버전 자동 업데이트
const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, '../public/version.json');

const version = {
  version: new Date().toISOString(),
  buildTime: new Date().toISOString()
};

fs.writeFileSync(versionFile, JSON.stringify(version, null, 2));
console.log('✅ version.json 업데이트:', version.version);

