<template>
  <div class="container">
    <form class="row justify-content-center" @submit.prevent="signIn">
      <div class="col-md-6">
        <h2 class="text-center fw-bold py-3">後台登入頁面</h2>
        <div class="form-floating mb-3">
          <input
            type="email"
            class="form-control"
            id="username"
            placeholder="name@example.com"
            v-model="user.username"
          />
          <label for="username">Email address</label>
        </div>
        <div class="form-floating mb-3">
          <input
            type="password"
            class="form-control"
            id="assword"
            placeholder="Password"
            v-model="user.password"
          />
          <label for="assword">Password</label>
        </div>
        <button type="submit" class="btn btn-primary d-block w-100">登入</button>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    signIn() {
      const api = `${process.env.VUE_APP_API}/admin/signin`;
      this.$http
        .post(api, this.user)
        .then((response) => {
          if (response.data.success) {
            const { token, expired } = response.data;
            document.cookie = `carrieHexToken=${token}; expires=${new Date(expired)};`;
            this.$router.push('/admin/products');
          } else {
            console.log(response.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
