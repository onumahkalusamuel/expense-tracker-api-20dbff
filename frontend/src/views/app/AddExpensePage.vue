<template>
  <div style="display: flex; justify-content: space-between; align-items: center">
    <h2>Add Expense</h2>
    <div>
      <button @click="router.push({name: 'dashboard'})">&leftarrow; Expenses</button>
    </div>
  </div>
  <hr/>
  <form @submit.prevent="createExpense">
    <table width="100%" border="1" cellpadding="10px">
      <tbody>
      <tr>
        <th>Category</th>
        <td>
          <select v-model="expense.category" style="width: 90%; height: 25px" required>
            <option v-for="ec in expenseCategories" :key="ec">{{ ec }}</option>
          </select>
        </td>
      </tr>
      <tr>
        <th>Title</th>
        <td>
          <input v-model="expense.title" style="width: 90%; height: 25px" required/>
        </td>
      </tr>
      <tr>
        <th>Amount</th>
        <td>
          <input v-model.number="expense.amount" type="number" style="width: 90%;" required/>
        </td>
      </tr>
      </tbody>
    </table>
    <div style="display: flex; width: 100%; margin: 10px 0">
      <button>submit</button>
    </div>
  </form>

</template>
<script setup lang="ts">
import {useRouter} from "vue-router";
import {ref} from "vue";
import {IExpense} from "../../interfaces";
import {expenseCategories} from "../../constants/expense-categories.constant.ts";
import {apiCreateExpense} from "../../services/expense.service.ts";
import {useNotification} from "@kyvg/vue3-notification";

const {notify} = useNotification();
const router = useRouter();

const expense = ref({
  title: '',
  category: expenseCategories[0],
  amount: 0,
} as IExpense);

const createExpense = async () => {
  if (!expense.value.title || !expense.value.category) return alert('Please fill in required fields.');
  const create = await apiCreateExpense(expense.value);
  if (create.id) {
    notify({text: 'Expense recorded successfully', type: 'success'});
    await router.push({name: 'view-expense', params: {id: create.id}});
  }
}
</script>
