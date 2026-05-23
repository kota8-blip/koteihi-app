<template>
  <div class="app-header">
    <span class="app-title">固定費管理</span>
    <nuxt-link to="/settings" class="settings-icon" aria-label="設定">
      ⚙
    </nuxt-link>
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
  justify-content: center;
  align-items: center;
  padding: 24px 0 20px;
  position: relative;
}
.app-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #111;
}
.settings-icon {
  position: absolute;
  right: 16px;
  font-size: 22px;
  color: #111;
  text-decoration: none;
  line-height: 1;
}
</style>
