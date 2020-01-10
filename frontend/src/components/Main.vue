<template>
  <div class="main-container">
    <img class="avatar" :src="store.user.avatar" :alt="store.user.name" />
    <br />
    <router-link to="/">
      <img src="../assets/logo.svg" alt="Tindev" />
    </router-link>

    <DotLoader class="loader" :loading="loading" color="#df4723" />

    <ul v-if="users.length > 0 && !loading">
      <li v-for="user of users" :key="user._id">
        <img :src="user.avatar" :alt="user.name" />
        <footer>
          <strong>{{user.name}}</strong>
          <p>{{user.bio}}</p>
        </footer>
        <div class="buttons">
          <button type="button" @click="handleDislike($event, user._id)">
            <img src="../assets/dislike.svg" alt="Dislike" />
          </button>
          <button type="button" @click="handleLike($event, user._id)">
            <img src="../assets/like.svg" alt="Like" />
          </button>
        </div>
      </li>
    </ul>

    <div v-if="users.length === 0 && !loading" class="empty">Acabou :(</div>

    <div v-if="itsamatch" class="match-container">
      <img src="../assets/itsamatch.png" alt="It's a match" />
      <img class="avatar" :src="matchDev.avatar" :alt="matchDev.name" />
      <strong>{{matchDev.name}}</strong>
      <p>{{matchDev.bio}}</p>
      <button type="button" @click="onCloseMatchDev">FECHAR</button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import { DotLoader } from '@saeris/vue-spinners';
import api from '../services/api';
import store from '../services/store';

export default {
  name: 'Main',
  components: {
    DotLoader
  },
  data() {
    return {
      users: [],
      matchDev: null,
      loading: false,
      store
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    itsamatch() {
      return this.matchDev !== null;
    }
  },
  mounted() {
    try {
      this.loading = true;

      const socket = io('http://localhost:3333', {
        query: { user: this.id }
      });

      socket.on('match', dev => {
        this.matchDev = dev;
      });

      this.loadUsers();
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: this.id
        }
      });

      this.users = response.data;
    },
    async handleLike(event, id) {
      event.target.className = 'loading';

      await api.post(`/devs/${id}/likes`, null, {
        headers: { user: this.id }
      });

      this.users = this.users.filter(user => user._id !== id);
    },
    async handleDislike(event, id) {
      event.target.className = 'loading';

      await api.post(`/devs/${id}/dislikes`, null, {
        headers: { user: this.id }
      });

      this.users = this.users.filter(user => user._id !== id);
    },
    onCloseMatchDev() {
      this.matchDev = null;
    }
  }
};
</script>

<style>
.main-container {
  max-width: 980px;
  margin: 0 auto;
  padding: 50px 0;
  text-align: center;
}

.main-container .avatar {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  border: 2px solid #aaa;
}

.main-container ul {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 30px;
  margin-top: 50px;
}

.main-container ul li {
  display: flex;
  flex-direction: column;
}

.main-container ul li img {
  max-width: 100%;
  border-radius: 5px 5px 0 0;
}

.main-container ul li footer {
  flex: 1;
  background: #fff;
  border: 1px solid #eee;
  padding: 15px 20px;
  text-align: left;
  border-radius: 0 0 5px 5px;
}

.main-container ul li footer strong {
  font-size: 16px;
  color: #333;
}

.main-container ul li footer p {
  font-size: 14px;
  line-height: 20px;
  color: #999;
  margin-top: 5px;
}

.main-container ul li .buttons {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
}

.main-container ul li .buttons button {
  height: 50px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.05);
  border: 0;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.main-container ul li .buttons button:hover img {
  transform: translateY(-5px);
  transition: all 0.2s;
}

.main-container .empty {
  font-size: 32px;
  color: #999;
  font-weight: bold;
  margin-top: 300px;
}

.match-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
}

.match-container .avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 5px solid #fff;
  margin: 30px 0;
}

.match-container strong {
  font-size: 32px;
  color: #fff;
}

.match-container p {
  margin-top: 10px;
  font-size: 20px;
  line-height: 30px;
  max-width: 400px;
  color: rgba(255, 255, 255, 0.8);
}

.match-container button {
  border: 0;
  background: none;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  margin-top: 30px;
  cursor: pointer;
}

.loading img {
  opacity: 0;
  animation: fadein 2s;
  -moz-animation: fadein 2s;
  -webkit-animation: fadein 2s;
  -o-animation: fadein 2s;
}
</style>
