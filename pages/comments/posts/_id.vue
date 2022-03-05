<template>
  <div class="comment">
    <div class="title_wrapper">
      <h1 class="page_title">コメント</h1>
    </div>
    <div class="">
      <div class="post_item">
        <div class="post_header">
          <h2 class="user_name">jiro</h2>
          <button class="likes_btn" @click="toggleLikesNum">
            <img
              src="../../../assets/image/heart.png"
              width="30px"
              height="auto"
              class="post_header_img"
            />
          </button>
          <p class="likes_num">0</p>
          <button class="post_delete_btn" @click="deletePost">
            <img
              src="../../../assets/image/cross.png"
              width="30px"
              height="auto"
            />
          </button>
        </div>
        <p class="content">はじめまして</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style scoped>
</style>