<template>
  <div class="app-wrapper" :class="{ 'theme-dark': isDark }">
    <BaseHeader />
    <nuxt />
    <BaseFooter />
  </div>
</template>

<script>
import BaseHeader from "../components/baseHeader.vue";
import BaseFooter from "../components/baseFooter.vue";
export default {
  components: {
    BaseHeader,
    BaseFooter,
  },
  computed: {
    isDark() {
      return this.$store.state.currentColor === '#1a1a1a'
    },
  },
  async mounted() {
    this.$store.commit('LOAD_FROM_STORAGE');
    if (this.$store.state.jwt) {
      this.$axios.setHeader('Authorization', `Bearer ${this.$store.state.jwt}`);
      await this.$store.dispatch('loadFixedCosts');
    }
  }
}
</script>

<style>
html {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  width: 100%;
  overflow-x: hidden;
  touch-action: manipulation;
}

body {
  margin: 0;
  width: 100%;
  overflow-x: hidden;
}

.app-wrapper {
  width: 100%;
  padding-top: 64px;
  background: #ffffff;
  min-height: 100vh;
}
.app-wrapper.theme-dark {
  background: #1a1a1a;
  color: #e0e0e0;
}

/* ダークテーマ: ヘッダー・フッター */
.theme-dark .app-header {
  background: #1a1a1a !important;
  border-color: #333 !important;
}
.theme-dark .app-title {
  color: #e0e0e0 !important;
}
.theme-dark .footer-nav {
  background: #1a1a1a !important;
  border-color: #333 !important;
}
.theme-dark .nav-item { color: #666 !important; }
.theme-dark .nav-item.nuxt-link-active { color: #4da6ff !important; }
.theme-dark .nav-item.nuxt-link-active::before { background: #4da6ff !important; }

/* ダークテーマ: カード・セクション共通 */
.theme-dark .total-card,
.theme-dark .section-body,
.theme-dark .list-box,
.theme-dark .graph-card { background: #2a2a2a !important; }
.theme-dark .total-card-label,
.theme-dark .section-title,
.theme-dark .row-action { color: #888 !important; }
.theme-dark .total-card-amount,
.theme-dark .row-label,
.theme-dark .app-title { color: #e0e0e0 !important; }
.theme-dark .setting-row { border-color: #333 !important; }
.theme-dark .breakdown-row { border-color: #333 !important; }
.theme-dark .breakdown-list { border-color: #333 !important; }
.theme-dark .tab-bar { background: #2a2a2a !important; }
.theme-dark .tab-btn.active { background: #3a3a3a !important; color: #e0e0e0 !important; }

/* ダークテーマ: index.vue */
.theme-dark .cost-name,
.theme-dark .cost-amount,
.theme-dark .total-label,
.theme-dark .total-amount { color: #e0e0e0 !important; }
.theme-dark .cost-row { border-color: #333 !important; }
.theme-dark .cost-row:hover { background: #2a2a2a !important; }
.theme-dark .cost-category { background: #333 !important; color: #aaa !important; }
.theme-dark .total-bar { background: #2a2a2a !important; border-color: #333 !important; }
.theme-dark .add-btn { background: #e0e0e0 !important; color: #1a1a1a !important; }
.theme-dark .sort-trigger { background: #2a2a2a !important; color: #e0e0e0 !important; border-color: #444 !important; }
.theme-dark .sort-menu { background: #2a2a2a !important; border-color: #444 !important; }
.theme-dark .sort-menu-item { color: #e0e0e0 !important; border-color: #333 !important; }
.theme-dark .sort-menu-item:hover { background: #3a3a3a !important; }

/* ダークテーマ: graph.vue */
.theme-dark .breakdown-name,
.theme-dark .breakdown-amount,
.theme-dark .month-nav-label { color: #e0e0e0 !important; }
.theme-dark .month-nav-btn { background: #3a3a3a !important; color: #fff !important; }
.theme-dark .month-nav-btn:disabled { opacity: 0.25 !important; }

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
