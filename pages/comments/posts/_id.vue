<template>
  <div class="comment flex">
    <Side></Side>
    <div class="post_wrapper">
      <div class="ttl_wrapper">
        <h1>コメント</h1>
      </div>
      <div class="post_item">
        <div class="post_header">
          <h2 class="user_name">{{ current_post.user.name }}</h2>
          <button class="likes_btn" @click="toggleLikesNum">
            <img
              src="~/assets/image/heart.png"
              width="30px"
              height="auto"
              class="post_header_img"
            />
          </button>
          <p class="likes_num">{{ current_post.likes_count }}</p>
          <button class="post_delete_btn" @click="deletePost">
            <img
              src="~/assets/image/cross.png"
              width="30px"
              height="auto"
            />
          </button>
        </div>
        <p class="post_content">{{ current_post.post }}</p>
      </div>
      <div class="comment_wrapper">
          <div class="sub_title_wrapper">
            <h2>コメント</h2>
          </div>
          <div class="comment_list">
            <div v-for="(item, index) in comment_items" :key="index" class="comment_item">
              <div class="comment_header">
                <h3 class="comment_user_name">{{ item.user.name }}</h3>
                <p class="comment_content">{{ item.comment }}</p>
              </div>
            </div>
          </div>
        <validation-observer ref="obs" tag="div">
          <div class="comment_form">
            <validation-provider mode="passive" v-slot="{ errors }" rules="required|max:120">
              <textarea
              v-model="comment_textarea"
              name="コメント"
              class="comment_textarea"
              ></textarea>
              <div class="error">{{ errors[0] }}</div>
              <button 
                type="button" 
                class="comment_btn"
                @click="addComment"
                >
                コメント
              </button>
            </validation-provider>
          </div>
        </validation-observer>
      </div>
    </div>
  </div>
</template>

<script>
import common from '@/plugins/common'
export default {
  data() {
    return {
      current_post: this.$route.query.post,
      comment_textarea: null,
      comment_items: this.$route.query.post.comments
    }
  },
  methods: {
    async addComment() {//コメントを投稿する
      const isValid = await this.$refs.obs.validate();
      if(!isValid) return;
      const currentUserId = await common.getCurrentUserId();
      const sendData = {
        user_id: currentUserId,
        post_id: this.current_post.id,
        comment: this.comment_textarea
      };
      //コメントをcommentsテーブルに追加
      const { data } = await this.$axios.post("/api/comments/posts", sendData);
      this.comment_items.unshift(data.data);
      this.comment_textarea = null;
    },
    async toggleLikesNum() {//自分以外の投稿に良いねをする
      const results = await common.toggleLikesNum
      (
        this.current_post.user_id, 
        this.current_post.id
      );
      if(!results.result) {
        return;
      }
      console.log(this.current_post);
      if(results.like) {
        this.current_post.likes_count++;
      } else {
        this.current_post.likes_count--;
      }
    },
    async deletePost() {//投稿を削除する
      if (await common.deletePost(this.current_post.user_id, this.current_post.id)) {
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
.sub_title_wrapper {
  text-align: center;
  background-color: #eee;
  color: #1d50a2;
  font-size: 20px;
  padding: 20px;
}
.comment_form {
  border: 1px solid #eee;
  background: #1d50a2;
  text-align: center;
  padding: 20px;
}
.comment_user_name {
  font-size: 24px;
  margin-bottom: 20px;
}
.comment_textarea {
  width: 90%;
  height: 50px;
  resize: none;
  background-color: #eee;
  font-size: 16px;
}
</style>