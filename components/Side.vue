<template>
  <div class="side">
    <div class="side_wrapper">
      <img src="~/assets/image/logo.png" width="200px" height="auto" />
      <nav>
        <ul class="nav_wrapper">
          <li class="nav_item">
            <NuxtLink to="/post">
              <img
                src="~/assets/image/home.png"
                class="home_img"
              />
              ホーム
            </NuxtLink>
          </li>
          <li class="nav_item logout_item">
            <button @click="logout" class="logout_btn">
              <img
              src="~/assets/image/logout.png"
              class="logout_img"
              />
              ログアウト
            </button>
          </li>
        </ul>
      </nav>
    </div>
    <validation-observer ref="obs" v-slot="ObserverProps">
      <validation-provider v-slot="{ errors }" rules="required|max:120">
        <label for="post_textarea">シェア</label>
        <br />
        <textarea
          v-model="post_textarea"
          class="post_textarea"
          name="シェア"
        ></textarea>
        <div class="error">{{ errors[0] }}</div>
      </validation-provider>
      <button
        type="button"
        :disabled="ObserverProps.invalid || !ObserverProps.validated"
        class="post_btn"
        @click="addPost"
      >
        シェアする
      </button>
    </validation-observer>
  </div>
</template>

<script>
import firebase from "~/plugins/firebase";
import common from '~/plugins/common'
export default {
  data() {
    return {
      post_textarea: null,
      post_items: [],
    };
  },
  methods: {
    logout() {//ログアウトする
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("/login").then(() => {
            alert("ログアウトが完了しました。");
          })
        });
    },
    async addPost() {//投稿する
      const currentUserId = await common.getCurrentUserId();
      const sendData = {
        user_id: currentUserId,
        post: this.post_textarea,
      };
      //投稿をpostテーブルに追加
      const response = await this.$axios.post("http://127.0.0.1:8000/api/posts", sendData);
      const {data} = {data: response.data};
      const currentUserName = await common.getUserNameById(currentUserId);
      const postItem = {
        post_id: data.data.id, 
        user_id: currentUserId, 
        post: this.post_textarea, 
        user: currentUserName,
        likes: 0
      };
      this.$emit('addPostItem', postItem);
    }
  }
}
</script>

<style scoped>
.side {
  width: 15%;
  min-height: 100vh;
  background-color: #1d50a2;
  color: #eee;
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
.post_textarea {
  width: 100%;
  height: 200px;
  margin-top: 20px;
  resize: none;
  background-color: #eee;
  font-size: 16px;
}
.logout_btn {
  border: 1px solid #1d50a2;
  background-color: #1d50a2;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  text-align: left;
  padding: 0;
}
</style>