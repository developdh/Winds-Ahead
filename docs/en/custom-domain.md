# windsahead.com launch preparation

> Historical domain-setup record. For current source publication, metadata and access status, see [release status](public-launch.md).

[한국어](../ko/custom-domain.md)

The user purchased **windsahead.com** through Gabia and requested publication preparation on September 13, 2026. Both `windsahead.com` and `www.windsahead.com` are registered with the existing Winds Ahead Site. The user entered the seven DNS records and corrected the missing leading underscore in `_openai-site-verification.www`. The latest Sites response confirms **active domain routing and TLS certificates** for both hosts. HTTPS browser visits reach the expected private-site login screen. Domain connection is complete; public launch is not.

The current owner-private application remains at [the existing Site](https://winds-ahead.donghee0815.chatgpt.site), version 6. The user changed Gabia DNS; the agent refreshed the existing domain registrations. No name servers, access policy, application source, or application version were changed by the agent.

## Gabia DNS entries

Open **My가비아 → 서비스 관리 → DNS 관리툴 → windsahead.com → 설정 / DNS 설정**. Add the seven records below, confirm each row, then save. These values are copied from Sites' native custom-domain responses; do not replace them with the generated Site URL. Gabia's root host is `@`; nested TXT hosts omit the final `.windsahead.com`. Retain the final dot in the CNAME target. [Gabia's record guide](https://customer.gabia.com/faq/detail/287/1201)

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `162.159.143.30` |
| A | `@` | `172.66.3.26` |
| TXT | `_openai-site-verification` | `openai-site-verification=mHA6vAOFBB3_KGNUgr9_2ODxUzb-Y7eQwu6XsYqr_jo` |
| TXT | `_cf-custom-hostname` | `981942a6-5a59-4119-8d9f-9db0728d68d0` |
| CNAME | `www` | `custom-domains.chatgpt.site.` |
| TXT | `_openai-site-verification.www` | `openai-site-verification=zNdZvgVevRjoT2IK1sMahk5WbC0zOVk6m5JaSKcCAz0` |
| TXT | `_cf-custom-hostname.www` | `0396cbb9-ed9f-4083-8a97-ebfe318eced1` |

The two A records serve the root domain; the CNAME serves `www`. The four TXT records validate the two hostnames. These are DNS ownership-verification values intended for DNS publication, not a Git credential, API key, or sign-in token. TTL can remain at Gabia's existing default. Preserve unrelated email/TXT records. If an existing A/AAAA/CNAME conflicts at the same host, inspect its current use before replacement. Gabia's guide applies when Gabia is the authoritative DNS provider; a domain purchase by itself does not establish that. [Gabia DNS overview](https://customer.gabia.com/faq/detail/227/2521)

The machine-readable response snapshot is [windsahead.com.json](../deployment/windsahead.com.json). It contains the returned domain IDs for later status refresh; it is deliberately outside the application and `.openai/hosting.json`.

## Current verification and next actions

- The native Site response confirms the caller is the owner, with one allowed viewer and no allowed groups. Access remains owner-private.
- Both hosts now report `active` for domain, provider and TLS status, with no reported error. HTTPS browser visits to `www` and the root `/ko` path reach the private-site login screen. An earlier “Site not found” response during `active_redeploying` no longer appeared after routing became active.
- The authentication screen confirms the anonymous access boundary; it does not verify application content after login. Automatic approval review blocked the attempted ChatGPT sign-in as outside the domain/HTTPS verification authorization. No alternate authentication method or bypass was attempted. Signed-in application verification remains a public-launch follow-up; access remains owner-private.
- Before the user entered DNS, local DNS and Google Public DNS returned SERVFAIL, and another resolver timed out. After entry and correction, direct DNS queries from the agent environment timed out or could not connect; this is a limitation of that check, not evidence that the user's records are wrong. Current certificate status comes from Sites, and the entry/correction is supported by the user's screenshot and confirmation.
- The existing native domain-status refresh operation confirmed both hosts active after DNS entry. Keep the domain registrations and DNS records in place. Initial responses contained one all-null validation entry per host; it was not an actionable record and was not invented or added to the DNS table. After activation the response retains the OpenAI ownership TXT record; this does not instruct removal of the other DNS records.
- Select `https://windsahead.com` as the intended primary origin. A `www` → root redirect preserving path/query, canonical/hreflang metadata, sitemap and indexability belong to the public-launch change; none is claimed as implemented here. Preserve both English and Korean routes and first-visit language selection.
- Public access is a separate launch action. DNS/TLS and the anonymous login gate have been checked; signed-in application verification and testing anonymous content after a requested public-access change remain. Domain registration does not change the current private audience.
- Carry forward the existing launch work: an actual correction/removal contact, a supported public-use basis for the stored reference media, and the remaining device/slow-network checks. The private GitHub issue tracker is not a public reporting channel. See [delivery criteria](delivery-plan.md) and [MVP limits](mvp-status.md).

## Recovery and scope

Keep the current generated Site address and publication available during domain setup. If connection validation fails, inspect native status and the authoritative DNS answers before changing application code or nameservers. Revert only newly changed DNS records using a saved before-state; the agent made no registrar-side changes. No recurring job, public access, paid plan, mail service or automatic merge was enabled.

Validation covers the seven expected records, matching English/Korean instructions, the user's DNS correction, native domain/TLS activation and browser checks of both hostnames. Application content after login was not verified. Application tests and a rebuild are unnecessary because application source and deployed bytes are unchanged.
