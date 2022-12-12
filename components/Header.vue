<template>
  <div class="header">
    <div class="header__wrapper">
      <h1 class="app__ttl">SHARE</h1>
      <nav>
        <ul class="nav__list flex">
          <li class="nav__item"><NuxtLink to="/register">新規登録</NuxtLink></li>
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
.nav__list {
  justify-content: right;
}
.nav__item {
  margin-right: 20px;
}
</style>
