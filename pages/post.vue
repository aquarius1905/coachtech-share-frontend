<template>
  <div class="post">
    <div class="side">
      <div class="side_wrapper">
        <img src="../assets/image/logo.png" width="40%" height="auto" />
        <nav class="nav">
          <ul class="nav_wrapper">
            <li class="nav_item">
              <NuxtLink to="/post">
                <img
                  src="../assets/image/home.png"
                  width="10%"
                  height="auto"
                />
                ホーム
              </NuxtLink>
            </li>
            <li class="nav_item logout_item">
              <button @click="logout" class="logout_btn">
                <img
                src="../assets/image/logout.png"
                width="10%"
                height="auto"
                />
                ログアウト
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <validation-observer ref="obs" v-slot="ObserverProps">
        <validation-provider v-slot="{ errors }" rules="required|max:120">
          <label for="post_content">シェア</label>
          <br />
          <textarea
            v-model="post_content"
            id="post_content"
            name="シェア"
            width=""
            rows="8"
          ></textarea>
          <div class="error">{{ errors[0] }}</div>
        </validation-provider>
        <button
          type="button"
          :disabled="ObserverProps.invalid || !ObserverProps.validated"
          class="post_btn"
          @click="post"
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
        <div v-for="(item, index) in post_items" :key="index" class="post_item">
          <div class="post_header">
            <h2 class="user_name">{{ item.user }}</h2>
            <img
              src="../assets/image/heart.png"
              width="30px"
              height="30px"
              class="post_header_img"
            />
            <p class="likes_num">{{ likes }}</p>
            <button class="post_delete_btn" @click="deletePost(item.id)">
              <img
                src="../assets/image/cross.png"
                width="30px"
                height="30px"
              />
            </button>
            <img
              src="../assets/image/detail.png"
              width="30px"
              height="30px"
              class="post_header_img"
            />
          </div>
          <p class="content">{{ item.post }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 1.taroでログイン
// 2.taroも含め全員分の投稿が表示される
// 3.taroが投稿
// 4.シェアボタン押下
// 5.postメソッドで現在のuser(taro)を取得し、currentUserに格納
import firebase from "~/plugins/firebase";
export default {
  data() {
    return {
      current_user_email: '',
      current_user: null,
      post_content: null,
      post_items: [],
      likes: 0
    };
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          alert("ログアウトが完了しました。");
          this.$router.replace("/login");
        });
    },
    async getCurrentUser() {
      const user = await firebase.auth().currentUser;
      this.current_user_email = user.email;
    },
    async post() {
      //usersテーブルからemailで検索してidとnameを取得
      await this.getCurrentUserData();
      //投稿をpostテーブルに追加
      await this.insertPost();
    },
    async getCurrentUserData() {//usersテーブルからemailで検索してidとnameを取得
      const params = {
        email: this.current_user_email,
      };
      const currentUserData = await this.$axios.get( "http://127.0.0.1:8000/api/user/",{params});
      this.current_user = currentUserData.data.data[0];
    },
    async getPosts() {//全ての投稿を取得
      this.post_items.splice(0);
      const posts = await this.$axios.get("http://127.0.0.1:8000/api/posts");
      const postsData = posts.data.data;
      for(const element of postsData) {
        const userName = await this.getUserByID(element.user_id);
        const postData = { id: element.id, user: userName, post: element.post };
        this.post_items.unshift(postData);
      }
    },
    async getUserByID(userId) { //ユーザーidからユーザー名を取得
      const params = {
        id: userId
      };
      const targetUser = await this.$axios.get("http://127.0.0.1:8000/api/user/", {params});
      return targetUser.data.data[0].name;
    },  
    async insertPost() {
      const sendData = {
        user_id: this.current_user.id,
        post: this.post_content,
      };
      //投稿をpostテーブルに追加
      await this.$axios.post("http://127.0.0.1:8000/api/posts", sendData);
      const userName = await this.getUserByID(this.current_user.id);
      const postData = { user: userName, post: this.post_content };
      this.post_items.unshift(postData);
    },
    async deletePost(postId) {//投稿の削除
      await this.$axios.delete("http://127.0.0.1:8000/api/posts/" + postId);
      this.getPosts();
    }
  },
  created() {
    //全ての投稿を取得
    this.getPosts();
    //現在ログインしているユーザーを取得
    this.getCurrentUser();
  },
};
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
#post_content {
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
  font-weight: bold;
}
.post_item {
  border: 1px solid #f6f7f9;
  background-color: #1d50a2;
  color: #f6f7f9;
  padding: 20px;
}
.post_header {
  align-items: center;
  vertical-align: center;
  display: flex;
  margin-bottom: 20px;
}
.post_delete_btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-right: 40px;
}
</style>
