<template>
  <div>
    <div class="count-button">
      <button @click="addCount('プラス');">
        ＋
      </button>
      <p>
        {{ count }}
      </p>
      <button @click="downCount('マイナス');">
        －
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CountButton',
  computed: {
    count() {
      return this.$store.state.count;
    }
  },
  methods: {
    addCount(action) {
      this.$store.dispatch('addCount', action);
    },
    downCount(action) {
      this.$store.dispatch('downCount', action);
    }
  }
}
</script>

<style>
.count-button {
  display: flex;
  gap: 10px;
  color: black;
}
</style>
