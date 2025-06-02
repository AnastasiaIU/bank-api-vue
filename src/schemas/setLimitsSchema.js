import * as yup from 'yup'
import { amountAboveZeroRule, amountNotZeroRule } from './rules'

export default yup.object({
  accounts: yup.array().of(
    yup.object({
      dailyLimit: amountAboveZeroRule,
      withdrawLimit: amountAboveZeroRule,
      absoluteLimit: amountNotZeroRule
    })
  )
})
