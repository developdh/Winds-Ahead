# Winds Ahead · 연운경 (燕雲鏡)

[English](README.md) · [한국어](README.ko.md)

**연운** 외관을 기록하는 독립 팬 도감입니다. 중국 서버의 실제 외관과 획득 정보를 살펴보고 글로벌 공식 정보와 운영자 예상을 구분합니다.

**MVP:** 첫 접속 언어 선택, 이미지 갤러리, 검색, 브라우저 관심 저장, 반응형 출시 캘린더를 갖춘 영어·한국어 웹앱입니다. 주요 동선은 **외관**과 **캘린더** 두 가지입니다. 어두운 배경과 큰 이미지, 가벼운 Gowun Dodum 본문을 사용하며 랜딩은 Noto Serif KR로 무협 정체성을 유지합니다.

초기 도감에는 **2025년 9월 중국 공식 공지의 외관 8종**을 등록했습니다. 6종은 중국 출시일이 명시되어 있고 2종은 날짜 미정입니다. 검증된 글로벌 일정이나 운영자 예상은 아직 게시하지 않았습니다. 빈 일정에 임의 날짜를 채우지 않습니다.

소스와 미리보기는 비공개입니다. 미디어 출처는 기록했으나 재배포 권한은 미확인이므로 공개 서비스 전 미디어 검토와 실제 공개 제보 창구가 필요합니다.

## 로컬 실행

Node 22.13 이상에서 `site/`로 이동해 실행합니다.

```sh
npm ci
npm run dev
```

표시된 로컬 주소를 엽니다. `/?welcome=1`로 랜딩을 다시 볼 수 있습니다. 언어는 브라우저 저장소와 1년짜리 자사 쿠키에 기억하며 사이트 데이터를 지우면 초기화됩니다. `/en`, `/ko` 직접 링크는 해당 언어를 유지하고, 언어를 바꾸면 선호 설정도 갱신됩니다.

검증 명령: `npm run check`, `npm test`, `npm run validate:content`, `npm run build`. 실제 확인 범위와 제한은 MVP 현황 문서를 참고하세요.

## 문서

| Document | English | 한국어 |
| --- | --- | --- |
| MVP and operation | [MVP status](docs/en/mvp-status.md) | [MVP 현황](docs/ko/mvp-status.md) |
| Product | [Product plan](docs/en/product-plan.md) | [제품 기획](docs/ko/product-plan.md) |
| Content | [Content model](docs/en/content-model.md) | [콘텐츠 모델](docs/ko/content-model.md) |
| Delivery | [Delivery plan](docs/en/delivery-plan.md) | [개발 계획](docs/ko/delivery-plan.md) |
| AI review | [Calendar automation](docs/en/calendar-automation.md) | [캘린더 AI 갱신](docs/ko/calendar-automation.md) |
| Design | [Design quality](docs/en/design-quality.md) | [디자인 기준](docs/ko/design-quality.md) |
| Sources | [Bilingual source register](docs/research-sources.md) | [공통 출처 목록](docs/research-sources.md) |

[GitHub 저장소](https://github.com/developdh/Winds-Ahead) · [기여 안내](CONTRIBUTING.md)

PR과 커밋 메시지는 영어를 사용하며 사이트와 문서는 영어·한국어로 유지합니다. 공식 개발·운영사와 무관한 팬 사이트이며 미디어와 상표의 권리는 각 권리자에게 있습니다.
