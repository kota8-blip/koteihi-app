<template>
  <div class="list-box">
    <ul>
      <li v-for="item in filteredListBox" :key="item.id">{{ item.category }}: {{ item.amount }}円</li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ListBox',
  computed: {
    ...mapState(['listBox']),
    filteredListBox() {
      return this.listBox.filter(item => item.amount)
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
