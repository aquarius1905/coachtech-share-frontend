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
            <h2 class="user_name">{{ item.user_name }}</h2>
            <button class="likes_btn" @click="toggleLikesNum(item)">
              <img
                src="~/assets/image/heart.png"
                width="30px"
                height="auto"
                class="post_header_img"
              />
            </button>
            <p class="likes_num">{{ item.like_count }}</p>
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
  middleware: 'auth',
  data() {
    return {
      post_items: [],
    };
  },
  methods: {
    async getPosts() {//全ての投稿を取得
      this.post_items.splice(0);
      const { data } = await this.$axios.get("/api/posts");
      
      for(const postData of data.data) {
        const postItem = { 
          post_id: postData.id, 
          user_id: postData.user_id, 
          post: postData.post, 
          user_name: postData.user_name,
          like_count: postData.like_count
        };
        this.post_items.unshift(postItem);
      }
    },
    async getLikesCount(postId) {//良いね数取得
      const params = { post_id: postId };
      const {data} = await this.$axios.get("/api/likes/posts/", {params});
      return data.count;
    },
    async deletePost(targetPost, index) {//投稿を削除する
      if(await common.deletePost(targetPost.user_id, targetPost.post_id)) {
        this.post_items.splice(index, 1);
      }
    },
    async toggleLikesNum(item) {//自分以外の投稿に良いねをする
      const results = await common.toggleLikesNum(item.user_id, item.post_id);
      if(!results.result) return;
      if(results.like) {
        item.like_count++;
      } else {
        item.like_count--;
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
