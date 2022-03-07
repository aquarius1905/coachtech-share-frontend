<template>
  <div class="side">
    <div class="side_wrapper">
      <img src="~/assets/image/logo.png" width="200px" height="auto" />
      <nav>
        <ul class="nav_wrapper">
          <li class="nav_item">
            <NuxtLink to="/post">
              <img
                src="~/assets/image/home.png"
                class="home_img"
              />
              ホーム
            </NuxtLink>
          </li>
          <li class="nav_item logout_item">
            <button @click="logout" class="logout_btn">
              <img
              src="~/assets/image/logout.png"
              class="logout_img"
              />
              ログアウト
            </button>
          </li>
        </ul>
      </nav>
    </div>
    <validation-observer ref="obs" v-slot="ObserverProps">
      <validation-provider v-slot="{ errors }" rules="required|max:120">
        <label for="post_textarea">シェア</label>
        <br />
        <textarea
          v-model="post_textarea"
          class="post_textarea"
          name="シェア"
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
import firebase from "~/plugins/firebase";
export default {
  data() {
    return {
      current_user: null,
      post_content: null,
      post_items: [],
    };
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          alert("ログアウトが完了しました。");
          this.$router.replace("/login");
        });
    },
    insertPost() {

    }
  }
}
</script>

<style>
.side {
  width: 15%;
  height: 100vh;
  background-color: #1d50a2;
  color: #f6f7f9;
  padding: 20px;
}
.side_wrapper {
  margin-bottom: 40px;
}
.logout_item {
  display: flex;
  align-items: center;
}
</style>