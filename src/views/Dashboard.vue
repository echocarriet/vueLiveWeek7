<template>
  <Navbar />
  <router-view v-if="status" />
</template>
<script>
import Navbar from '../components/Navbar.vue';

export default {
  data() {
    return {
      status: false,
    };
  },
  components: {
    Navbar,
  },
  created() {
    // 從 cookie 取出 token，所有 axios 請求都會加上 token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)carrieHexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1',
    );
    this.$http.defaults.headers.common.Authorization = token;
    // 檢查用戶是否仍持續登入API
    const api = `${process.env.VUE_APP_API}/api/user/check`;
    this.$http.post(api).then((response) => {
      if (response.data.success) {
        this.status = true;
      } else {
        this.$router.push('/');
      }
    });
  },
};
</script>
