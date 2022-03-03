<template>
  <div class="register">
    <Header></Header>
    <div class="input_wrapper">
        <h1 class="title">新規登録</h1>
        <div class="input_form">
          <input 
            v-model="name" 
            type="text" 
            placeholder="ユーザーネーム" 
            class="input" 
            required maxlength="20"
          />
          <br/>
          <input 
            v-model="email"
            type="email" 
            placeholder="メールアドレス" 
            class="input" 
            required
          />
          <br/>
          <input 
            v-model="password" 
            type="password" 
            placeholder="パスワード" 
            class="input" 
            required
          />
          <br/>
          <button @click="register" class="btn">新規登録</button>
        </div>
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
          this.insertUser().then(() => {
          })
        })
        .catch((e) => {
          switch (e.code) {
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
    async insertUser() {
      const sendData = {
        name: this.name,
        email: this.email,
      }
      await this.$axios.post("http://127.0.0.1:8000/api/register", sendData)
      this.$router.replace('/login')
    }
  },
}
</script>