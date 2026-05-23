<template>
  <div class="app-header">
    <div class="header-inner">
      <div class="header-side" />
      <span class="app-title">{{ $route.path === '/settings' ? '設定' : '固定費管理' }}</span>
      <nuxt-link :to="$route.path === '/settings' ? '/' : '/settings'" class="settings-icon" aria-label="設定">
        ⚙
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseHeader',
  methods: {},
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
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
.header-side {
  width: 28px;
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
