# 고양이 앱 홍보 자산 · 2026-10-21

이번 완성 묶음 중 6건만 수록합니다. 원본 파일을 재인코딩하지 않고 SHA-256으로 확인했습니다.

## 용도와 공개 범위

AI 생성 홍보 콘셉트입니다. 실제 게임플레이·게임 런타임 교체 파일·실제 고객 사례·추천·성과로 표시하지 않습니다. 실제 브랜드 로고나 가짜 UI를 포함하는 결과는 이 묶음의 통과 자산으로 취급하지 않습니다.
영상 음원은 게시용으로 검수하지 않았으므로 별도 확인 전 무음으로 사용합니다. 완전한 고정 카메라·무봉제 루프·모든 출력 규격 호환을 보장하지 않습니다. manifest의 실제 규격과 개별 검수 메모를 우선합니다.

`approved/`는 시각 검수 통과 홍보 후보, `conditional/`은 용도 제한이 있는 후보, `hold/`는 게시 보류입니다. 최종 캠페인 맥락과 문구는 사용 전에 검토합니다.

## 자산 목록

| 파일 | 실제 규격 | 검수 | 사용 목적 | 공식 원본 |
|---|---|---|---|---|
| [garden-evening-video-01](approved/garden-evening-video-01.mp4) | 1276×720 | passed | 인물 없는 저녁 정원 홍보 배경 | [Higgsfield](https://higgsfield.ai/ko/asset/all/a91cdac4-b781-4522-b204-47faf945ccbc) |
| [toastcat-keyvisual-01](approved/toastcat-keyvisual-01.png) | 2688×1520 | passed | 가로 홍보 키비주얼 및 제안서 | [Higgsfield](https://higgsfield.ai/ko/asset/all/4cc8a914-dd7b-45b2-a321-910e9c595932) |
| [toastcat-landscape-video-01](approved/toastcat-landscape-video-01.mp4) | 1912×1080 | passed | 가로 홍보 B-roll | [Higgsfield](https://higgsfield.ai/ko/asset/all/4f829df0-f138-4916-b39e-5d292c6b2f41) |
| [toastcat-portrait-01](approved/toastcat-portrait-01.png) | 1520×2688 | passed | 세로 SNS 커버 | [Higgsfield](https://higgsfield.ai/ko/asset/all/58109839-67d4-4192-bbdf-53d7cdae7af5) |
| [toastcat-portrait-video-01](approved/toastcat-portrait-video-01.mp4) | 1080×1912 | passed | 세로 SNS 홍보 B-roll | [Higgsfield](https://higgsfield.ai/ko/asset/all/6e3714cd-92ec-48d4-802f-468af77d140b) |
| [toastcat-wide-banner-01](approved/toastcat-wide-banner-01.png) | 2688×1152 | passed | 초광폭 웹 배너 | [Higgsfield](https://higgsfield.ai/ko/asset/all/4ef428ef-dac1-45be-9be5-a79fee74c1dd) |

## 보존·무결성

미디어 합계 44,356,649 bytes, 최대 개별 파일 15,430,849 bytes. ZIP은 커밋하지 않습니다. 두 저장소에 기존 LFS 규칙이 없고 개별 파일은 GitHub 50 MiB 경고 기준보다 작아 일반 Git으로 관리합니다. LFS·유료 저장소·새 자격증명은 추가하지 않습니다.

파일별 생성일, 모델, 실제 픽셀 크기, 영상 길이·디코딩 프레임 수, SHA-256, 공식 결과 URL, 사용 목적, 검수 상태는 `manifest.json`에 있습니다. `SHA256SUMS`는 이 폴더의 미디어·문서 무결성 확인용입니다.

## 운영 배포와 분리

이 폴더는 런타임 경로 밖에 있으며 사이트·게임 코드에서 참조하지 않습니다. `assets/higgsfield-2026-10-21` 브랜치의 Vercel 자동 배포는 `vercel.json`의 해당 브랜치 규칙으로 비활성화했습니다. `.vercelignore`에서도 자산 보관 폴더를 제외합니다. 초안 PR이며 병합·운영 배포는 수행하지 않습니다.

공개 범위를 넓히거나 사이트에서 사용하려면 별도의 검토가 필요합니다. 생성물에 새로운 오픈소스 라이선스를 임의로 부여하지 않습니다.

참고: [GitHub 파일 크기 정책](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github), [Vercel 브랜치 자동 배포 설정](https://vercel.com/docs/project-configuration/git-configuration#git.deploymentenabled).

캐릭터 참조는 이미 공개된 위 고정 커밋의 `cat.png`입니다. 원본 141×94 RGBA는 보존했고, 입력 규격용 564×376 RGBA 사본은 nearest-neighbor 4배 정수 확대를 적용해 모든 픽셀·알파가 정확한 4×4 복제임을 검증했습니다. 원본 게임의 포즈·288프레임·저장 데이터는 교체하지 않습니다.
