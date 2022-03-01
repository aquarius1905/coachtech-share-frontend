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
      name: null,
      email: null,
      password: null
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
          insertUsers(data).then(() => {
            this.$router.replace('/login');
          })
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
    async insertUsers(data) {
      const sendData = {
        name: this.name,
        email: data.user.email,
        password: data.user.password,
      };
      console.log(sendData);
      await this.$axios.post("http://127.0.0.1:8000/api/register", sendData)
    },
    async replaceLogin() {

    }
  },
}
</script>

<style>
.input_wrapper {
  width: 30%;
  margin: 40px auto 0;
  background-color: #f6f7f9;
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
  font-size: 16px;
}
</style>