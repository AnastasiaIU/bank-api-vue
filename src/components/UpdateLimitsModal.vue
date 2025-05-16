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
              label="Enter amount"
              type="currency"
            />
            <BaseInput
              name="absoluteLimit"
              label="Enter amount"
              type="currency"
            />
            <BaseInput
              name="withdrawLimit"
              label="Enter amount"
              type="currency"
            />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="$emit('close')">
              Cancel
            </button>
            <button class="btn btn-primary" @click="submit">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import BaseInput from "@/components/shared/forms/BaseInput.vue";
import updateLimitsSchema from "@/schemas/updateLimitsSchema";

import { useForm } from "vee-validate";

const props = defineProps({
  account: Object,
});

const formContext = useForm({
  validationSchema: updateLimitsSchema,

  initialValues: {
    dailyLimit: props.account?.dailyLimit || "",
    absoluteLimit: props.account?.absoluteLimit || "",
    withdrawLimit: props.account?.withdrawLimit || "",
  },
});

const { handleSubmit, meta } = formContext;

const emit = defineEmits(["close", "submit"]);

const localDailyLimit = ref("");
const localAbsoluteLimit = ref("");
const localWithdrawLimit = ref("");

// Populate modal when prop changes
watch(
  () => props.account,
  (account) => {
    if (account) {
      localDailyLimit.value = account.dailyLimit || "";
      localAbsoluteLimit.value = account.absoluteLimit || "";
      localWithdrawLimit.value = account.withdrawLimit || "";
    }
  },
  { immediate: true }
);

function submit() {
  emit("submit", {
    iban: props.account.iban,
    dailyLimit: parseFloat(localDailyLimit.value),
    absoluteLimit: parseFloat(localAbsoluteLimit.value),
    withdrawLimit: parseFloat(localWithdrawLimit.value),
  });
}
</script>
