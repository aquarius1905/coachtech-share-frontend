<script>
import common from '@/plugins/common'
export default {
  async asyncData() {
    const user = await common.initFirebaseAuth();
    //ログインしている場合、ホーム画面に遷移
    //ログインしていない場合、新規登録画面に遷移
    window.location.href = user ? "/post" : "/register";
  }
}
</script>