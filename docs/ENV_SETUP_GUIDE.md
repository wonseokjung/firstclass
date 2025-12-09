# 🔐 환경변수 설정 가이드

## 개요

AI City Builders 프로젝트의 보안을 위해 민감한 정보는 환경변수로 관리합니다.

## 📍 설정 위치

### 1. 로컬 개발 환경

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# .env.local (Git에 커밋되지 않음)

# Azure Table Storage SAS URLs
REACT_APP_AZURE_SAS_URL_USERS=https://clathonstorage.table.core.windows.net/users?sp=raud&st=...
REACT_APP_AZURE_SAS_URL_SESSIONS=https://clathonstorage.table.core.windows.net/mentoringssessions?sp=raud&st=...
REACT_APP_AZURE_SAS_URL_PACKAGES=https://clathonstorage.table.core.windows.net/studentpackages?sp=raud&st=...
REACT_APP_AZURE_SAS_URL_POSTS=https://clathonstorage.table.core.windows.net/posts?sp=raud&st=...
REACT_APP_AZURE_SAS_URL_COMMENTS=https://clathonstorage.table.core.windows.net/comments?sp=raud&st=...
```

### 2. Azure Portal (프로덕션)

**Static Web Apps > Configuration > Application settings**에서 설정:

| 이름 | 설명 |
|------|------|
| `TOSS_LIVE_SECRET_KEY` | 토스페이먼츠 라이브 시크릿 키 |
| `TOSS_TEST_SECRET_KEY` | 토스페이먼츠 테스트 시크릿 키 |

> ⚠️ **중요**: `TOSS_*_SECRET_KEY`는 반드시 Azure Portal에서만 설정하세요! 프론트엔드 환경변수(`REACT_APP_*`)로 설정하면 노출됩니다.

### 3. GitHub Secrets (CI/CD)

**GitHub > Settings > Secrets and variables > Actions**에서 설정:

| Secret 이름 | 용도 |
|-------------|------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Azure 배포용 |
| `TOSS_LIVE_SECRET_KEY` | 빌드 시 Azure로 전달 |
| `TOSS_TEST_SECRET_KEY` | 빌드 시 Azure로 전달 |

## 🔒 보안 아키텍처

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   프론트엔드     │────▶│  Azure Functions │────▶│   토스페이먼츠   │
│   (React)       │     │  (서버리스 API)  │     │      API       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       │ 시크릿 키 사용
        │                       ▼
        │               ┌─────────────────┐
        │               │ Azure 환경변수   │
        │               │ (안전하게 저장)  │
        │               └─────────────────┘
        │
        ▼
┌─────────────────┐
│ 브라우저에서     │
│ 시크릿 키 노출X  │
└─────────────────┘
```

## 📋 체크리스트

- [ ] `.env.local` 파일 생성 (로컬 개발용)
- [ ] Azure Portal에 `TOSS_LIVE_SECRET_KEY` 설정
- [ ] Azure Portal에 `TOSS_TEST_SECRET_KEY` 설정
- [ ] GitHub Secrets 설정 (CI/CD용)
- [ ] `.gitignore`에 `.env.local` 포함 확인

## 🔄 SAS URL 갱신 시

SAS URL이 만료되면:

1. Azure Portal > Storage Account > Shared access signature
2. 새 SAS 토큰 생성 (읽기/쓰기 권한)
3. `.env.local` 및 Azure Portal 환경변수 업데이트
4. 재배포

---

문의: jay@connexionai.kr

