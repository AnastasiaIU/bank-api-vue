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
        <form @submit.prevent="onSubmit">
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
        </div>
         </form>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { watch } from "vue";
import BaseInput from "@/components/shared/forms/BaseInput.vue";
import updateLimitsSchema from "@/schemas/updateLimitsSchema";
import { useForm } from "vee-validate";

const props = defineProps({
  account: Object,
});

const formContext = useForm({
    validationSchema: updateLimitsSchema
})

const { handleSubmit, meta, resetForm } = formContext

const emit = defineEmits(["close", "submit"]);

// Reset form when account changes (to update initial values)
watch(
  () => props.account,
   (account) => {
    if (account) {
      resetForm({
        values: {
          dailyLimit: account.dailyLimit || "",
          absoluteLimit: account.absoluteLimit || "",
          withdrawLimit: account.withdrawLimit || "",
        },
      });
    }
  },
  { immediate: true }
);

const onSubmit = handleSubmit(async (values) => {
  emit("submit", {
    iban: props.account.iban,
    dailyLimit: parseFloat(values.dailyLimit),
    absoluteLimit: parseFloat(values.absoluteLimit),
    withdrawLimit: parseFloat(values.withdrawLimit),
  });
});

defineExpose({ onSubmit });

</script>
