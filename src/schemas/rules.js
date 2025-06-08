import * as yup from 'yup'

export const emailRule = yup
  .string()
  .required('Email is required')
  .email('Invalid email format')

export const firstNameRule = yup
  .string()
  .required('First name is required')

export const lastNameRule = yup
  .string()
  .required('Last name is required')

export const passwordRule = yup
  .string()
  .required('Password is required')

export const confirmPasswordRule = yup
  .string()
  .required('Confirm your password')
  .oneOf([yup.ref('password')], 'Passwords do not match')

export const phoneRule = yup
  .string()
  .required('Phone is required')
  .matches(/^\+?[0-9]{10,15}$/, 'Phone must be 10–15 digits')

export const bsnRule = yup
  .string()
  .required('BSN is required')
  .matches(/^\d{9}$/, 'BSN must be exactly 9 digits')

export const amountAboveZeroRule = yup
  .string()
  .required('Amount is required')
  .test('is-above-zero', 'Amount must be greater than 0', (value) => {
    if (!value) return false

    // Remove non-numeric characters except dot and comma
    const clean = value.replace(/[^0-9,.\-]/g, '').replace(',', '.')
    const num = parseFloat(clean)

    return !isNaN(num) && num > 0
  })

export const amountNotZeroRule = yup
  .string()
  .required('Amount is required')
  .test('not-zero', 'Amount cannot be zero', (value) => {
    if (!value) return false

    // Remove non-numeric characters except dot and comma
    const clean = value.replace(/[^0-9,.]/g, '').replace(',', '.')
    const num = parseFloat(clean)

    return !isNaN(num) && num > 0
  })

  export const amountZeroAndNegativeRule = yup
  .string()
  .required('Amount is required')
  .test('is-number', 'Amount must be a valid number', (value) => {
    if (!value) return false;

    // Allow digits, minus sign, dot, and comma
    const clean = value.replace(/[^0-9,.\-]/g, '').replace(',', '.');
    const num = parseFloat(clean);

    return !isNaN(num);
  });


export const ibanRule = yup
  .string()
  .required('IBAN is required')
  .matches(/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/, 'Invalid IBAN format')
  .test('iban-length', 'IBAN must be 34 characters', (value) => {
    if (!value) return false
    return value.length >= 15 && value.length <= 34
  })