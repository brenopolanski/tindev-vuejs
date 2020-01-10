<template>
  <div class="login-container">
    <form @submit.prevent="handleSubmit" v-show="!loading">
      <img src="../assets/logo.svg" alt="Tindev" />
      <input v-model="username" placeholder="Digite seu usuário do GitHub" />
      <button type="submit">Enviar</button>
    </form>
    <DotLoader :loading="loading" color="#df4723" />
  </div>
</template>

<script>
import { DotLoader } from '@saeris/vue-spinners';
import api from '../services/api';
import store from '../services/store';

export default {
  name: 'Login',
  components: {
    DotLoader
  },
  data() {
    return {
      username: '',
      loading: false
    };
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true;

        const response = await api.post('/devs', {
          username: this.username
        });

        const { _id, avatar, name } = response.data;

        store.user = { _id, avatar, name };

        this.$router.push({ path: `/dev/${_id}` });
      } catch (error) {
        this.$notify({
          title: 'Erro',
          text: 'Usuário não encontrado',
          type: 'error'
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style>
.login-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container form {
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
}

.login-container form input {
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  height: 48px;
  padding: 0 20px;
  font-size: 16px;
  color: #666;
}

.login-container form input::placeholder {
  color: #999;
}

.login-container form button {
  margin-top: 10px;
  border: 0;
  border-radius: 4px;
  height: 48px;
  font-size: 16px;
  background: #df4723;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
}
</style>
