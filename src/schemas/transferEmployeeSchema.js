import * as yup from 'yup'
import { amountRule } from './rules'
import { ibanRule } from './rules'

export default yup.object({
    fromAccount: ibanRule,
    toAccount: ibanRule,
    amount: amountRule,
    description: yup.string().nullable()
})