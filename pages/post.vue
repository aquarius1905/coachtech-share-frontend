<template>
<div class="post">
  <div class="post_wrapper">
    <Side></Side>
    <div class="post_main">
      <div class="title_wrapper">
        <h1 title="post_title">ホーム</h1>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import firebase from '~/plugins/firebase'
export default {
  data() {
    return {
    }
  },
  methods: {
    login() {
      if (!this.email || !this.password) {
        alert('メールアドレスまたはパスワードが入力されていません。')
        return
      }
      firebase
      .auth()
      .signInWithEmailAndPassword(this.email, this.password)
      .then(() => {
        this.$router.push('http://127.0.0.1:8000/api/post');
      })
      .catch(() => {
        alert('メールアドレスまたはパスワードが正しくありません。')
      })
    }
  }
}
</script>

<style scoped>
.post_wrapper {
  display: flex;
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
</style>