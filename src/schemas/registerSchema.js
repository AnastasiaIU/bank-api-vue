import * as yup from 'yup'
import { emailRule, firstNameRule, lastNameRule, passwordRule, confirmPasswordRule, phoneRule, bsnRule } from './rules'

export default yup.object({
    email: emailRule,
    firstName: firstNameRule,
    lastName: lastNameRule,
    bsn: bsnRule,
    phoneNumber: phoneRule,
    password: passwordRule,
    confirmPassword: confirmPasswordRule
})