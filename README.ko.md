# Winds Ahead · 연운경 (燕雲鏡)

**[English](README.md) · [한국어](README.ko.md)**

연운의 **외관 도감과 출시 로드맵**입니다. 사진을 살펴보고 중국·글로벌 출시 정보와 획득 조건을 한곳에서 비교하세요.

## [웹사이트 바로가기 → windsahead.com](https://windsahead.com)

**[외관 도감](https://windsahead.com/ko) · [출시 로드맵](https://windsahead.com/ko/calendar) · [English website](https://windsahead.com/en)**

로그인 없이 무료로 이용할 수 있습니다. PC와 모바일을 지원합니다.

### [최신 릴리스](https://github.com/developdh/Winds-Ahead/releases/latest) · [전체 업데이트 기록](https://github.com/developdh/Winds-Ahead/releases)

### [프로젝트에 기여하기](CONTRIBUTING.ko.md) · [버그·정보 수정 제보](https://github.com/developdh/Winds-Ahead/issues/new/choose)

---

## 도감에서 할 수 있는 일

- **외관 찾기.** 한영 이름·중국 원명·별칭으로 검색합니다. 의상·헤어·무기·이펙트·장신구·탈것을 골라 보고 서버별 출시일로 정렬할 수 있습니다.
- **목록에서 바로 비교하기.** 상세 팝업에서 큰 사진을 넘겨 보고, 필요 재화·수량·획득처와 의상 구성 정보를 확인합니다.
- **앞으로 나올 외관 살펴보기.** 공식 예정과 운영자 예상을 구분한 로드맵·월별 캘린더를 제공합니다. 모르는 날짜는 미정으로 표시합니다.
- **저장하고 공유하기.** 관심 목록은 사용하는 브라우저에 저장되며 외관별 링크를 공유할 수 있습니다. 언어 선택은 기억하고 이펙트 영상은 재생을 누를 때 불러옵니다.

**외관 기록 685개 · 외관 370종의 사진 554장 · 위키 참고 항목 395개**

정보는 계속 보강하고 있습니다. 일부 사진·공식 번역·출시일은 확인 중이며, 이 수치가 게임 전체 외관의 완전한 수집을 뜻하지는 않습니다. 예상 일정은 비공식이며 바뀔 수 있습니다.

## 우리가 중요하게 생각하는 가치

**믿을 수 있는 정보.** 중국·글로벌의 사실과 운영자 예상을 구분합니다. 원본 출처와 미확인 사항을 함께 남깁니다.

**정보는 풍부하게, 사용은 단순하게.** 선명한 사진과 읽기 쉬운 설명, 적은 페이지 이동으로 편하게 비교할 수 있는 화면을 지향합니다. 모바일 사용성과 로딩 속도도 꾸준히 개선합니다.

**누구나 참여하는 열린 프로젝트.** 소스를 살펴보고 정보를 수정하거나 개발에 참여할 수 있습니다. 광고·유료 기능·제휴 링크·수익 수취 없이 운영하는 독립 팬 프로젝트입니다.

## 함께 보완해주세요

출처 제보, 누락 외관 추가, 번역, 이름·가격 수정, 접근성 개선과 코드 기여를 모두 환영합니다.

시작하기: **[기여 안내](CONTRIBUTING.ko.md)** · **[이슈 등록](https://github.com/developdh/Winds-Ahead/issues/new/choose)**. PR 제목·본문은 영어로, 앱과 문서는 영어·한국어로 유지합니다. 이전 예상 변경 이력과 원문 근거를 보존해주세요.

[보안 제보](SECURITY.md) · [행동 규칙](CODE_OF_CONDUCT.md) · [최신 출시 검토](docs/ko/public-launch.md)

## 개발자를 위한 안내

<details>
<summary><strong>로컬 실행과 검증</strong></summary>

필요한 환경: **Node.js 22.13 이상**, npm. 로컬 도감 실행에 API 키나 클라우드 계정은 필요하지 않습니다.

```sh
git clone https://github.com/developdh/Winds-Ahead.git
cd Winds-Ahead/site
npm ci
npm run dev
```

서버가 표시한 주소를 여세요. `/ko`, `/en`은 언어별 경로이며 `/?welcome=1`로 언어 선택 화면을 다시 볼 수 있습니다.

```sh
# site/에서 실행
npm run check
npm test
npm run validate:content
npm run build
npm start
```

React·TypeScript, vinext/Vite의 Next.js API, Tailwind CSS와 Cloudflare Workers를 사용합니다. 저장된 Sites 프로젝트 ID는 배포 대상을 식별하며 접근 권한을 주지 않습니다. 별도 서비스로 배포할 때는 자신의 호스팅 설정을 사용하세요. [앱 개발 안내](site/README.ko.md)를 참고하세요.

비밀키·계정 정보·사적인 스크린샷이나 이용 근거 없는 저작물을 커밋하지 마세요.

</details>

<details>
<summary><strong>프로젝트 구조와 관리 문서</strong></summary>

| 경로 | 역할 |
| --- | --- |
| `site/app/`, `site/components/` | 페이지와 사용자 화면 |
| `site/content/` | 서버별 기록, 출처, 미디어 목록, 한영 설명과 예상 이력 |
| `site/public/data/wiki/` | 필요할 때 불러오는 외관별 위키 구성 정보 |
| `site/scripts/`, `site/tests/` | 자료 가져오기·콘텐츠 검증·회귀 테스트 |
| `docs/en/`, `docs/ko/` | 한영 기획·관리·출시 문서 |
| `docs/research/` | 출처 기록과 검토한 정정 내역 |

[콘텐츠 안내](docs/ko/content-model.md) · [디자인 원칙](docs/ko/design-quality.md) · [캘린더 관리](docs/ko/calendar-automation.md) · [릴리스 발행](docs/ko/releasing.md)

</details>

## 라이선스와 출처

**[MIT 라이선스](LICENSE)**: 직접 작성한 앱 코드와 프로젝트 문서에 적용합니다. 게임 이미지·영상·상표·원문 발췌·위키 가공 자료·글꼴·외부 코드의 권리는 별도로 유지합니다. 위키 자료는 CC BY-NC-SA 3.0, 글꼴과 의존성은 각자의 고지를 따릅니다. 미디어 이용 권한이 확인되지 않았으면 그 상태를 그대로 기록합니다.

자료 재사용 전 확인할 문서: **[외부 저작물 안내](THIRD_PARTY_NOTICES.md)**. 비영리 운영 원칙은 MIT 코드 라이선스에 별도 제한을 추가하지 않습니다. NetEase 및 Everstone Studio와 무관한 비공식 팬 프로젝트입니다.
