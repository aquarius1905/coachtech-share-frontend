<template>
  <div class="post flex">
    <div class="side">
      <div class="side_wrapper">
        <img src="~/assets/image/logo.png" width="200px" height="auto" />
        <nav>
          <ul class="nav_wrapper">
            <li class="nav_item">
              <NuxtLink to="/post">
                <img
                  src="~/assets/image/home.png"
                  width="10%"
                  height="auto"
                />
                ホーム
              </NuxtLink>
            </li>
            <li class="nav_item logout_item">
              <button @click="logout" class="logout_btn">
                <img
                src="~/assets/image/logout.png"
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
                src="~/assets/image/heart.png"
                width="30px"
                height="auto"
                class="post_header_img"
              />
            </button>
            <p class="likes_num">{{ item.likes }}</p>
            <button class="post_delete_btn" @click="deletePost(item)">
              <img
                src="~/assets/image/cross.png"
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
import vuex from "~/src/store/index";
import common from '@/plugins/common'
export default {
  data() {
    return {
      post_textarea: null,
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
      this.setCurrentUser(currentUserData.data[0]);
    },
    async getPosts() {//全ての投稿を取得
      this.post_items.splice(0);
      const posts = await this.$axios.get("http://127.0.0.1:8000/api/posts");
      const {postsData} = {postsData: posts.data};
      const postDatas = postsData.data;
      for(const element of postDatas) {
        const userName = await common.getUserNameById(element.user_id);
        const likesCount = await this.getLikesCount(element.id);
        const post_item = { 
          post_id: element.id, 
          user_id: element.user_id, 
          post: element.post, 
          user: userName,
          likes: likesCount
        };
        this.post_items.unshift(post_item);
      }
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
      const currentUserId = vuex.getters.getCurrentUserId;
      const sendData = {
        user_id: currentUserId,
        post: this.post_textarea,
      };
      //投稿をpostテーブルに追加
      const response = await this.$axios.post("http://127.0.0.1:8000/api/posts", sendData);
      const {data} = {data: response.data};
      const currentUserName = vuex.getters.getCurrentUserName;
      const post_item = {
        post_id: data.data.id, 
        user_id: currentUserId, 
        post: this.post_textarea, 
        user: currentUserName,
        likes: 0
      };
      this.post_items.unshift(post_item);
    },
    async deletePost(targetPost) {//投稿の削除
      if(targetPost.user_id === vuex.getters.getCurrentUserId)
      {//自身の投稿なら削除する
        await this.$axios.delete("http://127.0.0.1:8000/api/posts/" + targetPost.post_id);
        this.getPosts();
      }
      else {//他の人の投稿なら削除しない
        alert("他の人の投稿は削除できません。");
      }
    },
    async toggleLikesNum(postUserId, postId) {//自分以外の投稿に良いねをする
      const currentUserId = vuex.getters.getCurrentUserId;
      if(postUserId === currentUserId) {
        alert("自分の投稿には「良いね」できません。");
        return;
      }
      const params = {
        user_id: currentUserId,
        post_id: postId
      };
      const response = await this.$axios.get("http://127.0.0.1:8000/api/likes/", {params});
      const {data} = {data: response.data.data};
      if (data.length === 0) {//自分の良いね数が存在しない場合、良いねを登録
        const sendData = {
          user_id: vuex.getters.getCurrentUserId,
          post_id: postId,
        };
        await this.$axios.post( "http://127.0.0.1:8000/api/posts/likes", sendData);
      } else {//自分の「良いね」が存在する場合、削除
        await this.$axios.delete(`http://127.0.0.1:8000/api/likes/users/${currentUserId}/posts/`+ postId);
      }
      this.getPosts();
    },
    toCommentPage(item) {
      this.$router.push(`/comments/posts/${item.post_id}`);
    },
    setCurrentUser(currentUser) {
      vuex.dispatch('setCurrentUserAction', currentUser);
    }
  },
  created() {
    //現在ログインしているユーザーを取得
    this.getCurrentUser();
    //全ての投稿を取得
    this.getPosts();
  },
};
</script>

<style>
.post_main {
  width: 85%;
}
.nav_item {
  list-style: none;
  margin-top: 15px;
}
.post_textarea {
  width: 100%;
  height: 16%;
  margin-top: 20px;
  resize: none;
  background-color: #f6f7f9;
  font-size: 16px;
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
