import { NextApiRequest, NextApiResponse } from "next";
import * as cookie from "cookie";
import crypto from "crypto";
import { rateLimit } from "@/utils/rateLimit";

// 🛡️ Sentinel: Pre-compute the hash of the correct password to avoid re-hashing on every request.
// This assumes ADMIN_PASSWORD does not change during runtime.
const correctPassword = process.env.ADMIN_PASSWORD;
const correctPasswordHash = correctPassword
  ? crypto.createHash('sha256').update(correctPassword).digest()
  : undefined;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { password } = req.body;

    if (!correctPasswordHash) {
      console.error("Critical Security Error: ADMIN_PASSWORD environment variable is not set.");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // 🛡️ Sentinel: Rate limiting to prevent brute force attacks
    // Handle x-forwarded-for safely whether it's string or array
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded?.[0]) || req.socket.remoteAddress || 'unknown';

    if (!rateLimit(ip, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
      return res.status(429).json({ message: "Too many attempts. Please try again later." });
    }

    // 🛡️ Sentinel: Validate input type and length to prevent DoS
    if (!password || typeof password !== 'string' || password.length > 128) {
       // Return generic error to avoid leaking details
       return res.status(401).json({ message: "Incorrect password" });
    }

    // 🛡️ Sentinel: Prevent timing attacks using constant-time comparison
    const bufferA = crypto.createHash('sha256').update(password).digest();

    if (crypto.timingSafeEqual(bufferA, correctPasswordHash)) {
      // 🛡️ Sentinel: Sign the cookie to prevent tampering
      // We know correctPassword is defined here because correctPasswordHash check passed
      const val = "authenticated";
      // Add expiration to the signed payload (1 hour from now) to prevent infinite replay
      const expiry = Date.now() + 60 * 60 * 1000;
      const dataToSign = `${val}.${expiry}`;

      const signature = crypto.createHmac('sha256', correctPassword as string).update(dataToSign).digest('hex');
      const cookieValue = `${dataToSign}.${signature}`;

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("authToken", cookieValue, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60,
          sameSite: "strict",
          path: "/",
        })
      );
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ message: "Incorrect password" });
    }
  }
  return res.status(405).json({ message: "Method Not Allowed" });
}
