<template>
    <div class="side">
    <div class="side_wrapper">
      <img src="../assets/image/logo.png" width="40%" height="40%">
      <nav class="nav">
        <ul class="nav_wrapper">
          <li class="nav_item">
            <NuxtLink to="/">
              <img src="../assets/image/home.png" width="10%" height="auto" class="img" >
              ホーム
            </NuxtLink>
          </li>
          <li class="nav_item logout_item">
            <img src="../assets/image/logout.png" width="10%" height="auto" class="img">
            <button @click="logout" class="btn">ログアウト</button>
          </li>
        </ul>
      </nav>
    </div>
    <validation-observer ref="obs" v-slot="ObserverProps">
      <validation-provider v-slot="{ errors }" rules="required|max:120">
        <label for="post_content">シェア</label>
        <textarea v-model="post_content" id="post_content" name="シェア" rows="8" ></textarea>
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