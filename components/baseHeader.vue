<template>
  <div class="container">
    <div class="button-group">
      <div v-for="item in items" :key="item.id">
        <BaseButton
          v-if="!(item.name === '収支' && $route.path === '/')"
          @click="changePattern(item.id)"
          :button-text="item.name"
          :is-active="item.isActive"
          :bg-color="item.isActive ? '#f0f0f0' : '#f0f0f0'"
          :text-color="item.isActive ? '#d4cccc' : '#000000'"
          :is-disabled="item.isActive"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from '~/components/BaseButton.vue';

export default {
  name: 'BaseHeader',
  components: {
    BaseButton
  },
  data() {
    return {
      items: [
        { id: 1, name: '支出', isActive: true },
        { id: 2, name: '収入', isActive: false },
        { id: 3, name: '収支', isActive: false },
      ],
    }
  },
  methods: {
    routine() {
      window.location.reload();
    },
    isActive() {
      return this.$route.path === '/settings';
    },
    changePattern(id) {
      this.items.forEach(item => {
        item.isActive = item.id === id;
      });
      const selectedType = this.items.find(item => item.isActive).name;
      this.$store.commit('SET_SELECTED_TYPE', selectedType);
    },
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  color: #ccc;
  margin: 30px;
}
.button-group {
  display: flex;
  gap: 20px;
}
</style>
