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
    <div class="post_wrapper">
      <label class="label">シェア</label>
      <br/>
      <textarea class="post" name="post" rows="8" cols="40"/>
      <br/>
      <button class="share_btn">シェアする</button>
    </div>
  </div>
</template>

<style scoped>
.side {
  width: 15%;
  height: 100vh;
  background-color: #1d50a2;
  color: #fff;
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
.post {
  width: 98%;
  margin-top: 20px;
  resize: none;
}
.share_btn {
  display: block;
  border: 1px solid #1d50a2;
  border-radius: 10px;
  background-color: white;
  padding: 10px;
  color: #1d50a2;
  width: 110px;
  font-size: 16px;
  margin: 20px 0 0 auto;
  cursor: pointer;
}
</style>
