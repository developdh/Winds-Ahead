# 연운경 — 웹 애플리케이션

[English](README.md)

영어·한국어 외관 도감의 비공개 MVP 구현입니다. `npm run install:ci` 후 `npm run dev`로 실행합니다. 로컬 개발 서버는 5173 포트를 사용합니다. `npx tsc --noEmit`으로 타입을 검사하고 `npm run build`로 배포용 Worker를 만듭니다.

`content/research.json`은 초기 중국 공식 자료와 글로벌 확인 여부, 날짜 정밀도, 미디어 권한의 미확인 상태를 보존합니다. 첫 작업 단위는 실행 기반과 시각적 화면이며, 탐색과 검색은 후속 PR에서 연결합니다. 범위와 품질 기준은 상위 폴더의 한영 프로젝트 문서를 참고하세요.
