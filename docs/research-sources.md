# Research sources · 조사 출처

Research date / 조사일: **2026-09-12 (America/New_York)**.

[English plan](en/product-plan.md) · [한국어 기획](ko/product-plan.md)

This register records source discovery and inspection limits for planning. It is not a complete cosmetic inventory, a current-availability check, or a global-release forecast.

이 목록은 기획을 위한 출처 탐색과 확인 범위를 기록합니다. 전체 외관 목록, 현재 판매 여부 확인 결과, 글로벌 출시 예측표가 아닙니다.

## Source register · 출처 목록

| ID | Source / 출처 | Verified scope / 확인 범위 | Intended use / 활용 |
| --- | --- | --- | --- |
| S01 | [Global official news / 글로벌 공식 소식](https://www.wherewindsmeetgame.com/news/) | Official news index and article links / 공식 소식 목록과 개별 공지 링크 | Global-source entry point / 글로벌 조사 시작점 |
| S02 | [CN official updates / 중국 공식 업데이트](https://www.yysls.cn/news/update/index.html) | Official update index and article links / 공식 업데이트 목록과 개별 공지 링크 | CN-source entry point / 중국 조사 시작점 |
| S03 | [Korean official site / 한국어 공식 사이트](https://www.wherewindsmeetgame.com/kr/) | Korean branding and news navigation / 한국어 게임명과 소식 메뉴 | Korean terminology and regional-language cross-checks / 한국어 명칭·언어별 교차 확인 |
| S04 | [Global September 3 update overview](https://www.wherewindsmeetgame.com/news/official/903update.html) | Title, displayed publication date of 2026-09-09, and image-based body structure; image contents not transcribed / 제목·게시일·이미지 본문 구조 확인, 이미지 상세 미판독 | Separate article date from event date; require visual inspection / 게시일·이벤트일 분리, 이미지 대조 필요 |
| S05 | [CN September 10 update notice](https://www.yysls.cn/news/update/20260910/40412_1313540.html) | Title, displayed publication date of 2026-09-10, and image-based body structure; image contents not transcribed / 제목·게시일·이미지 본문 구조 확인, 이미지 상세 미판독 | Verify image notices before ingestion / 이미지 공지의 등록 전 검증 |
| S06 | [Korean August 27 update preview / 한국어 8월 27일 업데이트 미리보기](https://www.wherewindsmeetgame.com/kr/news/official/827update.html) | Title, displayed publication date of 2026-08-26, and image-based body structure; image contents not transcribed / 제목·게시일·이미지 본문 구조 확인, 이미지 상세 미판독 | Korean official wording source; not yet cosmetic-name evidence / 한국어 공식 표현 확인, 개별 외관 명칭 근거로는 미검토 |
| S07 | [Historical CN cosmetic announcement / 과거 중국 외관 공지](https://www.yysls.cn/news/official/20250926/37780_1261910.html) | Readable text and media references; displayed date 2025-09-25 differs from URL date / 읽을 수 있는 본문·미디어 참조 확인, 표시 게시일과 URL 날짜가 다름 | Validate distinct cosmetic types, acquisition records, and publication/release fields / 외관 종류·획득 정보·게시일과 출시일 분리 검토 |

## Findings used in the plan · 기획에 반영한 조사 결과

**Image notices.** Some sampled global and CN updates carry their substantive contents in images. An HTML text collector alone will miss information; the proposed workflow requires visual checking before facts are published. We have not extracted cosmetic details from those images. [S04](https://www.wherewindsmeetgame.com/news/official/903update.html), [S05](https://www.yysls.cn/news/update/20260910/40412_1313540.html)

**이미지 공지.** 확인한 글로벌·중국 업데이트 중 일부는 본문 내용을 이미지로 제공합니다. 텍스트 수집만으로는 정보가 누락될 수 있어 직접 대조하는 단계를 제안합니다. 해당 이미지의 개별 외관 정보는 아직 추출하지 않았습니다. [S04](https://www.wherewindsmeetgame.com/news/official/903update.html), [S05](https://www.yysls.cn/news/update/20260910/40412_1313540.html)

**Different date meanings.** A sampled global article's title refers to September 3 while its displayed publication date is September 9. Store publication and in-game event dates independently; neither the title nor publication date alone verifies an individual cosmetic's start time. [S04](https://www.wherewindsmeetgame.com/news/official/903update.html)

**날짜 의미 분리.** 글로벌 공지 예시에서는 제목의 9월 3일과 표시 게시일 9월 9일이 다릅니다. 게시일과 실제 이벤트 날짜를 별도 저장하고, 제목이나 게시일만으로 외관 시작 시간을 확정하지 않습니다. [S04](https://www.wherewindsmeetgame.com/news/official/903update.html)

**Multiple content types.** The historical CN article separately describes outfit sets, hair, a battle-pass outfit, and a weapon appearance. It gives category-specific acquisition information. This supports modeling components and acquisition records separately. It does not establish any item's current global status. [S07](https://www.yysls.cn/news/official/20250926/37780_1261910.html)

**여러 외관 유형.** 과거 중국 공지에서 의상 세트, 헤어, 배틀패스 의상, 무기 외관을 따로 소개하고 획득 정보도 구분합니다. 따라서 구성품과 획득 정보를 분리해 모델링합니다. 이 자료만으로 어느 항목의 현재 글로벌 상태도 확정하지 않습니다. [S07](https://www.yysls.cn/news/official/20250926/37780_1261910.html)

**Naming.** The Korean official site uses 연운. Winds Ahead / 연운경 (燕雲鏡) is the user's separate fan-project name. [S03](https://www.wherewindsmeetgame.com/kr/)

**명칭.** 공식 한국어 사이트의 게임명은 연운입니다. Winds Ahead / 연운경(燕雲鏡)은 사용자가 정한 별도의 팬 프로젝트명입니다. [S03](https://www.wherewindsmeetgame.com/kr/)

## Remaining research · 후속 조사

- Identify 5–8 representative cosmetics, then expand toward 20–30 verified launch records. / 대표 5~8개 외관부터 검증하고 초기 공개용 20~30개를 목표로 확장합니다.
- Review actual media and reuse conditions; no media licensing conclusion was reached during planning. / 실제 미디어와 이용 조건을 확인합니다. 이번 기획에서 미디어 사용 권한을 확정하지 않았습니다.
- Match CN items to official EN/KO names and global releases; distinguish first releases from reruns. / 중문 항목과 글로벌 영어·한국어 공식명 및 출시를 연결하고 첫 출시와 복각을 구분합니다.
- Collect comparable pairs before assigning any forecast window. No fixed CN-to-Global delay or release-order model has been validated. / 예상 기간을 부여하기 전에 비교 사례를 수집합니다. 일정 시차나 출시 순서 모델은 아직 검증되지 않았습니다.
- Verify social/video accounts through official outbound links before treating their material as official. / SNS·영상 계정은 공식 사이트의 연결을 확인한 뒤 공식 출처로 분류합니다.

Source availability, factual reliability, and redistribution permission are three different questions. The design and priority choices in the plans are editorial proposals rather than claims made by the sources.

출처 접속 가능성, 사실의 신뢰도, 재배포 권한은 서로 다른 문제입니다. 기획 문서의 디자인·우선순위는 출처가 주장한 사실이 아니라 프로젝트를 위한 제안입니다.

## Implemented MVP material · 구현 MVP 자료

The September 2025 CN announcement (S07) was visually inspected for eight cosmetics. Raw evidence is in `site/content/research.json`; optimized owner-private derivatives and their unknown redistribution permission are in `site/content/media.json`. Six date-only releases and two unknown dates were retained. No global forecast was inferred from their age.

2025년 9월 중국 공지(S07)의 외관 8종을 직접 확인했습니다. 원문 근거는 `site/content/research.json`, 소유자 비공개 파생 이미지와 미확인 재배포 권한은 `site/content/media.json`에 있습니다. 날짜가 명시된 6종과 미정인 2종을 구분하며 오래된 중국 출시일만으로 글로벌 예상을 만들지 않았습니다.

Final body selection: [Gowun Dodum Regular](https://github.com/google/fonts/tree/main/ofl/gowundodum), after an owner comparison of four additional candidates. The shipped Winds UI subset now derives from Gowun Dodum; Pretendard and SUIT are historical studies. Noto Serif KR remains the title face.

최종 본문 선택은 네 추가 후보를 비교한 뒤 정한 [고운 돋움 Regular](https://github.com/google/fonts/tree/main/ofl/gowundodum)입니다. 현재 배포용 Winds UI 서브셋은 고운 돋움을 사용하며 Pretendard·SUIT는 이전 비교 시안입니다. 제목은 Noto Serif KR을 유지합니다.
