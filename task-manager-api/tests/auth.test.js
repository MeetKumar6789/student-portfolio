const test = require('node:test');
const assert = require('node:assert/strict');

const {
  validateRegisterInput,
  validateLoginInput,
  validateTaskPayload,
  buildAuthToken,
} = require('../utils/auth');

test('validateRegisterInput rejects missing email', () => {
  const result = validateRegisterInput({ password: 'secret123' });
  assert.equal(result.isValid, false);
  assert.match(result.message, /email/i);
});

test('validateLoginInput accepts valid credentials', () => {
  const result = validateLoginInput({ email: 'test@example.com', password: 'secret123' });
  assert.equal(result.isValid, true);
});

test('validateTaskPayload rejects empty title', () => {
  const result = validateTaskPayload({ title: '   ', priority: 'high' });
  assert.equal(result.isValid, false);
  assert.match(result.message, /title/i);
});

test('buildAuthToken returns a JWT-like string', () => {
  const token = buildAuthToken({ id: 'user-123', email: 'test@example.com' });
  assert.equal(typeof token, 'string');
  assert.ok(token.length > 20);
});
