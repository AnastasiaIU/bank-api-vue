import * as yup from 'yup'
import { amountAboveZeroRule, amountNotZeroRule } from './rules'

export default yup.object({
  dailyLimit: amountAboveZeroRule,
  absoluteLimit: amountNotZeroRule,
  withdrawLimit: amountAboveZeroRule
})
