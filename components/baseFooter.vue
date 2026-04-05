<template>
  <div class="base-footer">
    <nav>
      <button
        v-for="tab in tabs"
        :key="tab.label"
        @click="tab.action ? handleAction(tab.action) : navigate(tab.path)"
        :class="{
          'tab-item': true,
          'active': isActive(tab.path),
          'disabled': isActive(tab.path)
        }"
        :event="isActive(tab.path) ? '' : 'click'"
      >
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'BaseFooter',
  data() {
    return {
      tabs: [
        { label: '入力', path: '/' },
        { label: 'グラフ', path: '/graph' },
        { label: 'カレンダー', path: '/calendar' },
        { label: '設定', action: 'update' }
      ]
    }
  },

  methods: {
    isActive(path) {
      return this.$route.path === path;
    },
    handleAction(action) {
      if (action === 'update') {
        window.location.reload();
      }
    },
    navigate(path) {
      this.$router.push(path);
    }
  }
}

</script>

<style scoped>
.base-footer {
  text-align: center;
  width: 100%;
  padding: 30px 0;
}
.tab-item.disabled {
  color: #d4cccc;
  pointer-events: none;
  cursor: default;
  padding: 40px 20px;
  text-align: center;
  border: 1px solid black;
  margin: 10px;
}
.tab-item {
  color: black;
  cursor: pointer;
  padding: 40px 20px;
  text-align: center;
  border: 1px solid black;
  margin: 10px;
  text-decoration: none;
}
</style>
