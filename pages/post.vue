<template>
  <div class="post flex">
    <Side @addPostItem="addPostItem($event)"></Side>
    <div class="post_wrapper">
      <div class="title_wrapper">
        <h1>ホーム</h1>
      </div>
      <div class="post_list">
        <div v-for="(item, index) in post_items" :key="index" class="post_item">
          <div class="post_header">
            <h2 class="user_name">{{ item.user }}</h2>
            <button class="likes_btn" @click="toggleLikesNum(item)">
              <img
                src="~/assets/image/heart.png"
                width="30px"
                height="auto"
                class="post_header_img"
              />
            </button>
            <p class="likes_num">{{ item.likes }}</p>
            <button class="post_delete_btn" @click="deletePost(item, index)">
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
import common from '@/plugins/common'
export default {
  data() {
    return {
      post_textarea: null,
      post_items: [],
    };
  },
  methods: {
    async getPosts() {//全ての投稿を取得
      this.post_items.splice(0);
      const posts = await this.$axios.get("http://127.0.0.1:8000/api/posts");
      const {postsData} = {postsData: posts.data};
      const postDatas = postsData.data;
      for(const element of postDatas) {
        const userName = await common.getUserNameById(element.user_id);
        const likesCount = await this.getLikesCount(element.id);
        const postItem = { 
          post_id: element.id, 
          user_id: element.user_id, 
          post: element.post, 
          user: userName,
          likes: likesCount
        };
        this.post_items.unshift(postItem);
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
    async deletePost(targetPost, index) {//投稿の削除
      if(await common.deletePost(targetPost)) {
        this.post_items.splice(index, 1);
      }
    },
    async toggleLikesNum(item) {//自分以外の投稿に良いねをする
      const results = await common.toggleLikesNum(item.user_id, item.post_id);
      if(!results.result)
      {
        return;
      }
      if(results.likes) {
        item.likes++;
      } else {
        item.likes--;
      }
    },
    addPostItem(event) {//投稿を追加する
      this.post_items.unshift(event);
    }
  },
  created() {
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
