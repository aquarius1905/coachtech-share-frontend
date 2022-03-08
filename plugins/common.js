import axios from 'axios';
import firebase from "firebase";
export default {
  async getUserNameById(userId) { //ユーザーidからユーザー名を取得
    const params = {
      id: userId
    };
    const targetUser = await axios.get("http://127.0.0.1:8000/api/user/", { params });
    const {targetUserData} = {targetUserData: targetUser.data};
    return targetUserData.data[0].name;
  },

  // Firebase Auth が初期化されたら
  initFirebaseAuth() {
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
    const data = await axios.get("http://127.0.0.1:8000/api/user/", { params });
    const { currentUserData } = { currentUserData: data.data };
    const userId = currentUserData.data[0].id;
    return userId;
  },
  async toggleLikesNum(postUserId, postId) {//自分以外の投稿に良いねをする
    const currentUserId = await this.getCurrentUserId();
    if(postUserId === currentUserId) {
      alert("自分の投稿には「良いね」できません。");
      return { result: false, likes: false };
    }
    const params = {
      user_id: currentUserId,
      post_id: postId
    };
    const response = await axios.get("http://127.0.0.1:8000/api/likes", { params });
    const { data } = { data: response.data };
    if (data.data.length === 0) {//自分の良いね数が存在しない場合、良いねを登録
      await axios.post("http://127.0.0.1:8000/api/posts/likes", params);
      return { result: true, likes: true };
    } else {//自分の「良いね」が存在する場合、削除
      await axios.delete(`http://127.0.0.1:8000/api/likes/users/${currentUserId}/posts/` + postId);
      return { result: true, likes: false };
    }
  },
  async deletePost(targetPostUserId, targetPostId) {//投稿の削除
    console.log(targetPostUserId);
    console.log(targetPostId);
    const currentUserId = await this.getCurrentUserId();
    if (targetPostUserId !== currentUserId) {//他の人の投稿なら削除しない
      alert("他の人の投稿は削除できません。");
      return false;
    }
    //自身の投稿なら削除する
    await axios.delete("http://127.0.0.1:8000/api/posts/" + targetPostId);
    const comments = await axios.get("http://127.0.0.1:8000/api/comments/posts/" + targetPostId);
    const data = { data: comments.data };
    if (data.data.length > 0) {//コメントも削除
      await axios.delete("http://127.0.0.1:8000/api/comments/posts/" + targetPostId);
      console.log('deleteCommentSuccess');
    }
    return true;
  },
}
