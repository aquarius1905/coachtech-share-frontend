<template>
  <div class="login">
    <Header></Header>
    <div class="input_wrapper">
        <h1 class="title">ログイン</h1>
        <form class="form">
          <input v-model="email" type="text" placeholder="メールアドレス" class="input" required/>
          <br/>
          <input v-model="password" type="password" placeholder="パスワード" class="input" required/>
          <br/>
          <button @click="login" class="btn">ログイン</button>
        </form>
    </div>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'
export default {
  data() {
    return {
      email: '',
      password: ''
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

<style>
.register__wrapper {
  width: 40%;
  margin: 40px auto 0;
  background-color: #eaf6f6;
  padding: 30px;
}
.form {
  text-align: center;
  margin-top: 20px;
}
.input {
  border-radius: 5px;
  width: 360px;
  height: 30px;
  padding: 7px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
}
</style>