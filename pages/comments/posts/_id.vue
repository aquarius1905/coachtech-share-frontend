<template>
  <div class="comment flex">
    <Side></Side>
    <div class="post_wrapper">
      <div class="title_wrapper">
        <h1>コメント</h1>
      </div>
      <div class="post_item">
        <div class="post_header">
          <h2 class="user_name">{{ current_post.user }}</h2>
          <button class="likes_btn" @click="toggleLikesNum">
            <img
              src="~/assets/image/heart.png"
              width="30px"
              height="auto"
              class="post_header_img"
            />
          </button>
          <p class="likes_num">{{ current_post.likes }}</p>
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
                <h3 class="comment_user_name">{{ item.user_name }}</h3>
                <p class="comment_content">{{ item.comment }}</p>
              </div>
            </div>
          </div>
        <validation-observer ref="obs" v-slot="ObserverProps">
          <div class="comment_form">
            <validation-provider v-slot="{ errors }" rules="required|max:120">
              <textarea
              v-model="comment_textarea"
              name="コメント"
              class="comment_textarea"
              ></textarea>
              <div class="error">{{ errors[0] }}</div>
              <button 
                type="button" 
                :disabled="ObserverProps.invalid || !ObserverProps.validated"
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
      current_post_id: this.$route.params.id,
      current_post: {},
      comment_textarea: null,
      comment_items: []
    }
  },
  methods: {
    async getCurrentPost() {//コメント対象の投稿を取得する
      const response = await this.$axios.get("http://127.0.0.1:8000/api/posts/" + this.current_post_id);
      const {data} = {data: response.data}
      const target_post = data.data[0];
      const user_name = await common.getUserNameById(target_post.user_id);
      this.current_post = {
        user_id: target_post.user_id,
        post: target_post.post,
        user: user_name,
        likes: data.like_num,
      };
    },
    async getAllComments() {//全てのコメントを表示する
      this.comment_items.splice(0);
      const comments = await this.$axios.get("http://127.0.0.1:8000/api/comments/posts/" + this.current_post_id);
      const data = {data: comments.data};
      if(!data.data) {
        return;
      }
      const dataArray = data.data.data;
      for(const element of dataArray) {
        const user_name = await common.getUserNameById(element.user_id);
        const comment_item = { 
          user_name: user_name, 
          comment: element.comment
        };
        this.comment_items.unshift(comment_item);
      }
    },
    async addComment() {//コメントを投稿する
      const currentUserId = await common.getCurrentUserId();
      const sendData = {
        user_id: currentUserId,
        post_id: this.current_post_id,
        comment: this.comment_textarea
      };
      //コメントをcommentsテーブルに追加
      await this.$axios.post("http://127.0.0.1:8000/api/comments/posts", sendData);
      const currentUserName = await common.getUserNameById(currentUserId);
      const commentItem = {
        user_name: currentUserName,
        comment: this.comment_textarea
      }
      this.comment_items.unshift(commentItem);
      this.comment_textarea = null;
    },
    async toggleLikesNum() {//自分以外の投稿に良いねをする
      const results = await common.toggleLikesNum
      (
        this.current_post.user_id, 
        this.current_post_id
      );
      if(!results.result) {
        return;
      }
      if(results.likes) {
        this.current_post.likes++;
      } else {
        this.current_post.likes--;
      }
    },
    async deletePost() {//投稿を削除する
      if(await common.deletePost(this.current_post.user_id, this.current_post_id)) {
        this.$router.push('/post')
      }
    }
  },
  created() {
    this.getCurrentPost();
    this.getAllComments();
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