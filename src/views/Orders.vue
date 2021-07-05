<template>
  <div class="container">
    <h2 class="text-center fw-bold py-4">訂單</h2>
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>購買時間</th>
          <th>Email</th>
          <th>購買款項</th>
          <th>應付金額</th>
          <th>是否付款</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in orders" :key="item.id">
          <tr v-if="orders.length" :class="{ 'text-secondary': !item.is_paid }">
            <th>{{ index + 1 }}</th>
            <td>{{ $filters.date(item.create_at) }}</td>
            <!-- <td><span v-text="item.user.email" v-if="item.user"></span></td> -->
            <td>{{ item.user.email }}</td>
            <td>
              <ul class="list-unstyled" v-for="item in item.products" :key="item">
                <li>{{ item.product.title }} ，數量 : {{ item.qty }}{{ item.product.unit }}</li>
              </ul>
            </td>
            <td>{{ $filters.currency(item.total) }}</td>
            <td>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="`paidSwitch${item.id}`"
                  v-model="item.is_paid"
                  @change="updatePaid(item)"
                />
                <label class="form-check-label" :for="`paidSwitch${item.id}`">
                  <span v-if="item.is_paid">已付款</span>
                  <span v-else>未付款</span>
                </label>
              </div>
            </td>
            <td>
              <div class="btn-group" role="group" aria-label="Basic outlined example">
                <button
                  type="button"
                  class="btn btn-outline-primary btn-sm"
                  @click="openModal(item)"
                >
                  檢視
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="openDelOrderModal(item)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <!-- 檢視Modal -->
    <!-- <OrderModal ref="OrderModal" :order="tempOrder" @update-paid="updatePaid"></OrderModal> -->
    <OrderModal ref="OrderModal" :order="tempOrder" @update-paid="updatePaid" />
    <!-- 刪除Modal -->
    <DelModal ref="DelModal" :product="tempOrder" @del-item="delOrder" />
    <!-- 頁碼 -->
    <Pagination :pages="pagination" @emitPages="getOrders" />
  </div>
</template>
<script>
import Pagination from '../components/Pagination.vue';
import OrderModal from '../components/OrderModal.vue';
import DelModal from '../components/DelModal.vue';

export default {
  data() {
    return {
      orders: {},
      tempOrder: {},
      isNew: false,
      pagination: {},
      currentPage: 1,
    };
  },
  components: {
    Pagination,
    OrderModal,
    DelModal,
  },
  inject: ['emitter'],
  methods: {
    getOrders(page) {
      this.currentPage = page;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/orders?page=${page}`;
      this.$http.get(api).then((response) => {
        if (response.data.success) {
          console.log(response);
          this.orders = response.data.orders;
          this.pagination = response.data.pagination;
        }
      });
    },
    updatePaid(item) {
      // 修改訂單 API
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/order/${item.id}`;
      const paid = {
        is_paid: item.is_paid,
      };
      this.$http.put(api, { data: paid }).then((response) => {
        const orderComponent = this.$refs.OrderModal;
        orderComponent.hideModal();
        console.log(response.data.message);
        this.getOrders(this.currentPage);
      });
    },
    openModal(item) {
      this.tempOrder = { ...item };
      const orderComponent = this.$refs.OrderModal;
      orderComponent.openModal();
    },
    delOrder() {
      // 刪除訂單 API
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/order/${this.tempOrder.id}`;
      this.$http.delete(api).then((response) => {
        console.log(response.data.message);
        const delComponent = this.$refs.DelModal;
        delComponent.hideModal();
        this.getOrders(this.currentPage);
      });
    },
    openDelOrderModal(item) {
      this.tempOrder = { ...item };
      const delComponent = this.$refs.DelModal;
      delComponent.openModal();
    },
  },
  created() {
    this.getOrders();
  },
};
</script>
