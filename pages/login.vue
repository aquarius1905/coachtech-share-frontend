<template>
  <div class="login">
    <Header></Header>
    <div class="input_wrapper">
        <h1 class="title">ログイン</h1>
        <div class="input_form">
          <input v-model="email" type="text" placeholder="メールアドレス" class="input" required/>
          <br/>
          <input v-model="password" type="password" placeholder="パスワード" class="input" required/>
          <br/>
          <button @click="login" class="btn">ログイン</button>
        </div>
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
        this.$router.push('/post');
      })
      .catch(() => {
        alert('メールアドレスまたはパスワードが正しくありません。')
      })
    }
  }
}
</script>