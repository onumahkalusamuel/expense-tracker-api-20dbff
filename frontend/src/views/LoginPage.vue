<script setup lang="ts">
import {useRouter} from "vue-router";
import {ref} from "vue";
import {apiLogin} from "../services/auth.service.ts";
import {useAuthStore} from "../stores/auth.store.ts";
import {useNotification} from "@kyvg/vue3-notification";

const {notify} = useNotification();

const router = useRouter();
const authStore = useAuthStore();
const loginForm = ref({email: '', password: ''});
const login = async () => {
  if (!loginForm.value.email || !loginForm.value.password) return alert('Please provide login details');

  const loginRequest = await apiLogin(loginForm.value);

  if (loginRequest.token) {
    notify({text: 'Login successful', type: 'success'});
    authStore.token = loginRequest.token;
    authStore.name = loginRequest.name;
    await router.push({name: 'dashboard'})
  } else {
    alert(loginRequest.message);
  }
}

</script>

<template>
  <div style="max-width: 500px; margin: auto">
    <div>
      <h2>Login</h2>
    </div>
    <hr/>
    <form @submit.prevent="login">
      <table border="1" width="100%" cellpadding="10" cellspacing="1">
        <tbody>
        <tr>
          <th>Email</th>
          <td>
            <input v-model="loginForm.email" type="email" style="width: 90%; height: 25px" required/>
          </td>
        </tr>
        <tr>
          <th>Password</th>
          <td>
            <input v-model="loginForm.password" type="password" style="width: 90%; height: 25px" required/>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            No account?
            <router-link :to="{name: 'register'}">Register here.</router-link>
          </td>
        </tr>
        </tbody>
      </table>
      <div style="display: flex; width: 100%; margin: 10px 0">
        <button>login</button>
      </div>
    </form>
  </div>
</template>
