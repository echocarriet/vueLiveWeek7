<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold" href="#">後台區</a>
      <button
        class="navbar-toggler"
        type="button"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        @click="$refs.NavbarModal.toggleCollapse()"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <NavbarModal ref="NavbarModal" />
    </div>
  </nav>
</template>
<script>
import NavbarModal from './NavbarModal.vue';

export default {
  data() {
    return {
      collapse: {},
    };
  },
  components: {
    NavbarModal,
  },
};
</script>
