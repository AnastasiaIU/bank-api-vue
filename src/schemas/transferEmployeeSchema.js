import * as yup from 'yup'
import { amountAboveZeroRule } from './rules'
import { ibanRule } from './rules'

export default yup.object({
    fromAccount: ibanRule,
    toAccount: ibanRule,
    amount: amountAboveZeroRule,
    description: yup.string().nullable()
})