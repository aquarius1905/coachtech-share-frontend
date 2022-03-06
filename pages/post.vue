<template>
  <div class="post">
    <div class="side">
      <div class="side_wrapper">
        <img src="../assets/image/logo.png" width="200px" height="auto" />
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
          @click="insertPost"
        >
          シェアする
        </button>
      </validation-observer>
    </div>
    <div class="post_wrapper">
      <div class="title_wrapper">
        <h1>ホーム</h1>
      </div>
      <div class="post_list">
        <div v-for="(item, index) in post_items" :key="index" class="post_item">
          <div class="post_header">
            <h2 class="user_name">{{ item.user }}</h2>
            <button class="likes_btn" @click="toggleLikesNum(item.user_id, item.post_id)">
              <img
                src="../assets/image/heart.png"
                width="30px"
                height="auto"
                class="post_header_img"
              />
            </button>
            <p class="likes_num">{{ item.likes }}</p>
            <button class="post_delete_btn" @click="deletePost(item)">
              <img
                src="../assets/image/cross.png"
                width="30px"
                height="auto"
              />
            </button>
            <NuxtLink 
              :to="`/comments/posts/${item.post_id}`"
              tag="img"
              :src="require('~/assets/image/detail.png')"
              class="to_comment"
              width="40px"
              height="auto"
              >
            </NuxtLink>
          </div>
          <p class="content">{{ item.post }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "~/plugins/firebase";
export default {
  data() {
    return {
      current_user: null,
      post_content: null,
      post_items: [],
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
    async getCurrentUser() {//usersテーブルからemailで検索してuser情報を取得
      const user = await firebase.auth().currentUser;
      const params = {
        email: user.email,
      };
      const currentUserDatas = await this.$axios.get( "http://127.0.0.1:8000/api/user/",{params});
      const {currentUserData} = {currentUserData:  currentUserDatas.data}
      this.current_user = currentUserData.data[0];
    },
    async getPosts() {//全ての投稿を取得
      this.post_items.splice(0);
      const posts = await this.$axios.get("http://127.0.0.1:8000/api/posts");
      const {postsData} = {postsData: posts.data};
      const postDatas = postsData.data;
      for(const element of postDatas) {
        const userName = await this.getUserByID(element.user_id);
        const likesCount = await this.getLikesCount(element.id);
        const postData = { 
          post_id: element.id, 
          user_id: element.user_id, 
          post: element.post, 
          user: userName,
          likes: likesCount
        };
        this.post_items.unshift(postData);
      }
    },
    async getUserByID(userId) { //ユーザーidからユーザー名を取得
      const params = {
        id: userId
      };
      const targetUser = await this.$axios.get("http://127.0.0.1:8000/api/user/", {params});
      const {targetUserData} = {targetUserData: targetUser.data};
      return targetUserData.data[0].name;
    },  
    async getLikesCount(postId) {//良いね数取得
      const params = {
        post_id: postId
      };
      const response = await this.$axios.get("http://127.0.0.1:8000/api/likes/posts/" + params.post_id);
      const {data} = {data: response.data};
      return data.data ? data.data : 0;
    },
    async insertPost() {//投稿をpostテーブルに追加
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
    async deletePost(targetPost) {//投稿の削除
      console.log(targetPost.user_id);
      console.log(this.current_user.id);
      if(targetPost.user_id === this.current_user.id)
      {//自身の投稿なら削除する
        await this.$axios.delete("http://127.0.0.1:8000/api/posts/" + targetPost.post_id);
        this.getPosts();
      }
      else {//他の人の投稿なら削除しない
        alert("他の人の投稿は削除できません。");
      }
    },
    async toggleLikesNum(postUserId, postId) {//自分以外の投稿に良いねをする
      if(postUserId === this.current_user.id) {
        alert("自分の投稿には「良いね」できません。")
        return
      }
      const params = {
        user_id: this.current_user.id,
        post_id: postId
      };
      const response = await this.$axios.get("http://127.0.0.1:8000/api/likes/", {params});
      const {data} = {data: response.data.data};
      if (data.length === 0) {//自分の良いね数が存在しない場合、良いねを登録
        const sendData = {
          user_id: this.current_user.id,
          post_id: postId,
        };
        await this.$axios.post( "http://127.0.0.1:8000/api/posts/likes", sendData);
      } else {//自分の「良いね」が存在する場合、削除
        await this.$axios.delete(`http://127.0.0.1:8000/api/likes/users/${this.current_user.id}/posts/`+ postId);
      }
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

<style>
.post {
  display: flex;
}
.post_wrapper {
  width: 100vw;
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
.to_comment {
  cursor: pointer;
}
</style>
