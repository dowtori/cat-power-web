import { readFile, mkdir, cp, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
export const root = fileURLToPath(new URL('../', import.meta.url));
export const escape = (value) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function validate(data) {
  if (!/^[\w-]+\/[\w.-]+$/.test(data.repository) || !data.releases?.length) throw Error('Repository and releases are required');
  const versions = new Set();
  let previous = [Infinity, Infinity, Infinity];
  for (const release of data.releases) {
    if (!/^\d+\.\d+\.\d+$/.test(release.version) || versions.has(release.version)) throw Error('Invalid or duplicate version');
    const version = release.version.split('.').map(Number);
    const different = version.findIndex((n, i) => n !== previous[i]);
    if (different !== -1 && version[different] > previous[different]) throw Error('Releases must be newest first');
    previous = version; versions.add(release.version);
    if (!['preview', 'stable'].includes(release.channel) || !/^\d{4}-\d{2}-\d{2}$/.test(release.date)) throw Error('Invalid release metadata');
    if (!release.title || !release.summary || !release.changes?.length) throw Error('Release notes are required');
    if (release.download) {
      const d = release.download;
      const expected = `https://github.com/${data.repository}/releases/download/v${release.version}/CatPower-v${release.version}-windows.zip`;
      if (d.url !== expected || !/^[a-f0-9]{64}$/.test(d.sha256) || !Number.isSafeInteger(d.bytes) || d.bytes <= 0) throw Error('Invalid download URL, SHA256 or size');
    }
  }
}
export async function build() {
  const data = JSON.parse(await readFile(path.join(root, 'content/releases.json'), 'utf8'));
  validate(data);
  const latest = data.releases[0];
  const download = latest.download;
  const label = latest.channel === 'preview' ? '개발판' : '정식 버전';
  let html = await readFile(path.join(root, 'src.html'), 'utf8');
  const button = download ? `<a class="button download" href="${escape(download.url)}">Windows용 ${label} 다운로드 <span aria-hidden="true">↓</span></a>` : '<p class="pending">다운로드 파일을 준비하고 있어요.</p>';
  const notes = data.releases.map((r, i) => `<article class="release" id="v${r.version}"><div class="release-meta"><span class="version">v${r.version}</span><time datetime="${r.date}">${r.date.replaceAll('-', '.')}</time><span class="tag">${r.channel === 'preview' ? '개발판' : '정식 버전'}</span></div><div><h3>${escape(r.title)}${i === 0 ? '<span class="new">최신</span>' : ''}</h3><p>${escape(r.summary)}</p><details ${i === 0 ? 'open' : ''}><summary>변경 사항 자세히 보기</summary><ul>${r.changes.map(c => `<li>${escape(c)}</li>`).join('')}</ul></details></div></article>`).join('\n');
  const values = {
    VERSION: latest.version, LABEL: label, DATE: latest.date.replaceAll('-', '.'), BUTTON: button,
    SIZE: download ? `${(download.bytes / 1024 / 1024).toFixed(1)} MB` : '파일 준비 중',
    NOTES: notes,
    HASH: download ? `<details class="checksum"><summary>다운로드 파일 확인 · SHA-256</summary><code>${download.sha256}</code><p>다운로드한 ZIP의 해시와 비교할 수 있어요.</p></details>` : '',
    STATUS: latest.channel === 'preview' ? '정식 출시 전 개발판입니다. 게임 내용과 밸런스가 바뀔 수 있어요.' : '현재 공개된 정식 버전입니다.'
  };
  html = html.replace(/\{\{([A-Z]+)\}\}/g, (_, key) => { if (!(key in values)) throw Error(`Unknown template key ${key}`); return values[key]; });
  await mkdir(path.join(root, 'dist'), {recursive:true});
  await cp(path.join(root, 'public'), path.join(root, 'dist'), {recursive:true});
  await writeFile(path.join(root, 'dist/index.html'), html);
  await writeFile(path.join(root, 'dist/releases.json'), JSON.stringify(data, null, 2));
  console.log(`Built site: v${latest.version}, ${download ? 'download ready' : 'download pending'}`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
