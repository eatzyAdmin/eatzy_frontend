import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const apps = { customer: 3000, driver: 3001, restaurant: 3002, 'super-admin': 3003, admin: 3004 };
const [mode = 'doctor', ...args] = process.argv.slice(2);
const appArg = args.indexOf('--app');
const app = appArg < 0 ? undefined : args[appArg + 1];
if (args.length && (appArg !== 0 || args.length !== 2 || !Object.hasOwn(apps, app))) {
  console.error('Usage: pnpm agent:check <doctor|typecheck|lint|config|health> [--app customer|driver|restaurant|super-admin|admin]');
  process.exit(1);
}
const selected = app ? [app] : Object.keys(apps);
let failed = false;
function run(command, commandArgs, cwd = root) {
  const result = spawnSync(command, commandArgs, { cwd, stdio: 'inherit' });
  if (result.error) console.error(result.error.message);
  if (result.error || result.status !== 0) failed = true;
}
function runPnpm(commandArgs) {
  const cli = process.env.npm_execpath;
  if (cli && /\.(?:c?js|mjs)$/.test(cli) && existsSync(cli)) {
    run(process.execPath, [cli, ...commandArgs]);
  } else if (process.platform === 'win32') {
    // Arguments below are fixed strings or validated app names, never arbitrary shell input.
    // cmd resolves both pnpm.exe and npm/Corepack pnpm.cmd shims.
    run(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', `pnpm ${commandArgs.join(' ')}`]);
  } else {
    run('pnpm', commandArgs);
  }
}

switch (mode) {
  case 'doctor': {
    console.log(`Node: ${process.version}; package manager: ${JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')).packageManager}`);
    runPnpm(['--version']);
    for (const name of selected) {
      console.log(`${name}: port ${apps[name]}, dependencies ${existsSync(resolve(root, 'apps', name, 'node_modules')) ? 'present' : 'missing'}`);
    }
    console.log('Next builds ignore TypeScript/lint errors in this repository. Run explicit typecheck/lint for changed apps.');
    break;
  }
  case 'typecheck':
    for (const name of selected) runPnpm(['--filter', name, 'exec', 'tsc', '--noEmit', '--incremental', 'false']);
    break;
  case 'lint':
    for (const name of selected) runPnpm(['--filter', name, 'lint']);
    break;
  case 'config':
    for (const name of selected) run(process.execPath, ['--check', resolve(root, 'apps', name, 'next.config.mjs')]);
    break;
  case 'health':
    for (const name of selected) {
      try {
        const url = `http://127.0.0.1:${apps[name]}/api/proxy/actuator/health`;
        const response = await fetch(url, { signal: AbortSignal.timeout(10000), redirect: 'error' });
        const body = await response.json();
        if (!response.ok || body.status !== 'UP') throw new Error(`HTTP ${response.status}, backend not UP`);
        console.log(`${name}: HTTP ${response.status}, backend ${body.status}`);
      } catch (error) { failed = true; console.error(`${name}: ${error.message}`); }
    }
    console.log('Health checks are read-only; they do not establish login, payment or realtime correctness.');
    break;
  default:
    console.error(`Unknown mode: ${mode}`);
    failed = true;
}
if (failed) process.exitCode = 1;
