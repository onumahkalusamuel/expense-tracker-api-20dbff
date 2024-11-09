<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import TrashIcon from "../../components/icons/TrashIcon.vue";
import {apiDeleteExpense, apiGetExpenses} from "../../services/expense.service.ts";
import {FilterType, IExpenseFilter, IExpensesResponse} from "../../interfaces";
import {useRouter} from "vue-router";
import {useNotification} from "@kyvg/vue3-notification";

const {notify} = useNotification();
const router = useRouter();
const expenses = ref({} as IExpensesResponse);

const filters = ref({
  filter: 'PAST_WEEK',
  fromDate: '',
  toDate: '',
} as IExpenseFilter);

const current = async (type: FilterType) => {
  filters.value.filter = type;
}

const deleteRecord = async (id: number) => {
  if (!confirm('This expense will be deleted permanently. Continue?')) return;
  await apiDeleteExpense(id);
  const index = expenses.value.data.findIndex(a => a.id === id);
  expenses.value.data.splice(index, 1);
}

const fetchExpenses = async (filters?: IExpenseFilter) => {
  // expenses.value = {} as unknown as IExpensesResponse;
  if (filters?.filter === 'CUSTOM' && (!filters.toDate || !filters.fromDate)) {
    return notify({text: 'Please select date range', type: 'error'});
  }
  expenses.value = await apiGetExpenses(filters)
}

onMounted(() => {
  fetchExpenses(filters.value)
})

watch(() => filters.value.filter, async (value) => {
  if (value === 'CUSTOM') return;
  await fetchExpenses(filters.value);
})
</script>
<style scoped>
.active {
  background-color: #535bf2;
  color: white;
}
</style>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center">
      <h2>Expense Tracker</h2>
      <div>
        <button @click="router.push({name: 'add-expense'})">Add expense</button>
      </div>
    </div>
    <hr/>

    <div style="display: flex; gap: 20px; justify-content: space-between">
      <div style="margin: 10px 0; display: flex; align-items: center; flex-wrap: wrap; gap:5px;">
        <strong>Filters:&nbsp;&nbsp;</strong>
        <button @click="current('PAST_WEEK')" :class="filters.filter === 'PAST_WEEK' ? 'active': ''">Past week</button>
        <button @click="current('PAST_MONTH')" :class="filters.filter === 'PAST_MONTH' ? 'active': ''">Past month
        </button>
        <button @click="current('PAST_3_MONTHS')" :class="filters.filter === 'PAST_3_MONTHS' ? 'active': ''">Past 3
          months
        </button>
        <button @click="current('CUSTOM')" :class="filters.filter === 'CUSTOM' ? 'active': ''">Custom</button>
      </div>
      <div style="margin: 10px 0; display: flex; align-items: center; gap: 5px; flex-wrap: wrap;"
           v-if="filters.filter === 'CUSTOM'">
        <div>
          <strong>From:&nbsp;&nbsp;</strong>
          <input type="date" v-model="filters.fromDate" style="height: 30px; width: 150px;"/>
        </div>

        <div>
          <strong>To:&nbsp;&nbsp;</strong>
          <input type="date" v-model="filters.toDate" style="height: 30px; width: 150px;"/>
        </div>

        <button @click="() => fetchExpenses(filters)">filter</button>
      </div>
    </div>


    <table border="1" width="100%" cellpadding="10" cellspacing="1" v-if="expenses.fromDate || expenses.toDate">
      <tbody>
      <tr>
        <td><strong>From:</strong> {{ expenses.fromDate }}</td>
        <td><strong>To:</strong> {{ expenses.toDate }}</td>
      </tr>
      </tbody>
    </table>
    <br/>
    <table border="1" width="100%" cellpadding="10" cellspacing="1">
      <thead>
      <tr>
        <th>SN</th>
        <th>Date</th>
        <th style="width:50%">Title (Category)</th>
        <th>Amount</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(expense, i) in expenses.data" :key="expense.id">
        <td>{{ i + 1 }}</td>
        <td>{{ (expense.createdAt as string).split('T')[0] }}</td>
        <td>
          <router-link :to="{name: 'view-expense', params: {id: expense.id}}">
            <span>{{ expense.title }} ({{ expense.category }})</span>
          </router-link>
        </td>
        <td>{{ expense.amount }}</td>
        <td>
          <button @click="deleteRecord(expense.id)" class="delete-button">
            <trash-icon/>
          </button>
        </td>
      </tr>
      <tr v-if="!expenses.data?.length">
        <td colspan="5">
          <div style="padding: 5px">No records found.</div>
        </td>
      </tr>
      </tbody>
      <tfoot v-if="expenses.data?.length">
      <tr>
        <td colspan="3"><strong>Total</strong></td>
        <td>{{ expenses.data.reduce((a, b) => a + b.amount, 0) }}</td>
        <td></td>
      </tr>
      </tfoot>
    </table>
  </div>
</template>
