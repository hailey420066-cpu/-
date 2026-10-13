# VINTAGE MAP — 노션 검색 위젯

`부산 아메카지`, `성수 고스`, `홍대 펑크`처럼 **한 검색창에서 도시·동네·의상 장르**를 함께 검색합니다. 원본 VINTAGE MAP 노션 데이터베이스를 서버 측에서 읽어옵니다.

## 1. 배포 전 준비

1. [GitHub](https://github.com)에 새로운 **비공개 저장소**를 만듭니다. 이 폴더 파일들을 업로드합니다. `.env`는 업로드하지 마세요.
2. [Notion integrations](https://www.notion.so/profile/integrations)에서 내부 통합을 만들고 **Read content** 권한을 부여합니다.
3. 원본 [VINTAGE MAP DB](https://app.notion.com/p/d7b158583b7b4ffda2c2ac22e856bfa1)의 `...` → **Connections**에서 해당 통합을 연결합니다. 정확한 메뉴명은 노션 버전에 따라 다를 수 있습니다.
4. 발급된 API 토큰은 절대 채팅에 붙여넣지 마세요.

## 2. Vercel 배포

1. [Vercel](https://vercel.com/new) → **Add New Project** → GitHub 저장소 선택 → Next.js 프레임워크 자동 인식.
2. **Environment Variables**에서 다음을 넣습니다.
   - `NOTION_TOKEN` = 직접 발급한 Notion API 토큰
   - `NOTION_DATA_SOURCE_ID` = `d4515786-b8d0-4e10-97f0-a02002376ed1`
   - `PUBLIC_ONLY` = `true` (권장)
3. **Deploy** 실행. 생성된 `https://...vercel.app` 주소에 접속해 검색 동작을 확인합니다.

### 공개 여부 필수 확인

기존 DB의 후보 매장 상당수는 **`공개 여부`가 체크되지 않은 검증 전 항목**입니다. 이 프로젝트는 기본적으로 `공개 여부`가 켜진 매장만 웹에 보여주며, 토큰은 서버에서만 사용됩니다. 따라서 처음 배포하면 결과가 **0개**일 수 있습니다. 확인된 매장만 `공개 여부`를 켜 주세요.

`PUBLIC_ONLY=false`는 검증되지 않은 매장까지 인터넷에 공개하므로 권장하지 않습니다. 테스트할 때에도 외부 공개 링크가 열릴 수 있다는 점을 주의하세요.

## 3. 노션에 위젯 삽입

1. [VINTAGE MAP 메인페이지](https://app.notion.com/p/3f85a9445b3681a8b328f495b5bfb9e5)를 엽니다.
2. `/embed`를 입력하고 Vercel에서 발급된 URL을 넣습니다.
3. 기존 매장 갤러리·관리 DB 블록을 접거나 내린 뒤, 위젯 블록을 제일 위로 드래그합니다.
4. 임베드가 보이지 않는 경우 호스팅에서 iframe 허용 헤더를 확인하세요. `next.config.mjs`에 노션 도메인을 위한 `frame-ancestors` 설정이 들어 있습니다.

## 개발자 로컬 테스트

```bash
npm install
cp .env.example .env.local
# .env.local에서 실제 토큰 입력
npm run dev
```

노션 API 2025-09-03 기준 `POST /v1/data_sources/{data_source_id}/query`를 호출합니다. 화면 검색은 브라우저에서 처리하므로 한글 지역과 다중 스타일 입력이 가능합니다. 캐시는 서버 메모리에 최대 2분 유지됩니다.

**한계:** 거리순 반경 검색은 아직 구현되지 않았습니다. 위치·주소 문자열과 장르를 함께 검색합니다. 사진 파일 URL은 노션이 발급한 임시 URL일 수 있어서 시간이 지나면 브라우저에서 만료될 수 있습니다. 사진 갱신을 강화하려면 추후 이미지 프록시가 필요합니다.
