<template>
  <div :style="{backgroundColor: currentColor, minHeight: '100vh'}">
    <BaseHeader />
    <nuxt />
    <BaseFooter />
    <svg-icon />
  </div>
</template>

<script>
import BaseFooter from "../components/baseFooter.vue";
import BaseHeader from "../components/baseHeader.vue";
import svgIcon from "../components/svg";
export default {
  components: {
    BaseHeader,
    BaseFooter,
    svgIcon
  },
  computed: {
    currentColor() {
      return this.$store.state.currentColor;
    }
  },
  watch: {
    currentColor(val) {
      document.documentElement.style.backgroundColor = val;
    }
  },
  mounted() {
    // ページ読み込み時にlocalStorageからデータを復元
    this.$store.commit('LOAD_FROM_STORAGE');
    document.documentElement.style.backgroundColor = this.currentColor;
  },
}
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  max-height: 2000px;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
