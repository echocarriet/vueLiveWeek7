import Collapse from 'bootstrap/js/dist/collapse';

export default {
  methods: {
    openCollapse() {
      this.collapse.show();
    },
    hideCollapse() {
      this.collapse.hide();
    },
    toggleCollapse() {
      this.collapse.toggle();
    },
  },
  mounted() {
    this.collapse = new Collapse(this.$refs.bsCollapse, {
      toggle: false,
    });
  },
};
