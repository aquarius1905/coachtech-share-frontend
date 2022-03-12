import axios from 'axios';
import firebase from "firebase";
export default {
  initFirebaseAuth() {// Firebase Authの初期化
    return new Promise((resolve) => {
      let unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        // user オブジェクトを resolve
        resolve(user);
        // 登録解除
        unsubscribe();
      });
    });
  },
  async getCurrentUserId() {//メールアドレスからユーザーidを取得する
    let user = await firebase.auth().currentUser;
    if (!user) {
      user = await this.initFirebaseAuth();
    }
    const params = { email: user.email };
    const targetUser = await axios.get("http://127.0.0.1:8000/api/user/", { params });
    const { targetUserData } = { targetUserData: targetUser.data };
    return targetUserData.id;
  },
  async toggleLikesNum(postUserId, postId) {//自分以外の投稿に良いねをする
    const currentUserId = await this.getCurrentUserId();
    if(postUserId === currentUserId) {
      alert("自分の投稿には「良いね」できません。");
      return { result: false, like: false };
    }
    const params = {
      user_id: currentUserId,
      post_id: postId
    };
    const { data } = await axios.get("http://127.0.0.1:8000/api/likes", { params });
    if (data.count > 0) {//自分の「良いね」が存在する場合、削除
      await axios.delete(`http://127.0.0.1:8000/api/likes/users/${currentUserId}/posts/` + postId);
      return { result: true, like: false };
    } else {//自分の良いね数が存在しない場合、良いねを登録
      await axios.post("http://127.0.0.1:8000/api/posts/likes", params);
      return { result: true, like: true };
    }
  },
  async deletePost(targetPostUserId, targetPostId) {//投稿を削除する
    const currentUserId = await this.getCurrentUserId();
    if (targetPostUserId !== currentUserId) {
      alert("他の人の投稿は削除できません。");
      return false;
    }
    if (!confirm('削除しますか？')) {
      return false;
    }
    //自身の投稿なら削除する(コメントが存在した場合、同時に削除する)
    await axios.delete("http://127.0.0.1:8000/api/posts/" + targetPostId);
    return true;
  },
}
