# 냥력발전소 웹사이트

버전 공지와 Windows 개발판 다운로드를 제공하는 한국어 정적 사이트입니다. 웹 코드와 공개용 애셋만 관리하며 게임 소스/개인 저장/QA 로그/게임 ZIP은 Git에 넣지 않습니다.

- 공개 웹사이트: https://cat-power-web.vercel.app
- Git 저장소: https://github.com/dowtori/cat-power-web
- 게임 배포: https://github.com/dowtori/cat-power-web/releases
- Vercel 프로젝트: `dowtoris-projects/cat-power-web`, main 브랜치 Git 자동 배포 연결 완료.

## 구성과 실행

- Node.js 22 이상, 외부 런타임 의존성 없음.
- `npm run dev`: http://127.0.0.1:4173 로컬 미리보기.
- `npm test`: 버전 순서, 다운로드 메타데이터, 링크 및 애셋 검사.
- `npm run build`: `dist/` 생성. 공지와 링크는 서버에서 미리 생성되어 JavaScript 없이 동작합니다.
- `src.html`: 페이지 구성, `public/style.css`: 반응형 디자인.
- `content/releases.json`: 버전, 날짜, 공지, 다운로드 URL/크기/SHA-256의 단일 관리 지점. 가장 최신 버전을 맨 위에 둡니다.
- `public/assets`: 게임의 기존 도트 애셋과 격리 QA 화면. 사용한 글꼴의 라이선스를 함께 포함합니다. 합성 소개 연출과 실행 화면을 구분해 표시합니다.

## Git + Vercel 적합도

공지/다운로드 안내는 로그인·DB·서버 함수가 필요 없는 정적 콘텐츠이므로 Git과 Vercel에 적합합니다. Git으로 공지 변경을 검토하고, Vercel Git 연동으로 main 배포와 브랜치 미리보기를 관리합니다. Framework preset은 Other, Build command는 `npm run build`, Output directory는 `dist`입니다.

게임 ZIP은 약 160MB이므로 Vercel 빌드 및 웹 Git 저장소와 분리해 공개 GitHub Releases에서 제공합니다. 게임 소스를 공개할 필요 없이 웹 저장소에 ZIP 자산만 게시할 수 있습니다. GitHub release 개별 파일 한도는 2GiB입니다. Vercel Hobby는 개인 비상업적 용도에 한정되므로 상업화 시 요금제 재검토가 필요합니다.

공식 참고: https://vercel.com/docs/git / https://vercel.com/docs/plans/hobby / https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases

## 다음 게임 업데이트

1. 게임 프로젝트에서 VERSION.txt/CHANGELOG.md와 빌드를 갱신하고 해당 버전 QA를 완료합니다. 이 저장소의 사이트 검사는 게임 QA를 대체하지 않습니다.
2. `content/releases.json` 맨 위에 공지를 추가합니다. 아직 파일이 공개되지 않았다면 `download: null`을 사용합니다. `preview`/`stable`을 명시하며 미출시 버전을 정식 출시로 표현하지 않습니다.
3. Windows에서 `pwsh -File scripts/package-game.ps1 -GameRoot ../cat-power` 실행. 빌드 manifest의 실행 파일 및 애셋 해시를 검증하고 ZIP/체크섬/다운로드 메타데이터를 artifacts에 생성합니다. 과거 버전 ZIP은 덮어쓰지 않습니다.
4. GitHub에 `v버전` release를 만들고 ZIP과 SHA256SUMS를 첨부합니다. 개발판은 prerelease로 게시합니다. 자동 생성되는 Source code ZIP은 게임 배포 파일이 아닙니다.
5. 공개 다운로드가 정상인지 확인한 후 `artifacts/download-버전.json`의 객체를 해당 공지의 `download`에 넣습니다.
6. `npm test`, `npm run build` 후 변경을 commit/push합니다. Vercel의 새 배포에서 공지와 다운로드 링크를 확인합니다. 별도 승인 병합이 필요한 경우 저장소 브랜치 보호를 설정합니다.

다운로드 URL은 버전 고정 주소를 사용하므로 사이트를 이전 커밋으로 롤백해도 그 버전의 파일과 해시가 일치합니다. 공개된 ZIP을 같은 버전 이름으로 교체하지 마세요. 새 버전을 발행하세요.

## 공개 범위

웹 애셋에 별도 오픈소스 사용권을 부여하지 않습니다. 글꼴은 동봉한 각 라이선스를 따릅니다. 게임은 Windows .NET Framework 4.x 앱이며 실행 파일 옆에 전체 assets 폴더가 필요합니다. 개발판 실행 파일은 서명되지 않았으므로 Windows 경고가 있을 수 있습니다. 저장은 `%LOCALAPPDATA%/CatPower/companion-reboot/save.json`입니다.
