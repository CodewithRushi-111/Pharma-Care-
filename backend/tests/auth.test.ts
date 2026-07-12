import { CryptoHelper, JwtHelper } from '../src/utils';
import { UserRole } from '../src/constants';

describe('Auth Utilities - Crypto & JWT Token Verification', () => {
  it('should generate a 6-digit numeric OTP', () => {
    const otp = CryptoHelper.generateOtp();
    expect(otp).toMatch(/^\d{6}$/);
    expect(otp.length).toBe(6);
  });

  it('should generate deterministic SHA-256 hashes for token rotation verification', () => {
    const rawToken = 'sample_refresh_token_string_enterprise_test';
    const hash1 = CryptoHelper.hashToken(rawToken);
    const hash2 = CryptoHelper.hashToken(rawToken);
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64); // SHA-256 hex output length
  });

  it('should sign and successfully verify valid access tokens with user payload and role', () => {
    const payload = { userId: '123e4567-e89b-12d3-a456-426614174000', role: UserRole.DOCTOR };
    const token = JwtHelper.generateAccessToken(payload);

    expect(typeof token).toBe('string');

    const decoded = JwtHelper.verifyAccessToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.role).toBe(payload.role);
  });

  it('should generate refresh token along with its hashed storage string', () => {
    const payload = { userId: '98765432-e89b-12d3-a456-426614174000' };
    const { token, hash } = JwtHelper.generateRefreshToken(payload);

    expect(typeof token).toBe('string');
    expect(typeof hash).toBe('string');
    expect(hash).toBe(CryptoHelper.hashToken(token));
  });
});
