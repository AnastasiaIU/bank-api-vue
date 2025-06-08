import * as yup from 'yup'
import { amountAboveZeroRule, amountZeroAndNegativeRule } from './rules'

export default yup.object({
  dailyLimit: amountAboveZeroRule,
  absoluteLimit: amountZeroAndNegativeRule,
  withdrawLimit: amountAboveZeroRule
})
