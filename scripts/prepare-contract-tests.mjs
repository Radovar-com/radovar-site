import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const target = process.env.OWNED_ANALYTICS_SITE_ROOT ?? path.join(root, '.superpowers', 'test-contract');
const revision = '46cd62502c0f7878efec739efda8e544e39e03ec';
if (!existsSync(target)) {
  mkdirSync(path.dirname(target), { recursive: true });
  execFileSync('git', ['clone', '--no-checkout', 'https://github.com/Radovar-com/codevalanche-site.git', target], { stdio: 'inherit' });
  execFileSync('git', ['-C', target, 'checkout', '--detach', revision], { stdio: 'inherit' });
}
const actual = execFileSync('git', ['-C', target, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (actual !== revision) throw new Error('Contract fixture revision differs from the reviewed CI revision');
console.log('Shared analytics contract fixture is pinned and ready.');
