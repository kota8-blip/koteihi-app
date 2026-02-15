<template>
  <div class="base-footer">
    <nav>
      <nuxt-link
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        :class="{
          'tab-item': true,
          'active': isActive(tab.path),
          'disabled': isActive(tab.path)
        }"
        :event="isActive(tab.path) ? '' : 'click'"
      >
        {{ tab.label }}
      </nuxt-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'BaseFooter',
  data() {
    return {
      tabs: [
        { label: 'Home', path: '/' },
        { label: '履歴', path: '/history' },
        { label: '設定', path: '/settings' },
        { label: '更新', path: '/update' }
      ]
    }
  },

  methods: {
    isActive(path) {
      return this.$route.path === path;
    }
  }
}

</script>

<style scoped>
.base-footer {
  text-align: center;
  width: 100%;
  padding: 30px 0;
  bottom: 0;
}
.tab-item.disabled {
  color: #d4cccc;
  pointer-events: none;
  cursor: default;
  padding: 40px 20px;
  text-align: center;
  border: 1px solid #b9b6b6;
  margin: 50px;
}
.tab-item {
  color: black;
  cursor: pointer;
  padding: 40px 20px;
  text-align: center;
  border: 1px solid #b9b6b6;
  margin: 50px;
  text-decoration: none;
}
</style>
