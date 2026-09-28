import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { validate, build, root, escape } from './build.mjs';
const data = JSON.parse(await readFile(path.join(root, 'content/releases.json'), 'utf8'));
test('release metadata rejects unsafe and mismatched downloads', () => {
  const bad = structuredClone(data);
  bad.releases[0].download = {url:'javascript:alert(1)',bytes:100,sha256:'a'.repeat(64)};
  assert.throws(() => validate(bad), /download/);
  bad.releases[0].download.url = `https://github.com/${data.repository}/releases/download/v0.4.2/CatPower-v0.4.2-windows.zip`;
  assert.throws(() => validate(bad), /download/);
});
test('release ordering and versions protect the latest download', () => {
  const bad = structuredClone(data); bad.releases.reverse();
  assert.throws(() => validate(bad), /newest/);
  const duplicate = structuredClone(data); duplicate.releases.push(duplicate.releases[0]);
  assert.throws(() => validate(duplicate), /duplicate/);
});
test('release content is escaped', () => assert.equal(escape('<script>"&'), '&lt;script&gt;&quot;&amp;'));
test('build produces real assets, anchor targets and rendered release notes', async () => {
  await build();
  const html = await readFile(path.join(root, 'dist/index.html'), 'utf8');
  assert.ok(!html.includes('{{'));
  assert.ok(html.includes('lang="ko"'));
  assert.ok(html.includes(`v${data.releases[0].version}`));
  for (const match of html.matchAll(/(?:src|href)="(\/[^"#]+)"/g)) await access(path.join(root, 'dist', match[1]));
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`), `Missing anchor ${match[1]}`);
  const d = data.releases[0].download;
  assert.ok(d ? html.includes(d.url) && html.includes(d.sha256) : html.includes('다운로드 파일을 준비하고 있어요.'));
});
