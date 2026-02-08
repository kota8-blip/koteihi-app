<template>
  <div class="container">
    <h1>習慣トラッカー</h1>
    <p>毎日の習慣を記録して、継続しよう！</p>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      message: '習慣トラッカーへようこそ！'
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

h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 16px;
}

p {
  font-size: 18px;
  color: red;
}
</style>
