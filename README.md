# 키친 게놈 앱 / Kitchen Genome app

설치형 웹앱(PWA). 서울 셰프 계보를 주방별·식당별로 보고, 한국어/영어 전환, 오프라인에서도 열림.
Installable PWA for the Seoul chef-lineage tracker. Korean/English, works offline.

## 구조 / Layout
- `www/` — 앱 전체 (빌드 단계 없음). Capacitor `webDir`도 이 폴더.
  - `index.html`, `app.js` (해시 라우터: `#/` 주방 목록·검색, `#/k/<id>` 주방, `#/r/<id>` 식당), `app.css`
  - `config.js` — 데이터 주소. 사이트가 공개하는 `https://kitchengenome.soulbound.co.kr/data.js` (`window.SEED`)를 그대로 씀.
  - `sw.js` — 앱 셸은 캐시 우선, `data.js`는 네트워크 우선 + 캐시 대체. `www/data/data.js`는 첫 실행 오프라인용 스냅샷.
  - `manifest.webmanifest`, `icons/`
- 데이터는 사이트 레포(SUNBURN-Golden/kitchen-genome)의 일일 크롤러 파이프라인이 갱신. 앱은 읽기만 함.
- 판정(과대평가/저평가)과 뉴스레터는 앱에도 넣지 않음.

## 실행 / Run
```
npm run sync-data     # 오프라인 스냅샷 갱신 (선택)
npm run serve         # http://localhost:5173
```
## 스토어 포장 (나중에) / Store wrap (later)
```
npm i -D @capacitor/cli @capacitor/core @capacitor/ios @capacitor/android
npm run cap:add:ios && npm run cap:add:android && npm run cap:sync
```
`capacitor.config.json`: appId `kr.co.soulbound.kitchengenome`, webDir `www`. 스토어 계정·비용은 준태님 승인 후.

## 작업 규칙 / Handoff
- UI·디자인 작업은 **CrazyFrontendManBOT**이 PR로 올림. `main`에 직접 push 금지, PR → squash merge.
- 데이터 형식(`window.SEED`) 변경은 사이트 레포 쪽에서 먼저, 여기서는 읽기만.
- 개발 모델 순서(준태님 지정): 설계 Fable medium → 설계 리뷰 Opus 5.5 medium → 개발 Codex sol 6.1 high (백업 Sonnet high) → 리뷰 Opus 5.5 medium → 수정 Codex → 재리뷰 Sonnet medium; 백업 GLM → swe-2. 10개 PR마다 Fable 감리.
