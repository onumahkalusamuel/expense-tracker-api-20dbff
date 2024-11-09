<template>
  <div style="display: flex; justify-content: space-between; align-items: center">
    <h2>User: {{ authStore.name }}</h2>
    <div>
      <button @click="logout">
        <power-icon/>
      </button>
    </div>
  </div>
  <router-view/>
</template>

<script setup lang="ts">
import {onBeforeMount} from "vue";
import {useAuthStore} from "../stores/auth.store";
import {useRouter} from "vue-router";
import PowerIcon from "../components/icons/PowerIcon.vue";

const authStore = useAuthStore();
const router = useRouter();

onBeforeMount(() => {
  authStore.updateToken(useAuthStore().token);
});

const logout = async () => {
  if (!confirm('Are you sure you want to logout?')) return;
  authStore.name = '';
  authStore.token = '';
  await router.push({name: 'login'})
}
</script>
