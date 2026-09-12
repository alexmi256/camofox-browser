#!/usr/bin/env node
// Tolerant postinstall: fetch Camoufox browser binaries, but never fail the
// install when the fetch does (offline mirror, blocked egress, etc.).
//
// NOTE: the naive `npx camoufox-js fetch || true` is not portable — `true`
// is not a Windows command, so any fetch hiccup fails `npm ci` outright on
// Windows (cmd.exe) while being silently tolerated on POSIX shells. This
// wrapper keeps the "best effort" intent on every platform.
import { spawnSync } from 'node:child_process';

const result = spawnSync('npx', ['camoufox-js', 'fetch'], { stdio: 'inherit' });
if (result.error || result.status !== 0) {
  const reason = result.error ? result.error.message : `exit code ${result.status}`;
  console.warn(`warning: camoufox browser fetch did not complete (${reason}); continuing without freshly fetched binaries.`);
}
process.exitCode = 0;
