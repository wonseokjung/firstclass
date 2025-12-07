const { TableClient } = require('@azure/data-tables');
const fs = require('fs');

const connectionString = 'DefaultEndpointsProtocol=https;AccountName=clathlogin;AccountKey=tVNn2Ux8WduebxPBaqJxrljr/M5k3VP2sher9dh0Wm08X7l/0cKXh9uPMJFtzJI3xaEEcbd/C4tH+AStsT6v/A==;EndpointSuffix=core.windows.net';
const tableName = 'clathlogin';
const client = TableClient.fromConnectionString(connectionString, tableName);

async function backupTable() {
  console.log('🔄 Azure Table 백업 시작...\n');
  
  const allData = [];
  const entities = client.listEntities();
  
  let count = 0;
  for await (const entity of entities) {
    allData.push(entity);
    count++;
    if (count % 50 === 0) {
      console.log(`📥 ${count}개 레코드 로드됨...`);
    }
  }
  
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  const filename = `backup_azure_${timestamp}.json`;
  const filepath = `./scripts/${filename}`;
  
  fs.writeFileSync(filepath, JSON.stringify(allData, null, 2));
  
  console.log('\n✅ 백업 완료!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📁 파일명: ${filepath}`);
  console.log(`📊 총 레코드 수: ${allData.length}`);
  console.log(`💾 파일 크기: ${(fs.statSync(filepath).size / 1024).toFixed(2)} KB`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // 간단한 통계
  const enrolledUsers = allData.filter(u => u.enrolledCourses && u.enrolledCourses.length > 2);
  console.log(`\n📈 통계:`);
  console.log(`   - 총 사용자: ${allData.length}명`);
  console.log(`   - 강의 등록자: ${enrolledUsers.length}명`);
}

backupTable().catch(err => {
  console.error('❌ 백업 실패:', err.message);
});


