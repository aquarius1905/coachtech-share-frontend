<template>
  <div class="side">
    <div class="side_wrapper">
      <img src="~/assets/image/logo.png" width="200px" height="auto" />
      <nav>
        <ul class="nav_wrapper">
          <li class="nav_item">
            <NuxtLink to="/">
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
    <validation-observer ref="obs" tag="div">
      <validation-provider rules="required|max:120" v-slot="{ errors }" >
        <label for="post_textarea">シェア</label>
        <br />
        <textarea
          v-model="post_textarea"
          class="post_textarea"
          name="シェア"
        ></textarea>
        <div class="error">{{ errors[0] }}</div>
        <button
          class="post_btn"
          @click="addPost"
        >
          シェアする
        </button>
      </validation-provider>
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
          alert("ログアウトが完了しました。");
          this.$router.replace("/login")
        });
    },
    async addPost() {//投稿する
      const isValid = await this.$refs.obs.validate();
      if (!isValid) return;
      
      const currentUserId = await common.getCurrentUserId();
      const sendData = {
        user_id: currentUserId,
        post: this.post_textarea,
      };

      console.log('addPost');
      const { data } = await this.$axios.post("/api/posts", sendData);
      const postItem = {
        post_id: data.data.id, 
        user_id: currentUserId, 
        post: this.post_textarea, 
        user_name: data.data.user_name,
        like_count: 0
      };

      this.$emit('addPostItem', postItem);
      this.post_textarea = null;
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