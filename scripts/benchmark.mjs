import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';

const PORT = 3002;
const REPORT_PATH = './lighthouse-report.html';

async function runBenchmark() {
  console.log('Building app for production...');
  try {
    execSync('pnpm build', { stdio: 'inherit' });
  } catch (e) {
    console.error('Build failed', e);
    process.exit(1);
  }

  console.log(`Starting static server on port ${PORT}...`);
  // Use serve to serve the 'out' directory
  // Note: 'serve' CLI arguments are often `serve [dir] -p [port]` or `serve -s [dir] -l [port]`
  // Using `pnpm start` which is now mapped to `serve out` requires us to override port if possible,
  // or we can just call `npx serve` directly here to be sure.
  // Using direct serve call is safer for scripting.
  const server = spawn('npx', ['serve', 'out', '-l', PORT.toString()], {
    stdio: 'pipe',
    shell: true,
    env: { ...process.env }
  });

  let serverReady = false;

  // Wait for server to be ready
  await new Promise((resolve) => {
    server.stdout.on('data', (data) => {
      const output = data.toString();
      // console.log(output);
      if (output.includes('Accepting connections') || output.includes('localhost')) {
        serverReady = true;
        resolve();
      }
    });

    server.stderr.on('data', (data) => {
        // serve sometimes outputs info to stderr too
        const output = data.toString();
        // console.log(output);
        if (output.includes('Accepting connections') || output.includes('localhost')) {
            serverReady = true;
            resolve();
        }
    });

    // Fallback delay
    setTimeout(() => {
        console.log('Timeout waiting for server stdout match, proceeding anyway...');
        resolve();
    }, 10000);
  });

  if (!serverReady) {
      console.log('Warning: Server might not be ready. Waiting an extra 3 seconds...');
      await new Promise(r => setTimeout(r, 3000));
  } else {
      console.log('Server detected as ready.');
      // Small buffer to ensure port is listening
      await new Promise(r => setTimeout(r, 1000));
  }

  console.log('Launching Chrome...');
  let chromePath = undefined;
  try {
      chromePath = chromium.executablePath();
      console.log(`Using Playwright Chromium at ${chromePath}`);
  } catch (e) {
      console.warn('Could not resolve Playwright chromium path, letting chrome-launcher decide.');
  }

  const chrome = await launch({
      chromeFlags: ['--headless'],
      chromePath: chromePath
  });

  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port
  };

  console.log('Running Lighthouse...');
  try {
      const runnerResult = await lighthouse(`http://localhost:${PORT}`, options);

      const reportHtml = runnerResult.report;
      fs.writeFileSync(REPORT_PATH, reportHtml);

      console.log('Report is done for', runnerResult.lhr.finalUrl);
      if (runnerResult.lhr.categories.performance) {
          console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);
      } else {
          console.log('Performance category missing in report.');
      }
      console.log(`Report saved to ${path.resolve(REPORT_PATH)}`);
  } catch (e) {
      console.error('Lighthouse run failed:', e);
  }

  await chrome.kill();

  // Kill the server
  server.kill();
  try {
     process.kill(server.pid);
  } catch (e) {}

  console.log('Done.');
  process.exit(0);
}

runBenchmark();
