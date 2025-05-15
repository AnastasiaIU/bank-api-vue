import * as yup from 'yup'
import { amountRule } from './rules'

export default yup.object({
    amount: amountRule
})