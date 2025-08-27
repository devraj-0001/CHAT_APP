export function validateEmail(email) {
  // Regex pattern for basic email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Test the email against the regex pattern
  return emailRegex.test(email);
}
