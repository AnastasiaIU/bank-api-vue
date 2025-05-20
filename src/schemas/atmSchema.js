import * as yup from 'yup'
import { amountAboveZeroRule } from './rules'

export default yup.object({
    amount: amountAboveZeroRule
})