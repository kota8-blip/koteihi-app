<template>
  <div class="app-header">
    <span class="app-title">固定費管理</span>
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
}
.app-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #111;
}
</style>
