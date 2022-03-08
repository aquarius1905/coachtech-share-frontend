<template>
  <div class="header">
    <div class="header__wrapper">
      <img src="../assets/image/logo.png" width="10%" height="10%">
      <nav>
        <ul class="nav__list">
          <li class="nav__item"><NuxtLink to="/">新規登録</NuxtLink></li>
          <li class="nav__item"><NuxtLink to="/login">ログイン</NuxtLink></li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.header {
  position: relative;
  background-color: #1d50a2;
  color: #fff;
}
.header__wrapper {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav__item {
  margin-right: 20px;
}
</style>
