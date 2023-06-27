<template>
    <tr>
        <td class="py-2 px-4 border-b">{{ transaction.accountFrom.iban }}</td>
        <td class="py-2 px-4 border-b">{{ transaction.accountTo.iban }}</td>
        <td class="py-2 px-4 border-b">€ {{ transaction.amount }}</td>
        <td class="py-2 px-4 border-b">{{ formatDate(transaction.timeStamp) }}</td>
    </tr>
</template>

<script>
import axios from '../../axios-auth.js';

export default {
    name: "TransactionListItem",
    data() {
        return 
    },
    props: {
        transaction: Object,
    },
    methods: {
        formatDate(timeStamp) {
            const year = timeStamp[0];
            const month = timeStamp[1];
            const day = timeStamp[2];
            const formattedDate = `${year}/${month}/${day}`;
            return formattedDate;
        },
    }
}
</script>

<style>

</style>