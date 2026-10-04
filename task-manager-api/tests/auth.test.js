const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET ||= 'test-only-secret-for-practical-7';

const {
  validateRegisterInput,
  validateLoginInput,
  validateTaskPayload,
  validateTaskUpdatePayload,
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

test('validators reject non-object request bodies', () => {
  assert.equal(validateRegisterInput(null).isValid, false);
  assert.equal(validateLoginInput([]).isValid, false);
  assert.equal(validateTaskPayload(null).isValid, false);
});

test('validateTaskUpdatePayload rejects invalid fields before persistence', () => {
  assert.equal(validateTaskUpdatePayload({}).isValid, false);
  assert.equal(validateTaskUpdatePayload({ title: '  ' }).isValid, false);
  assert.equal(validateTaskUpdatePayload({ completed: 'false' }).isValid, false);
  assert.deepEqual(validateTaskUpdatePayload({ completed: false }), {
    isValid: true,
    completed: false,
  });
});

test('buildAuthToken returns a JWT that expires in one hour', () => {
  const token = buildAuthToken({ id: 'user-123', email: 'test@example.com' });
  assert.equal(typeof token, 'string');
  assert.ok(token.length > 20);
  const claims = jwt.verify(token, process.env.JWT_SECRET);
  assert.equal(claims.exp - claims.iat, 60 * 60);
});
