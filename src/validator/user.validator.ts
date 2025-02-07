import validator from 'validator';

export function isaValidEmail(email: string): boolean {
  return validator.isEmail(email); // Return true or false
}
