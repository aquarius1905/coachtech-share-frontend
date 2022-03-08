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
  getCurrentUserId() {//メールアドレスからユーザーidを取得する
    const userId = 0;
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        return 0;
      }
      console.log(user);
      const params = { email: user.email };
      axios.get("http://127.0.0.1:8000/api/user/", { params }).then((data) => {
        console.log(data);
        const { currentUserData } = { currentUserData: data.data };
        userId = currentUserData.data[0].id;
      });
    });
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
  async deletePost(targetPost) {//投稿の削除
    const currentUserId = await this.getCurrentUserId();
    if (targetPost.user_id !== currentUserId) {//他の人の投稿なら削除しない
      alert("他の人の投稿は削除できません。");
      return false;
    }
    //自身の投稿なら削除する
    await axios.delete("http://127.0.0.1:8000/api/posts/" + targetPost.post_id);
    const comments = await axios.get("http://127.0.0.1:8000/api/comments/posts/" + this.current_post_id);
    const data = { data: comments.data };
    if (data.data.length > 0) {//コメントも削除
      await axios.delete("http://127.0.0.1:8000/api/comments/posts/" + targetPost.post_id);
    }
    return true;
  },
}
