<template>
  <div class="post flex">
    <Side @addPostItem="addPostItem($event)"></Side>
    <div class="post_wrapper">
      <div class="ttl_wrapper">
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
          <p class="post_content">{{ item.post }}</p>
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
    async deletePost(targetPost, index) {//投稿を削除する
      if(await common.deletePost(targetPost.user_id, targetPost.post_id)) {
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

<style scoped>
.to_comment {
  cursor: pointer;
}
</style>
