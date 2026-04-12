<template>
  <div class="list-box">
    <ul>
      <div v-for="item in filteredListBox" :key="item.id">
        <div v-if="item.id">
          {{ item.category }}: {{ item.amount }}円
        </div>
      </div>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ListBox',
  computed: {
    ...mapState(['expenses']),
    filteredListBox() {
      return Object.values(this.expenses || {}).flat().filter(item => item.amount)
    }
  }
}
</script>

<style scoped>
.list-box {
  width: 800px;
  padding: 20px;
  font-size: 50px;
}
.list-box li {
  margin-bottom: 100px;
}
</style>
