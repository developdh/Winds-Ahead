# windsahead.com 공개 준비

[English](../en/custom-domain.md)

사용자가 가비아에서 **windsahead.com**을 구매하고 2026년 9월 13일 게시 준비를 요청했습니다. 기존 Winds Ahead 사이트에 `windsahead.com`과 `www.windsahead.com`을 모두 등록했습니다. Sites 응답은 두 주소 모두 **인증 대기**, HTTPS 인증서는 **인증 대기 중**입니다. 연결을 준비한 상태이며 공개가 완료된 것은 아닙니다.

현재 소유자 전용 앱은 [기존 사이트](https://winds-ahead.donghee0815.chatgpt.site)의 버전 6입니다. 이번 준비에서는 가비아 레코드·네임서버·공개 범위·앱 소스·기존 게시 버전을 변경하지 않았습니다.

## 가비아 DNS 입력표

**My가비아 → 서비스 관리 → DNS 관리툴 → windsahead.com → 설정 / DNS 설정**에서 아래 7개 레코드를 추가하고, 각 행 확인 후 저장합니다. 값은 Sites의 도메인 등록 응답을 그대로 옮겼습니다. 현재 사이트 주소로 대체하지 않습니다. 루트 호스트는 `@`이며 TXT 호스트에서는 마지막 `.windsahead.com`을 뺍니다. CNAME 값 마지막의 점은 유지합니다. [가비아 공식 설정 안내](https://customer.gabia.com/faq/detail/287/1201)

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `162.159.143.30` |
| A | `@` | `172.66.3.26` |
| TXT | `_openai-site-verification` | `openai-site-verification=mHA6vAOFBB3_KGNUgr9_2ODxUzb-Y7eQwu6XsYqr_jo` |
| TXT | `_cf-custom-hostname` | `981942a6-5a59-4119-8d9f-9db0728d68d0` |
| CNAME | `www` | `custom-domains.chatgpt.site.` |
| TXT | `_openai-site-verification.www` | `openai-site-verification=zNdZvgVevRjoT2IK1sMahk5WbC0zOVk6m5JaSKcCAz0` |
| TXT | `_cf-custom-hostname.www` | `0396cbb9-ed9f-4083-8a97-ebfe318eced1` |

A 두 줄은 기본 도메인, CNAME은 `www`, TXT 네 줄은 두 주소의 소유권 인증에 사용합니다. 인증 값은 DNS에 게시하도록 발급된 값이며 Git 인증 정보·API 키·로그인 토큰이 아닙니다. TTL은 가비아의 기존 기본값을 사용할 수 있습니다. 메일·다른 TXT 레코드는 보존합니다. 같은 호스트에 충돌하는 A/AAAA/CNAME이 있다면 용도를 확인한 뒤 교체합니다. 가비아 안내는 가비아 네임서버를 사용할 때 적용되며 도메인 구매만으로 네임서버 사용 여부가 확정되지는 않습니다. [가비아 DNS 관리툴 안내](https://customer.gabia.com/faq/detail/227/2521)

응답을 구조화한 [windsahead.com.json](../deployment/windsahead.com.json)에 나중에 상태를 갱신할 도메인 ID도 보존했습니다. 이 파일은 앱과 `.openai/hosting.json` 밖에 둡니다.

## 확인 상태와 다음 단계

- 사이트 응답에서 현재 계정이 소유자이고 허용 사용자는 1명, 허용 그룹은 0개임을 확인했습니다. 소유자 전용 범위를 유지합니다.
- 두 주소의 사이트 등록은 성공했습니다. DNS 소유권·HTTPS 활성화는 아직 확인되지 않았습니다.
- 이번 확인에서 로컬 DNS와 Google Public DNS는 SERVFAIL을 반환했고, Google 진단에는 위임된 네임서버가 응답을 거절했다고 표시됐습니다. 다른 조회 지점에서는 시간 초과가 발생했습니다. 이것만으로 원인·등록 실패·구매 누락을 단정할 수 없습니다. 가비아에서 해당 도메인의 DNS 서비스·영역을 확인하고 설정 후 다시 조회해야 합니다.
- 저장 후 기록된 두 도메인 ID로 기존 도메인 상태 갱신 기능을 실행합니다. 서비스가 추가 인증 레코드를 반환하면 반영하고, 도메인·HTTPS 활성 상태를 확인한 후 연결 완료로 판단합니다. 대기 중인 등록을 삭제·재생성하지 않습니다. 상태 갱신 응답에는 호스트마다 값이 모두 null인 인증 행도 하나씩 있었습니다. 입력 가능한 레코드가 아니므로 값을 추정하거나 DNS 표에 추가하지 않았습니다.
- 대표 주소는 `https://windsahead.com`으로 잡습니다. 경로·검색 조건을 보존하는 `www` → 기본 주소 이동, canonical/hreflang, 사이트맵과 검색 허용은 공개 전환 작업에서 적용합니다. 이번 단계에서 구현됐다고 주장하지 않습니다. 영어·한국어 경로와 첫 방문 언어 선택은 유지합니다.
- 누구나 접근하는 공개 전환은 DNS·HTTPS와 비로그인 접근 검증 후 별도로 진행합니다. 도메인 등록만으로 현재 비공개 범위가 바뀌지는 않습니다.
- 기존 공개 준비 항목인 실제 정정·삭제 요청 연락처, 저장한 참고 미디어의 공개 이용 근거, 남은 실기기·느린 통신 환경 검증도 이어서 처리합니다. 비공개 GitHub 이슈를 공개 제보 창구로 쓰지 않습니다. [공개 기준](delivery-plan.md)과 [MVP 검증 범위](mvp-status.md)를 참고합니다.

## 복구와 작업 범위

연결 중에도 기존 사이트 주소와 게시 버전을 유지합니다. 인증이 실패하면 앱 코드나 네임서버를 바꾸기 전에 사이트 상태와 실제 DNS 응답부터 확인합니다. DNS 변경 전 값을 보존하고 새로 변경한 레코드만 되돌립니다. 이번 작업에서는 가비아 설정을 변경하지 않았습니다. 정기 작업·공개 접근·유료 요금제·메일 서비스·자동 병합은 추가하지 않았습니다.

이번 단위는 도메인 등록 성공, 응답과 입력표 7개 레코드의 일치, 한영 안내의 대응을 검증합니다. 앱 소스와 배포 파일이 동일하므로 앱 테스트·빌드는 다시 실행하지 않습니다.
