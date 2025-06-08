import * as yup from 'yup'
import { amountAboveZeroRule, amountZeroAndNegativeRule } from './rules'

export default yup.object({
  accounts: yup.array().of(
    yup.object({
      dailyLimit: amountAboveZeroRule,
      withdrawLimit: amountAboveZeroRule,
      absoluteLimit: amountZeroAndNegativeRule
    })
  )
})
