<template>
  <div class="side">
    <div class="side__wrapper">
      <img src="../assets/image/logo.png" width="40%" height="40%">
      <nav class="nav">
        <ul class="nav__wrapper">
          <li class="nav__item"><NuxtLink to="/"><img src="../assets/image/home.png" width="8%" class="img" >ホーム</NuxtLink></li>
          <li class="nav__item"><img src="../assets/image/logout.png" width="8%" class="img" ><NuxtLink to="/login">ログアウト</NuxtLink></li>
        </ul>
      </nav>
    </div>
    <validation-observer ref="obs" v-slot="ObserverProps">
      <validation-provider v-slot="{ errors }" rules="required|max:120">
        <label for="share">シェア</label>
        <textarea v-model="test" id="share" name="シェア" rows="8" ></textarea>
        <div class="error">{{ errors[0] }}</div>
      </validation-provider>
      <button 
        type="button"
        :disabled="ObserverProps.invalid || !ObserverProps.validated"
        class="post_btn" @click="post"
      >
      シェアする
      </button>
    </validation-observer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      share: ''
    }
  },
  methods: {
    post() {

    }
  }
}
</script>

<style scoped>
.side {
  width: 15%;
  height: 100vh;
  background-color: #1d50a2;
  color: #f6f7f9;
  padding: 20px;
}
.side__wrapper {
  margin-bottom: 40px;
}
.nav__item {
  list-style: none;
  margin-top: 15px;
}
.img {
  vertical-align: middle;
  margin-right: 20px;
}
#share {
  width: 98%;
  margin-top: 20px;
  resize: none;
  background-color: #f6f7f9;
}
.post_btn {
  display: block;
  border: 1px solid #f6f7f9;
  border-radius: 10px;
  background-color: #f6f7f9;
  padding: 10px;
  color: #1d50a2;
  width: 110px;
  font-size: 16px;
  margin: 20px 0 0 auto;
  cursor: pointer;
  }
.share_btn:hover {
  background-color: #f0f0f0;
  border: 1px solid #f0f0f0;
  transition: .5s;
  }
</style>

<script>
export default {
  data() {
    return {
      post: null
    }
  },
  methods: {
    share(){
      
    }
  }
}
</script>