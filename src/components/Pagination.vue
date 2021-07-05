<template>
  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: !pages.has_pre }">
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="updatePage(pages.current_page - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li
        class="page-item"
        v-for="item in pages.total_pages"
        :key="item"
        :class="{ active: item === pages.current_page }"
      >
        <span class="page-link" v-if="item === pages.current_page">{{ item }}</span>
        <a class="page-link" href="#" v-else @click.prevent="updatePage(item)">{{ item }}</a>
      </li>

      <li class="page-item" :class="{ disabled: !pages.has_next }">
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          @click.prevent="updatePage(pages.current_page + 1)"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  props: {
    pages: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    updatePage(page) {
      this.$emit('emitPages', page);
    },
  },
};
</script>
