import { NextApiRequest, NextApiResponse } from "next";
import * as cookie from "cookie";
import crypto from "crypto";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const authToken = cookies.authToken;

  if (!authToken) {
    return res.status(401).json({ authenticated: false });
  }

  // 🛡️ Sentinel: Verify cookie signature to prevent auth bypass
  const parts = authToken.split('.');

  // Handle cases where the cookie is just "authenticated" or invalid format
  if (parts.length !== 3) {
      return res.status(401).json({ authenticated: false });
  }

  const [val, expiryStr, signature] = parts;
  const secret = process.env.ADMIN_PASSWORD;

  if (!secret || !val || !expiryStr || !signature) {
    // If secret is missing, we can't verify, so fail closed.
    console.error("Critical: ADMIN_PASSWORD not set");
    return res.status(500).json({ authenticated: false });
  }

  const expiry = parseInt(expiryStr, 10);
  if (isNaN(expiry)) {
     return res.status(401).json({ authenticated: false });
  }

  // Check expiration
  if (Date.now() > expiry) {
     return res.status(401).json({ authenticated: false });
  }

  // 🛡️ Sentinel: Bind session to User-Agent
  // Re-compute the hash from current request headers
  const ua = req.headers['user-agent'] || '';
  const uaHash = crypto.createHash('sha256').update(ua).digest('hex');

  const dataToVerify = `${val}.${expiryStr}.${uaHash}`;
  const expectedSignature = crypto.createHmac('sha256', secret).update(dataToVerify).digest('hex');

  // Use timingSafeEqual to prevent timing attacks
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  let valid = false;
  if (signatureBuffer.length === expectedBuffer.length) {
    valid = crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  }

  if (valid && val === "authenticated") {
    return res.status(200).json({ authenticated: true });
  } else {
    // 🛡️ Sentinel: Log invalid signature as potential tampering attempt
    console.warn(`[SECURITY] Invalid cookie signature detected.`);
    return res.status(401).json({ authenticated: false });
  }
}
