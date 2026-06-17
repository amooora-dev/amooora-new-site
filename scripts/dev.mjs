#!/usr/bin/env node
/**
 * Sobe o Next.js em dev com um único processo na porta do projeto.
 * Evita o erro recorrente "Cannot find module './NNN.js'" causado por
 * múltiplos `next dev` competindo pelo mesmo cache `.next`.
 */
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = process.env.PORT ?? '3000';
const forceClean = process.argv.includes('--clean');
const devDistDir = process.env.NEXT_DIST_DIR ?? '.next-dev';

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function killListenersOnPort(p) {
  try {
    const pids = execSync(`lsof -ti tcp:${p}`, { encoding: 'utf8' }).trim();
    if (!pids) return;
    for (const pid of pids.split(/\s+/)) {
      try {
        process.kill(Number(pid), 'SIGTERM');
      } catch {
        /* processo já encerrado */
      }
    }
  } catch {
    /* porta livre */
  }
}

function killProjectNextDev() {
  try {
    execSync(
      `pkill -f "${root}/node_modules/.bin/next dev" 2>/dev/null || true`,
      { stdio: 'ignore' },
    );
  } catch {
    /* nenhum processo */
  }
}

function cleanNextCache() {
  const nextDir = path.join(root, devDistDir);
  if (!fs.existsSync(nextDir)) return;

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 150 });
      console.log(`[dev] cache ${devDistDir} removido`);
      return;
    } catch (error) {
      if (attempt === 5) throw error;
      sleepSync(250);
    }
  }
}

function cacheLooksCorrupt() {
  const nextDir = path.join(root, devDistDir);
  if (!fs.existsSync(nextDir)) return false;

  const serverDir = path.join(nextDir, 'server');
  const runtime = path.join(serverDir, 'webpack-runtime.js');
  if (!fs.existsSync(runtime)) return false;

  try {
    const runtimeSrc = fs.readFileSync(runtime, 'utf8');
    const chunkRefs = [...runtimeSrc.matchAll(/['"]\.\/(\d+)\.js['"]/g)].map((m) => m[1]);
    if (chunkRefs.length === 0) return false;

    return chunkRefs.some((id) => {
      const inServer = path.join(serverDir, `${id}.js`);
      const inChunks = path.join(serverDir, 'chunks', `${id}.js`);
      return !fs.existsSync(inServer) && !fs.existsSync(inChunks);
    });
  } catch {
    return true;
  }
}

killListenersOnPort(port);
killProjectNextDev();

if (forceClean) {
  cleanNextCache();
} else if (cacheLooksCorrupt()) {
  console.log('[dev] cache .next inconsistente — limpando automaticamente');
  cleanNextCache();
}

setTimeout(() => {
  const child = spawn('./node_modules/.bin/next', ['dev', '-p', port], {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    env: { ...process.env, NEXT_DIST_DIR: devDistDir },
  });

  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 0);
  });
}, 400);
