import * as yup from 'yup'
import { amountAboveZeroRule } from './rules'
import { ibanRule } from './rules'

export default yup.object({
    fromAccount: ibanRule,
    toAccount: ibanRule
        .test(
      'not-same-iban',
      'From and To IBAN cannot be the same',
      function (value) {
        return value !== this.parent.fromAccount;
      }
    ),
    amount: amountAboveZeroRule,
    description: yup.string().nullable()
})