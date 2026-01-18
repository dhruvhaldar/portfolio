import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as crypto from 'crypto';
import * as cookie from 'cookie';

describe('Authentication Security', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv, ADMIN_PASSWORD: 'test-secure-password', NODE_ENV: 'test' };
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('should authenticate with correct password and return signed cookie and log success', async () => {
    const authenticate = (await import('../pages/api/authenticate')).default;
    const req = {
      method: 'POST',
      body: { password: 'test-secure-password' },
      headers: { 'user-agent': 'test-agent' },
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
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('[SECURITY] Login successful. IP: 127.0.0.1'));
  });

  it('should fail authentication with incorrect password and log warning', async () => {
    const authenticate = (await import('../pages/api/authenticate')).default;
    const req = {
      method: 'POST',
      body: { password: 'wrong-password' },
      headers: { 'user-agent': 'test-agent' },
      socket: { remoteAddress: '127.0.0.1' },
    } as any;
    const res = {
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    await authenticate(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('[SECURITY] Login failed. IP: 127.0.0.1'));
  });

  it('should reject forged "authenticated" cookie', async () => {
    const checkAuth = (await import('../pages/api/check-auth')).default;
    const req = {
      headers: { cookie: 'authToken=authenticated', 'user-agent': 'test-agent' },
      socket: { remoteAddress: '127.0.0.1' },
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
      headers: { cookie: `authToken=${legacyCookie}`, 'user-agent': 'test-agent' },
      socket: { remoteAddress: '127.0.0.1' },
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
    const ua = 'test-agent';
    const uaHash = crypto.createHash('sha256').update(ua).digest('hex');

    // Updated dataToSign includes uaHash
    const dataToSign = `${value}.${expiredTime}.${uaHash}`;
    const signature = crypto.createHmac('sha256', secret).update(dataToSign).digest('hex');
    const expiredCookie = `${value}.${expiredTime}.${signature}`;

    const req = {
      headers: { cookie: `authToken=${expiredCookie}`, 'user-agent': ua },
      socket: { remoteAddress: '127.0.0.1' },
    } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    await checkAuth(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should accept valid signed cookie with matching User-Agent', async () => {
     const checkAuth = (await import('../pages/api/check-auth')).default;
     const secret = 'test-secure-password';
     const value = 'authenticated';
     const expiry = Date.now() + 60 * 60 * 1000; // 1 hour future
     const ua = 'test-agent';
     const uaHash = crypto.createHash('sha256').update(ua).digest('hex');

     const dataToSign = `${value}.${expiry}.${uaHash}`;
     const signature = crypto.createHmac('sha256', secret).update(dataToSign).digest('hex');
     const validCookie = `${value}.${expiry}.${signature}`;

     const req = {
       headers: { cookie: `authToken=${validCookie}`, 'user-agent': ua },
       socket: { remoteAddress: '127.0.0.1' },
     } as any;
     const res = {
       status: vi.fn().mockReturnThis(),
       json: vi.fn(),
     } as any;

     await checkAuth(req, res);

     expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should reject valid cookie if User-Agent does not match (Session Hijacking)', async () => {
     const checkAuth = (await import('../pages/api/check-auth')).default;
     const secret = 'test-secure-password';
     const value = 'authenticated';
     const expiry = Date.now() + 60 * 60 * 1000;

     // Original User-Agent used to sign
     const originalUa = 'original-agent';
     const originalUaHash = crypto.createHash('sha256').update(originalUa).digest('hex');

     const dataToSign = `${value}.${expiry}.${originalUaHash}`;
     const signature = crypto.createHmac('sha256', secret).update(dataToSign).digest('hex');
     const validCookie = `${value}.${expiry}.${signature}`;

     // Request comes from a DIFFERENT User-Agent
     const req = {
       headers: { cookie: `authToken=${validCookie}`, 'user-agent': 'hacker-agent' },
       socket: { remoteAddress: '127.0.0.1' },
     } as any;
     const res = {
       status: vi.fn().mockReturnThis(),
       json: vi.fn(),
     } as any;

     await checkAuth(req, res);

     // Should fail because signature won't match the new User-Agent hash
     expect(res.status).toHaveBeenCalledWith(401);
     expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('[SECURITY] Invalid cookie signature detected'));
  });

  it('should log warning for invalid signature (tampering)', async () => {
     const checkAuth = (await import('../pages/api/check-auth')).default;
     const value = 'authenticated';
     const expiry = Date.now() + 60 * 60 * 1000;
     const ua = 'test-agent';
     const uaHash = crypto.createHash('sha256').update(ua).digest('hex');

     const dataToSign = `${value}.${expiry}.${uaHash}`;
     const invalidSignature = 'deadbeef'; // Wrong signature
     const tamperedCookie = `${value}.${expiry}.${invalidSignature}`;

     const req = {
       headers: { cookie: `authToken=${tamperedCookie}`, 'user-agent': ua },
       socket: { remoteAddress: '127.0.0.1' },
     } as any;
     const res = {
       status: vi.fn().mockReturnThis(),
       json: vi.fn(),
     } as any;

     await checkAuth(req, res);

     expect(res.status).toHaveBeenCalledWith(401);
     expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('[SECURITY] Invalid cookie signature detected'));
  });

  it('should enforce rate limiting on check-auth', async () => {
    const checkAuth = (await import('../pages/api/check-auth')).default;
    const req = {
      headers: { cookie: 'authToken=foo', 'user-agent': 'test-agent' },
      socket: { remoteAddress: '127.0.0.1' },
    } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    // Simulate flooding
    for (let i = 0; i < 110; i++) {
        await checkAuth(req, res);
    }

    expect(res.status).toHaveBeenCalledWith(429);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('[SECURITY] Rate limit exceeded'));
  });
});
