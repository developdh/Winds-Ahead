# Winds Ahead · 연운경 (燕雲鏡)

[English](README.md) · [한국어](README.ko.md)

**연운의 외관과 출시 로드맵을 한곳에서 보는 한영 팬 도감입니다.**

마음에 드는 외관의 사진과 획득 조건을 살펴보고, 중국·글로벌 출시 정보를 비교하세요. 광고·유료 기능·제휴 링크·수익 수취 없이 운영하는 비영리 팬 프로젝트입니다.

[사이트](https://windsahead.com) · [버그·정보 수정 제보](https://github.com/developdh/Winds-Ahead/issues/new/choose) · [기여 안내](CONTRIBUTING.ko.md)

> 소스 저장소를 공개했으며 누구나 기여할 수 있습니다. 사이트 접근 범위는 저장소와 별개이며, 현재 미리보기는 전체 공개 전까지 접근 권한이 필요합니다. [출시 상태](docs/ko/public-launch.md)를 확인하세요.

## 주요 기능

- **외관 도감:** 의상·헤어·무기·이펙트·장신구·탈것. 확인한 한영 이름, 중국 원명과 별칭으로 검색하고 서버별 상태와 출시일로 필터·정렬합니다.
- **이동 없는 상세 보기:** 큰 사진 중심의 팝업, 좌우 사진 넘기기, 재화·가격·획득처·출처와 위키의 의상 구성 정보를 확인합니다.
- **출시 로드맵:** 공식 예정과 운영자 예상을 문구·색으로 구분합니다. 타임라인과 반응형 월별 캘린더를 전환하며 미정 날짜는 지어내지 않습니다.
- **저장과 공유:** 브라우저 관심 목록, 외관 공유 링크와 언어 선택 기억. 이펙트 영상은 재생을 눌렀을 때만 불러옵니다.

현재 **외관 기록 685개, 위키 참고 항목 395개, 외관 370종의 사진 554장**을 담고 있습니다. 게임 전체 외관의 완전한 수집이나 서버별 동일 외관의 연결을 보장하는 숫자는 아닙니다. 일부 사진·공식 번역·출시 날짜는 아직 확인 중이며, 예상 일정은 비공식이고 바뀔 수 있습니다.

## 로컬 실행

**Node.js 22.13 이상**과 npm이 필요합니다. 로컬 도감 실행에 API 키나 클라우드 계정은 필요하지 않습니다.

```sh
git clone https://github.com/developdh/Winds-Ahead.git
cd Winds-Ahead/site
npm ci
npm run dev
```

서버가 표시한 주소를 여세요. `/ko`, `/en`이 언어별 경로이며 `/?welcome=1`로 언어 선택 화면을 다시 볼 수 있습니다. 배포 결과를 로컬에서 확인하려면 다음을 실행합니다.

```sh
npm run build
npm start
```

React·TypeScript, vinext/Vite가 제공하는 Next.js API, Tailwind CSS와 Cloudflare Workers를 사용합니다. 저장된 Sites 프로젝트 ID는 배포 대상을 식별하며 접근 권한을 주지 않습니다. 별도 서비스로 배포할 때는 자신의 호스팅 설정을 사용하세요. [앱 개발 안내](site/README.ko.md)를 참고하세요.

## 누구나 기여할 수 있어요

이름·출시 정보 수정, 근거가 있는 신규 정보, 번역, 접근성 개선과 코드 기여를 환영합니다. [이슈](https://github.com/developdh/Winds-Ahead/issues/new/choose)를 열거나 저장소를 포크해 PR을 보내주세요. PR 제목·본문은 영어로, 앱과 문서는 영어·한국어로 유지합니다. 이전 예상 변경 이력과 원문 근거를 보존해주세요.

```sh
# site/에서 실행
npm run check
npm test
npm run validate:content
npm run build
```

[기여 안내](CONTRIBUTING.ko.md), [보안 제보](SECURITY.md), [행동 규칙](CODE_OF_CONDUCT.md)을 확인하세요. 비밀키·계정 정보·사적인 스크린샷이나 이용 근거 없는 저작물을 올리지 마세요.

## 프로젝트 구조

| 경로 | 역할 |
| --- | --- |
| `site/app/`, `site/components/` | 페이지와 사용자 화면 |
| `site/content/` | 서버별 기록, 원문 출처, 미디어 목록, 한영 설명, 예상 변경 이력 |
| `site/public/data/wiki/` | 필요할 때 불러오는 외관별 위키 구성 정보 |
| `site/scripts/`, `site/tests/` | 자료 가져오기·콘텐츠 검증·회귀 테스트 |
| `docs/en/`, `docs/ko/` | 한영 기획·관리·출시 문서 |
| `docs/research/` | 출처 기록과 검토한 정정 내역 |

[콘텐츠 안내](docs/ko/content-model.md) · [디자인 원칙](docs/ko/design-quality.md) · [캘린더 관리](docs/ko/calendar-automation.md) · [출시 검토](docs/ko/public-launch.md)

## 라이선스와 출처

직접 작성한 앱 코드와 프로젝트 문서는 [MIT 라이선스](LICENSE)로 제공합니다. **게임 이미지·영상·상표·원문 발췌·위키 가공 자료·글꼴·외부 코드는 이 라이선스로 재허가되지 않습니다.** 위키 자료는 CC BY-NC-SA 3.0, 글꼴과 의존성은 각자의 고지를 따릅니다. 미디어 이용 권한이 확인되지 않았으면 그 상태를 그대로 기록합니다.

자료 재사용 전 [외부 저작물 안내](THIRD_PARTY_NOTICES.md)를 확인하세요. 이 프로젝트의 비영리 운영 원칙은 MIT 코드 라이선스에 별도 이용 제한을 추가하지 않습니다. NetEase 및 Everstone Studio와 무관한 비공식 팬 프로젝트입니다.
