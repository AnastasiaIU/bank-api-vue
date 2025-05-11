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
