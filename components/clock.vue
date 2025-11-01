<template>
  <div class="clock">
    {{ 時間 }}
  </div>
</template>

<script>
export default {
  name: 'Clock',
   computed: {
    時間() {
      return this.$store.state.時間;
    }
  },
  created() {
    this.$store.dispatch('updateTime', new Date().toLocaleTimeString());
    this.timer = setInterval(() => {
      this.$store.dispatch('updateTime', new Date().toLocaleTimeString());
    }, 1000);
  },
};
</script>
<style scoped>
.clock {
      font-size: px10rem(28px);
      color: black;
      margin: px2rem(10px) 0;
      /* &.active {
      color: red;
      } */
    }
</style>

