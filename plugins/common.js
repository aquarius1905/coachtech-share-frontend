import axios from 'axios';
export default {
  async getUserNameById(userId) { //ユーザーidからユーザー名を取得
    const params = {
      id: userId
    };
    const targetUser = await axios.get("http://127.0.0.1:8000/api/user/", { params });
    const {targetUserData} = {targetUserData: targetUser.data};
    return targetUserData.data[0].name;
  },
}
