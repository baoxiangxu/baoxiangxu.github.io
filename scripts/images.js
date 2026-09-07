#!/usr/bin/env node
/**
 * Runs scripts/optimize_images.py with whichever Python this machine has.
 *
 * `python3` is the command on macOS and Linux; on Windows it is usually
 * `python` or the `py` launcher, and the bare name `python3` often opens the
 * Microsoft Store instead of running anything. So probe, then run.
 */
const { spawnSync } = require('child_process');
const path = require('path');

const candidates =
  process.platform === 'win32'
    ? [['py', ['-3']], ['python', []], ['python3', []]]
    : [['python3', []], ['python', []]];

const script = path.join(__dirname, 'optimize_images.py');
const root = path.join(__dirname, '..');

for (const [cmd, prefix] of candidates) {
  const probe = spawnSync(cmd, [...prefix, '-c', 'import PIL'], { stdio: 'ignore' });
  if (probe.status === 0) {
    const run = spawnSync(cmd, [...prefix, script, root], { stdio: 'inherit' });
    process.exit(run.status ?? 1);
  }
}

console.error(
  '\nCould not find a Python with Pillow installed.\n\n' +
    '  macOS / Linux:  pip3 install pillow\n' +
    '  Windows:        py -3 -m pip install pillow\n\n' +
    'Install Python from https://www.python.org if you do not have it.\n'
);
process.exit(1);
