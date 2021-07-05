<template>
  <div class="container">
    <h2 class="text-center fw-bold py-4">產品</h2>
    <div class="text-end py-2">
      <button type="button" class="btn btn-primary mb-4" @click="openModal(true)">
        建立新商品
      </button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>分類</th>
          <th>產品名稱</th>
          <th>原價</th>
          <th>售價</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in products" :key="item.id">
          <th>{{ index + 1 }}</th>
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-end">{{ $filters.currency(item.origin_price) }}</td>
          <td class="text-end">{{ $filters.currency(item.price) }}</td>
          <td class="text-center" :class="{ 'text-primary': item.is_enabled }">
            {{ item.is_enabled ? '啟用' : '不啟用' }}
          </td>
          <td>
            <div class="btn-group" role="group" aria-label="Basic outlined example">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="openModal(false, item)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="openDelProductModal(item)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <ProductModal
      ref="ProductModal"
      :product="tempProduct"
      :isNew="isNew"
      @update-product="updateProduct"
    />
    <DelModal ref="DelModal" :product="tempProduct" @del-item="delProduct" />
    <!-- 在 HTML 使用動態屬性 v-bind，把外層與內層做串接 -->
    <!-- 口訣前內後外，前為ProductModal.vue的update-product，後為Products.vue的updateProduct方法。
    :product和:isNew也一樣 -->
    <Pagination :pages="pagination" @emitPages="getProducts" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination.vue';
import ProductModal from '../components/ProductModal.vue';
import DelModal from '../components/DelModal.vue';

export default {
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false,
      isLoading: false,
      status: {
        fileUploading: false,
      },
      modal: {
        editModal: '',
        delModal: '',
      },
      currentPage: 1,
    };
  },
  components: {
    ProductModal,
    DelModal,
    Pagination,
  },
  methods: {
    getProducts(page = 1) {
      this.currentPage = page;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/products?page=${page}`;
      this.$http
        .get(api)
        .then((response) => {
          if (response.data.success) {
            console.log(response);
            this.products = response.data.products;
            this.pagination = response.data.pagination;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openModal(isNew, item) {
      // 編輯與新增為同一個Modal，用 isNew區分
      if (isNew) {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
      } else {
        this.tempProduct = JSON.parse(JSON.stringify(item)); // 深層拷貝
        this.isNew = false;
      }
      const productComponent = this.$refs.ProductModal;
      productComponent.openModal();
    },
    updateProduct(item) {
      // 編輯與新增的api結構相似，差在方法，所以寫一起
      this.tempProduct = item;
      let api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product`;
      let httpMethod = 'post';
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${this.tempProduct.id}`;
        httpMethod = 'put';
      }
      const productComponent = this.$refs.ProductModal;
      this.$http[httpMethod](api, { data: this.tempProduct })
        .then((response) => {
          if (response.data.success) {
            productComponent.hideModal();
            this.getProducts(this.currentPage);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openDelProductModal(item) {
      this.tempProduct = { ...item };
      const delComponent = this.$refs.DelModal;
      delComponent.openModal();
    },
    delProduct() {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${this.tempProduct.id}`;
      this.$http
        .delete(api)
        .then((response) => {
          if (response.data.success) {
            const delComponent = this.$refs.DelModal;
            delComponent.hideModal();
            this.getProducts(this.currentPage);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getProducts();
  },
};
</script>
