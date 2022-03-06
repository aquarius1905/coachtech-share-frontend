<template>
<div class="side">
  <div class="side_wrapper">
    <img src="../assets/image/logo.png" width="200px" height="auto" />
    <nav class="nav">
      <ul class="nav_wrapper">
        <li class="nav_item">
          <NuxtLink to="/post">
            <img
              src="../assets/image/home.png"
              width="10%"
              height="auto"
            />
            ホーム
          </NuxtLink>
        </li>
        <li class="nav_item logout_item">
          <button @click="logout" class="logout_btn">
            <img
            src="../assets/image/logout.png"
            width="10%"
            height="auto"
            />
            ログアウト
          </button>
        </li>
      </ul>
    </nav>
  </div>
  <validation-observer ref="obs" v-slot="ObserverProps">
    <validation-provider v-slot="{ errors }" rules="required|max:120">
      <label for="post_content">シェア</label>
      <br />
      <textarea
        v-model="post_content"
        id="post_content"
        name="シェア"
        width=""
        rows="8"
      ></textarea>
      <div class="error">{{ errors[0] }}</div>
    </validation-provider>
    <button
      type="button"
      :disabled="ObserverProps.invalid || !ObserverProps.validated"
      class="post_btn"
      @click="insertPost"
    >
      シェアする
    </button>
  </validation-observer>
</div>
</template>

<script>
export default {
  
}
</script>

<style>

</style>