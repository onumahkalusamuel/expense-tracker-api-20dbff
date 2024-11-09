<template>
  <div style="display: flex; justify-content: space-between; align-items: center">
    <h2>Update Expense</h2>
    <div>
      <button @click="router.push({name: 'dashboard'})">&leftarrow; Expenses</button>
    </div>
  </div>
  <hr/>
  <form @submit.prevent="updateExpense">
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
          <input v-model="expense.amount" type="number" style="width: 90%;" required/>
        </td>
      </tr>

      </tbody>
    </table>
    <div style="display: flex; width: 100%; margin: 10px 0">
      <button>update</button>
    </div>
  </form>

</template>
<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {IExpense} from "../../interfaces";
import {expenseCategories} from "../../constants/expense-categories.constant.ts";
import {apiGetExpense, apiUpdateExpense} from "../../services/expense.service.ts";
import {notify} from "@kyvg/vue3-notification";

const router = useRouter();
const {id} = useRoute().params;

const expense = ref({title: '', amount: 0, category: 'Others'} as IExpense);

const updateExpense = async () => {
  if (!expense.value.title || !expense.value.category) return notify({
    text: 'Please fill in required fields.',
    type: 'error'
  });
  const update = await apiUpdateExpense(id as unknown as number, expense.value);
  if (update.id) {
    notify({text: 'Expense updated successfully.', type: 'success'})
  }
}

onMounted(async () => {
  expense.value = await apiGetExpense(id as unknown as number);
})
</script>
