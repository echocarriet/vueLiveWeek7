<template>
  <div class="container">
    <h2 class="text-center fw-bold py-4">優惠券</h2>
    <div class="text-end py-3">
      <button type="button" class="btn btn-primary" @click="openCouponModal(true)">
        建立新的優惠券
      </button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>優惠碼</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in coupons" :key="item">
          <th>{{ index + 1 }}</th>
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}%</td>
          <td>{{ $filters.date(item.due_date) }}</td>
          <td>{{ item.code }}</td>
          <td>
            <span v-if="item.is_enabled === 1" class="text-primary">啟用</span>
            <span v-else class="text-secondary">不啟用</span>
          </td>
          <td>
            <div class="btn-group" role="group" aria-label="Basic outlined example">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="openCouponModal(false, item)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="openDelCouponModal(item)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 編輯與新增優惠券 Modal -->
    <CouponModal
      ref="CouponModal"
      :coupon="tempCoupon"
      :isNew="isNew"
      @update-coupon="updateCoupon"
    />
    <!-- 刪除 Modal -->
    <DelModal ref="DelModal" :product="tempCoupon" @del-item="delCouponModal" />
  </div>
</template>
<script>
import CouponModal from '../components/CouponModal.vue';
import DelModal from '../components/DelModal.vue';

export default {
  data() {
    return {
      coupons: [],
      tempCoupon: {
        title: '',
        is_enabled: 0,
        percent: 100,
        due_date: '',
        code: '',
      },
      isNew: false,
    };
  },
  components: {
    CouponModal,
    DelModal,
  },
  methods: {
    getCoupons() {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupons?page`;
      this.$http
        .get(api)
        .then((response) => {
          this.coupons = response.data.coupons;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openCouponModal(isNew, item) {
      this.isNew = isNew;
      if (isNew) {
        this.tempCoupon = {};
        this.isNew = true;
      } else {
        // this.tempCoupons = JSON.parse(JSON.stringify(item)); // 深層拷貝
        this.tempCoupon = { ...item };
        this.isNew = false;
      }
      const couponsComponent = this.$refs.CouponModal;
      couponsComponent.openModal();
    },
    updateCoupon(tempCoupon) {
      // 編輯與新增的api結構相似，差在方法，所以寫一起
      this.tempCoupon = tempCoupon;
      let api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon`;
      let httpMethod = 'post';
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${this.tempCoupon.id}`;
        httpMethod = 'put';
      }
      const couponComponent = this.$refs.CouponModal;
      this.$http[httpMethod](api, { data: this.tempCoupon })
        .then((response) => {
          if (response.data.success) {
            this.getCoupons();
            couponComponent.hideModal();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openDelCouponModal(item) {
      this.tempCoupon = { ...item };
      this.$refs.DelModal.openModal();
    },
    delCouponModal() {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon/${this.tempCoupon.id}`;
      this.$http.delete(api).then((response) => {
        if (response.data.success) {
          this.$refs.DelModal.hideModal();
          console.log(response.data.message);
          this.getCoupons();
        }
      });
    },
  },
  mounted() {
    this.getCoupons();
  },
};
</script>
