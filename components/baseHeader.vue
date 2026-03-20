<template>
  <div class="container">
    <div class="title" @click="routine">{{ isActive() ? '設定' : 'Routine Tracker' }}</div>
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
  }
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

.title {
  font-size: 32px;
  color: #333;
  margin-bottom: 16px;
  cursor: pointer;
  font-weight: bold;
  display: inline-block;
}
</style>
