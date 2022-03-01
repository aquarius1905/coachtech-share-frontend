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
import '@/assets/css/common.css'
export default {
  data() {
    return {
      name: '',
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
.title {
  font-size: 30px;
  text-align: center;
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