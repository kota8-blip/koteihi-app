<template>
  <div class="container">
    <p>＜</p>
    <div class="title">{{ "カテゴリを選択" }}</div>
    <p>×</p>
  </div>
</template>

<script>
export default {
   name: 'BaseHeader',

  methods: {
    routine() {
      window.location.reload();
    },
    isActive() {
      return this.$route.path === '/settings';
  },
    // previous_page() {
    //   window.history.back();
    // },
    //  stop() {
    //   this.$store.commit('CLEAR_ROUTINE');
    //   this.$store.commit('CLEAR_COMPLETED');
    //   window.location.reload();
    // }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  font-size: 40px;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
}

.title {
  font-size: 65px;
  color: #333;
  margin-bottom: 16px;
  cursor: pointer;
  font-weight: bold;
  display: inline-block;
}
</style>
