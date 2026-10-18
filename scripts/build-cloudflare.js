import fs from 'fs';
import path from 'path';

// Clean up any problematic _redirects files that cause Cloudflare code 100324
const targets = ['dist/_redirects', 'public/_redirects', '_redirects'];
targets.forEach((file) => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`[Cloudflare Pre-deploy] Removed conflicting redirect file: ${file}`);
    }
  } catch (err) {
    // Ignore errors
  }
});

// Create 200.html for native Cloudflare Pages / SPA fallback
try {
  if (fs.existsSync('dist/index.html')) {
    fs.copyFileSync('dist/index.html', 'dist/200.html');
    console.log('[Cloudflare Pre-deploy] Successfully created dist/200.html for native SPA routing');
  }
} catch (err) {
  console.error('[Cloudflare Pre-deploy] Could not create 200.html', err);
}
