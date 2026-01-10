import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as crypto from 'crypto';
import * as cookie from 'cookie';

describe('Authentication Security', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv, ADMIN_PASSWORD: 'test-secure-password', NODE_ENV: 'test' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should authenticate with correct password and return signed cookie', async () => {
    // Import path updated to match new location: ../src/pages/api/authenticate
    // Actually, src/tests is sibling to src/pages? No.
    // src/tests/auth_security.test.ts
    // src/pages/api/authenticate.ts
    // Relative path: ../pages/api/authenticate
    const authenticate = (await import('../pages/api/authenticate')).default;
    const req = {
      method: 'POST',
      body: { password: 'test-secure-password' },
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
    } as any;
    const res = {
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    await authenticate(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', expect.stringContaining('authToken='));
  });

  it('should reject forged "authenticated" cookie', async () => {
    const checkAuth = (await import('../pages/api/check-auth')).default;
    const req = {
      headers: { cookie: 'authToken=authenticated' },
    } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    await checkAuth(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should reject legacy cookie format (no expiry)', async () => {
    const checkAuth = (await import('../pages/api/check-auth')).default;
    const secret = 'test-secure-password';
    const value = 'authenticated';
    const signature = crypto.createHmac('sha256', secret).update(value).digest('hex');
    // Legacy format: value.signature (2 parts)
    const legacyCookie = `${value}.${signature}`;

    const req = {
      headers: { cookie: `authToken=${legacyCookie}` },
    } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    await checkAuth(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should reject expired cookie', async () => {
    const checkAuth = (await import('../pages/api/check-auth')).default;
    const secret = 'test-secure-password';
    const value = 'authenticated';
    const expiredTime = Date.now() - 10000; // 10 seconds ago
    const dataToSign = `${value}.${expiredTime}`;
    const signature = crypto.createHmac('sha256', secret).update(dataToSign).digest('hex');
    const expiredCookie = `${dataToSign}.${signature}`;

    const req = {
      headers: { cookie: `authToken=${expiredCookie}` },
    } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    await checkAuth(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should accept valid signed cookie', async () => {
     const checkAuth = (await import('../pages/api/check-auth')).default;
     const secret = 'test-secure-password';
     const value = 'authenticated';
     const expiry = Date.now() + 60 * 60 * 1000; // 1 hour future
     const dataToSign = `${value}.${expiry}`;
     const signature = crypto.createHmac('sha256', secret).update(dataToSign).digest('hex');
     const validCookie = `${dataToSign}.${signature}`;

     const req = {
       headers: { cookie: `authToken=${validCookie}` },
     } as any;
     const res = {
       status: vi.fn().mockReturnThis(),
       json: vi.fn(),
     } as any;

     await checkAuth(req, res);

     expect(res.status).toHaveBeenCalledWith(200);
  });
});
