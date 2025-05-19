import * as yup from 'yup'
import { amountRule } from './rules'
import { ibanRule } from './rules'

export default yup.object({
    fromAccountIban: ibanRule,
    toAccountIban: ibanRule,
    amount: amountRule,
    description: yup.string().nullable()
})