# windsahead.com launch preparation

[한국어](../ko/custom-domain.md)

The user purchased **windsahead.com** through Gabia and requested publication preparation on September 13, 2026. Both `windsahead.com` and `www.windsahead.com` are registered with the existing Winds Ahead Site. Sites returned **pending** for both domains and **pending_validation** for TLS. This is a prepared connection, not a completed public launch.

The current owner-private application remains at [the existing Site](https://winds-ahead.donghee0815.chatgpt.site), version 6. No Gabia records, name servers, access policy, application source, or existing publication were changed during this preparation.

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
- Domain registration succeeded for both hosts. DNS ownership and HTTPS activation are not yet verified.
- Local DNS and Google Public DNS returned SERVFAIL during this check; Google's diagnostic reported refused responses at the delegated name servers. Another resolver timed out. This does **not** establish the cause, registration failure, or a missing purchase. Verify the domain's DNS service/zone in Gabia and repeat after setup.
- After the records are saved, use the existing native domain-status refresh operation with each recorded domain ID. Apply any additional validation records returned by the service and require active domain/TLS status before claiming the connection works. Do not remove and recreate pending registrations. The refresh response also contained one all-null validation entry per host; it is not an actionable record and was not invented or added to the DNS table.
- Select `https://windsahead.com` as the intended primary origin. A `www` → root redirect preserving path/query, canonical/hreflang metadata, sitemap and indexability belong to the public-launch change; none is claimed as implemented here. Preserve both English and Korean routes and first-visit language selection.
- Public access is a separate launch action after DNS/TLS and anonymous access are tested. Domain registration does not change the current private audience.
- Carry forward the existing launch work: an actual correction/removal contact, a supported public-use basis for the stored reference media, and the remaining device/slow-network checks. The private GitHub issue tracker is not a public reporting channel. See [delivery criteria](delivery-plan.md) and [MVP limits](mvp-status.md).

## Recovery and scope

Keep the current generated Site address and publication available during domain setup. If connection validation fails, inspect native status and the authoritative DNS answers before changing application code or nameservers. Revert only newly changed DNS records using a saved before-state; this turn made no registrar-side changes. No recurring job, public access, paid plan, mail service or automatic merge was enabled.

Validation for this milestone consists of successful native domain registration, exact comparison of all seven records with their responses, and matching English/Korean instructions. Application tests and a rebuild are unnecessary because application source and deployed bytes are unchanged.
