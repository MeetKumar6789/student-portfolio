export function validateContactSubmission({ name, email, message }) {
  const trimmedName = String(name ?? '').trim();
  const trimmedEmail = String(email ?? '').trim();
  const trimmedMessage = String(message ?? '').trim();
  const errors = [];

  if (!trimmedName) {
    errors.push('Please enter your full name.');
  }

  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.push('Please enter a valid email address.');
  }

  if (!trimmedMessage) {
    errors.push('Please provide a message before submitting.');
  } else if (trimmedMessage.length < 12) {
    errors.push('Your message should be at least 12 characters long.');
  }

  return {
    valid: errors.length === 0,
    errors,
    payload: {
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    },
  };
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function processContactSubmission(formData, options = {}) {
  const { delay = 1800, shouldFail = false } = options;
  const validation = validateContactSubmission(formData);

  if (!validation.valid) {
    throw new Error(validation.errors[0]);
  }

  await wait(delay);

  if (shouldFail) {
    throw new Error('Simulated processing failed due to a temporary contact-service outage.');
  }

  return {
    success: true,
    message: 'Simulated processing completed successfully.',
    payload: validation.payload,
  };
}
