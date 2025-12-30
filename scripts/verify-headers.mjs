
import nextConfig from '../next.config.mjs';

async function verifyHeaders() {
  console.log("Verifying headers...");
  if (!nextConfig.headers) {
    console.error("No headers function defined in next.config.mjs");
    process.exit(1);
  }

  const headersList = await nextConfig.headers();
  const globalHeaders = headersList.find(h => h.source === '/:path*');

  if (!globalHeaders) {
    console.error("No global headers configured for source '/:path*'");
    process.exit(1);
  }

  const csp = globalHeaders.headers.find(h => h.key === 'Content-Security-Policy');
  const hsts = globalHeaders.headers.find(h => h.key === 'Strict-Transport-Security');

  if (csp) {
    console.log("✅ CSP Found:", csp.value);
  } else {
    console.error("❌ CSP Missing");
  }

  if (hsts) {
    console.log("✅ HSTS Found:", hsts.value);
  } else {
    console.error("❌ HSTS Missing");
  }
}

verifyHeaders().catch(err => console.error(err));
