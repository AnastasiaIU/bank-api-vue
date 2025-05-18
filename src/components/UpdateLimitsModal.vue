<template>
  <div>
    <div
      class="modal fade show"
      tabindex="-1"
      style="display: block"
      aria-modal="true"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <form @submit.prevent="onSubmit">
            <div class="modal-header">
              <h5 class="modal-title">Update Account Limits</h5>
              <button
                type="button"
                class="btn-close"
                @click="$emit('close')"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <BaseInput
                name="dailyLimit"
                label="Enter daily limit"
                type="currency"
              />
              <BaseInput
                name="absoluteLimit"
                label="Enter absolute limit"
                type="currency"
              />
              <BaseInput
                name="withdrawLimit"
                label="Enter withdraw limit"
                type="currency"
              />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="$emit('close')"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { watch } from "vue";
import { useForm } from "vee-validate";

import BaseInput from "@/components/shared/forms/BaseInput.vue";

import updateLimitsSchema from "@/schemas/updateLimitsSchema";
import { parseEuro, formatEuro } from "@/utils/formatters";


const props = defineProps({
  account: {
    type: Object,
    required: true,
  },
});

const formContext = useForm({
  validationSchema: updateLimitsSchema,
});

const { handleSubmit, resetForm } = formContext;

const emit = defineEmits(["close", "submit"]);

watch(
  () => props.account,
  (account) => {
    if (account) {
      resetForm({
        values: {
          dailyLimit: account.dailyLimit ? formatEuro(account.dailyLimit) : "",
          absoluteLimit: account.absoluteLimit
            ? formatEuro(account.absoluteLimit)
            : "",
          withdrawLimit: account.withdrawLimit
            ? formatEuro(account.withdrawLimit)
            : "",
        },
      });
    }
  },
  { immediate: true }
);

const onSubmit = handleSubmit(async (values) => {
  emit("submit", {
    iban: props.account.iban,
    dailyLimit: parseEuro(values.dailyLimit),
    absoluteLimit: parseEuro(values.absoluteLimit),
    withdrawLimit: parseEuro(values.withdrawLimit),
  });
});
</script>
