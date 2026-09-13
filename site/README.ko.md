# 앱 개발 안내

[English](README.md)

Node.js 22.13 이상과 npm을 사용합니다. `npm ci`로 잠금 파일대로 설치하고 `npm run dev`로 미리보기를 실행합니다. `npm run build`는 Worker를 만들며 `npm start`로 배포 결과를 로컬 실행합니다. API 키는 필요하지 않습니다. 프로젝트 소개는 루트 [README](../README.ko.md)를 참고하세요.

기준 자료는 `content/research.json`, `content/media.json`, `content/regional-records.json`, `content/global-events.json`, `content/forecasts.json`, `content/localizations.json`에 있습니다. 실제 파일명과 스키마를 확인한 뒤 수정하세요. `public/data/wiki/`는 검토된 기록에서 `scripts/import-huiji.py`로 생성합니다. 예상 이력을 덮어쓰거나 미확인 값을 사실로 바꾸지 않습니다.

`npm run check`, `npm test`, `npm run validate:content`, `npm run build`를 실행합니다. 콘텐츠 검증은 참조·날짜 정밀도·한영 설명·미디어 파일을 확인합니다. 언어와 관심 목록은 브라우저에만 저장하며 앱 사용자 데이터베이스는 없습니다. 서비스 접근 권한은 이 환경설정과 별도로 호스팅에서 관리합니다.

저장된 `.openai/hosting.json`은 원 프로젝트를 식별하며 인증 정보가 아닙니다. 포크를 해당 ID로 배포하지 말고 자신의 계정·호스팅을 설정하세요. 외부 라이선스 고지를 보존합니다. 빌드 결과·로컬 실행 상태·환경 파일·미디어 원본은 Git에 넣지 않습니다. 실수로 npm에 배포하지 않도록 `package.json`의 private 설정은 유지하며 GitHub 공개 여부와는 별개입니다.
