import { NextApiRequest, NextApiResponse } from "next";
import * as cookie from "cookie";
import crypto from "crypto";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { password } = req.body;

    // 🛡️ Sentinel: Removed hardcoded password.
    // Ensure ADMIN_PASSWORD is set in environment variables.
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword) {
      console.error("Critical Security Error: ADMIN_PASSWORD environment variable is not set.");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // 🛡️ Sentinel: Prevent timing attacks using constant-time comparison
    const safeCompare = (a: string, b: string) => {
      const bufferA = crypto.createHash('sha256').update(a).digest();
      const bufferB = crypto.createHash('sha256').update(b).digest();
      return crypto.timingSafeEqual(bufferA, bufferB);
    }

    if (password && typeof password === 'string' && safeCompare(password, correctPassword)) {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("authToken", "authenticated", {
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
