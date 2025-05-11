import * as yup from 'yup'
import { emailRule, passwordRule } from './rules'

export default yup.object({
    email: emailRule,
    password: passwordRule,
})