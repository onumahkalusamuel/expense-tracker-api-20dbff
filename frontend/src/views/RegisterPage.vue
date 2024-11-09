<script setup lang="ts">
import {ref} from "vue";
import {apiSignup} from "../services/auth.service.ts";
import {useNotification} from "@kyvg/vue3-notification";
import {useRouter} from "vue-router";

const {notify} = useNotification();
const router = useRouter();

const registerForm = ref({
  email: '',
  password: '',
  name: '',
});
const register = async () => {
  if (!registerForm.value.email || !registerForm.value.password) return alert('Please provide form details');

  const signup = await apiSignup(registerForm.value);
  if (signup) {
    notify({text: signup.message, type: 'success'});
    await router.push({name: 'login'});
  }
}

</script>

<template>
  <div style="max-width: 500px; margin: auto">
    <div>
      <h2>Register</h2>
    </div>
    <hr/>
    <form @submit.prevent="register">
      <table border="1" width="100%" cellpadding="10" cellspacing="1">
        <tbody>
        <tr>
          <th>Name</th>
          <td>
            <input v-model="registerForm.name" style="width: 90%; height: 25px" required/>
          </td>
        </tr>
        <tr>
          <th>Email</th>
          <td>
            <input v-model="registerForm.email" type="email" style="width: 90%; height: 25px" required/>
          </td>
        </tr>
        <tr>
          <th>Password</th>
          <td>
            <input v-model="registerForm.password" type="password" style="width: 90%; height: 25px" required/>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            Already have an account?
            <router-link :to="{name: 'login'}">Log in here.</router-link>
          </td>
        </tr>
        </tbody>
      </table>
      <div style="display: flex; width: 100%; margin: 10px 0">
        <button>register</button>
      </div>
    </form>
  </div>
</template>
