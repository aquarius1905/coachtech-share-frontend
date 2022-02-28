<template>
  <div class="register">
    <Header></Header>
    <div class="input_wrapper">
        <h1 class="title">新規登録</h1>
        <form class="form">
          <input v-model="name" type="text" placeholder="ユーザーネーム" class="input" required/>
          <br/>
          <input v-model="email" type="email" placeholder="メールアドレス" class="input" required/>
          <br/>
          <input v-model="password" type="password" placeholder="パスワード" class="input" required/>
          <br/>
          <button @click="register" class="btn">新規登録</button>
        </form>
    </div>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'
export default {
  data() {
    return {
      name: '',
      email: '',
      password: ''
    }
  },
  methods: {
    register() {
      if (!this.name || !this.email || !this.password) {
        alert('ユーザーネーム、メールアドレス、またはパスワードが入力されていません。')
        return
      }
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
            alert('登録が完了しました。')
            this.$router.replace('/login')
        })
        .catch((error) => {
          switch (error.code) {
            case 'auth/invalid-email':
              alert('メールアドレスの形式が違います。')
              break
            case 'auth/email-already-in-use':
              alert('このメールアドレスはすでに使われています。')
              break
            case 'auth/weak-password':
              alert('パスワードは6文字以上で入力してください。')
              break
            default:
              alert('エラーが起きました。しばらくしてから再度お試しください。')
              break
          }
        })
    },
  },
}
</script>

<style>
.input_wrapper {
  width: 30%;
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
.btn {
  border: 1px solid #1d50a2;
  border-radius: 10px;
  background-color: #1d50a2;
  padding: 10px;
  text-align: center;
  color: white;
  width: 130px;
  font-size: 16px;
}
.btn:hover {
  cursor: pointer;
}
</style>