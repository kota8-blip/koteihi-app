<template>
  <div class="app-header">
    <div class="header-inner">
      <span class="app-title">{{ pageTitle }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseHeader',
  computed: {
    pageTitle() {
      const titles = {
        '/': '固定費管理',
        '/graph': 'グラフ',
        '/calendar': 'カレンダー',
        '/settings': '設定',
      };
      return titles[this.$route.path] || '固定費管理';
    },
  },
}
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 64px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  z-index: 100;
  border-bottom: 1px solid #eee;
}
.header-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
.app-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #111;
}
.settings-icon {
  font-size: 22px;
  color: #111;
  text-decoration: none;
  line-height: 1;
  width: 28px;
  text-align: right;
}
</style>
