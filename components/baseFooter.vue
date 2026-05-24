<template>
  <nav class="footer-nav">
    <div class="footer-inner">
      <nuxt-link to="/" class="nav-item" exact>
        <span class="nav-icon">🏠</span>
        <span class="nav-label">ホーム</span>
      </nuxt-link>
      <nuxt-link to="/graph" class="nav-item">
        <span class="nav-icon">📊</span>
        <span class="nav-label">グラフ</span>
      </nuxt-link>
      <nuxt-link to="/calendar" class="nav-item">
        <span class="nav-icon">📅</span>
        <span class="nav-label">カレンダー</span>
      </nuxt-link>
      <nuxt-link to="/settings" class="nav-item">
        <span class="nav-icon">⚙</span>
        <span class="nav-label">設定</span>
      </nuxt-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'BaseFooter',
}
</script>

<style scoped>
.footer-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  border-top: 1px solid #e0e0e0;
  z-index: 100;
}
.footer-inner {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-decoration: none;
  color: #aaa;
  flex: 1;
  padding: 6px 0;
}
.nav-item.nuxt-link-active {
  color: #007bff;
}
.nav-icon {
  font-size: 20px;
  line-height: 1;
}
.nav-label {
  font-size: 10px;
}
</style>
