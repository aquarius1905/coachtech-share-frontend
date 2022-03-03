<template>
<div class="post">
  <div class="side">
    <div class="side_wrapper">
      <img src="../assets/image/logo.png" width="40%" height="40%">
      <nav class="nav">
        <ul class="nav_wrapper">
          <li class="nav_item">
            <NuxtLink to="/">
              <img src="../assets/image/home.png" width="10%" height="auto" class="img" >
              ホーム
            </NuxtLink>
          </li>
          <li class="nav_item logout_item">
            <img src="../assets/image/logout.png" width="10%" height="auto" class="img">
            <button @click="logout" class="btn">ログアウト</button>
          </li>
        </ul>
      </nav>
    </div>
    <validation-observer ref="obs" v-slot="ObserverProps">
      <validation-provider v-slot="{ errors }" rules="required|max:120">
        <label for="post_content">シェア</label>
        <textarea v-model="post_content" id="post_content" name="シェア" rows="8" ></textarea>
        <div class="error">{{ errors[0] }}</div>
      </validation-provider>
      <button 
        type="button"
        :disabled="ObserverProps.invalid || !ObserverProps.validated"
        class="post_btn" @click="post"
      >
      シェアする
      </button>
    </validation-observer>
  </div>
  <div class="post_wrapper">
    <div class="title_wrapper">
      <h1 class="post_title">ホーム</h1>
    </div>
    <div class="post_list">
      <div v-for="(item, index) in post_items" :key="index">
        <p>{{item}}</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import firebase from '~/plugins/firebase'
export default {
  data() {
    return {
      currentUser: [],
      post_content: null,
      post_items: []
    }
  },
  methods: {
    logout() {
      firebase
      .auth()
      .signOut()
      .then(() => {
        alert('ログアウトが完了しました。')
        this.$router.replace('/login')
      })
    },
    post() {
      const user = firebase.auth().currentUser;
      //usersテーブルからemailで検索してidとnameを取得
      this.getUserData(user.email);
      //投稿をpostテーブルに追加
      this.post_items.push(this.post_content);
      
    },
    async getUserData(userMail) {
       const params = {
         email: userMail
       };
      //usersテーブルからemailで検索してidとnameを取得
      this.currentUser = await this.$axios.get("http://127.0.0.1:8000/api/users/", params);
    }
  }
}
</script>

<style scoped>
.post {
  display: flex;
}
.post_wrapper {
  width: 100vw;
}
.title_wrapper {
  background-color: #f3f6f9;
  color: #1d50a2;
  font-size: 24px;
  padding: 20px;
}
.post_main {
  width: 85%;
}
.side {
  width: 15%;
  height: 100vh;
  background-color: #1d50a2;
  color: #f6f7f9;
  padding: 20px;
}
.side_wrapper {
  margin-bottom: 40px;
}
.nav_item {
  list-style: none;
  margin-top: 15px;
}
.logout_item {
  display: flex;
  align-items: center;
}
#share {
  width: 98%;
  margin-top: 20px;
  resize: none;
  background-color: #f6f7f9;
}
.post_btn {
  display: block;
  border: 1px solid #f6f7f9;
  border-radius: 10px;
  background-color: #f6f7f9;
  padding: 10px;
  color: #1d50a2;
  width: 110px;
  font-size: 16px;
  margin: 20px 0 0 auto;
  cursor: pointer;
  }
.share_btn:hover {
  background-color: #f0f0f0;
  border: 1px solid #f0f0f0;
  transition: .5s;
  }
</style>