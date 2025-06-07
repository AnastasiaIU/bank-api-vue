<script setup>
const props = defineProps({
    fromAccount: String,
    toAccount: String,
    initiatedBy: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    }
})
</script>

<template>
    <section class="card p-4 w-100">
        <div class="card-body d-flex flex-row gap-5 align-items-center">
            <div class="d-flex flex-column flex-grow-1">
                <div v-if="fromAccount != null" class="d-flex">
                    <strong class="me-2 iban-origin">From:</strong>
                    <span>{{ props.fromAccount }}</span>
                </div>
                <div v-if="toAccount != null" class="d-flex">
                    <strong class="me-2 iban-origin">To:</strong>
                    <span>{{ props.toAccount }}</span>
                </div>
            </div>
            <div class="d-flex flex-column">
                <div><strong>Initiated By:</strong> {{ props.initiatedBy }}</div>
                <div>
                    {{
                        new Date(props.timestamp)
                            .toLocaleDateString('en-GB')
                            .replaceAll('/', '-') +
                        ' ' +
                        new Date(props.timestamp)
                            .toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    }}
                </div>
            </div>
            <div class="d-flex">
                <strong class="amount-text">Amount:</strong>
                <span class="amount">€{{ props.amount.toFixed(2) }}</span>
            </div>
        </div>
    </section>
</template>

<style scoped>
.card {
    border-radius: 0px;
    border-top: 0;
}

.iban-origin {
    min-width: 70px;
}

.amount-text {
    min-width: 70px;
}

.amount {
    min-width: 100px;
}
</style>