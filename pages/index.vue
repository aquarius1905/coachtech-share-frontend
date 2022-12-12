<template>
  <div class="post flex">
    <Side @addPostItem="addPostItem"/>
    <div class="post_wrapper">
      <div class="ttl_wrapper">
        <h1>ホーム</h1>
      </div>
      <div class="post_list">
        <div v-for="(item, index) in post_items" :key="index" class="post_item">
          <div class="post_header">
            <h2 class="user_name">{{ item.user.name }}</h2>
            <button class="likes_btn" @click="toggleLikesNum(item)">
              <img
                src="~/assets/image/heart.png"
                width="30px"
                height="auto"
              />
            </button>
            <p class="likes_num">{{ item.likes_count }}</p>
            <button class="post_delete_btn" @click="deletePost(item, index)">
              <img
                src="~/assets/image/cross.png"
                width="30px"
                height="auto"
              />
            </button>
            <button class="post_delete_btn" @click="showComment(item)">
              <img src="~/assets/image/detail.png" width="30px" height="auto" />
            </button>
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

      this.post_items = data.data;
    },
    async deletePost(post, index) {//投稿を削除する
      if (await common.deletePost(post.user_id, post.id)) {
        this.post_items.splice(index, 1);
      }
    },
    async toggleLikesNum(post) {//自分以外の投稿に良いねをする
      const results = await common.toggleLikesNum(post.user_id, post.id);
      if(!results.result) return;
      if(results.like) {
        post.likes_count++;
      } else {
        post.likes_count--;
      }
    },
    async showComment(post) {
      this.$router.push({
        path: `/comments/posts/${post.id}`,
        query: { post: post }
      })
    },
    addPostItem(item) {//投稿を追加
      this.post_items.unshift(item);
    }
  },
  created() {
    this.getPosts();
  },
};
</script>