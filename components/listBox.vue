<template>
  <div class="list-box">
    <ul>
      <div v-if="selectedType === '支出'">
        <div v-for="item in filteredExpensesBox" :key="item.id">
          {{ item.category }}: {{ item.amount }}円
        </div>
      </div>
      <div v-else-if="selectedType === '収入'">
        <div v-for="item in filteredIncomeBox" :key="item.id">
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
  props: {
    date: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(['expenses','income']),
    filteredExpensesBox() {
      return Object.entries(this.$store.state.expenses)
        .filter(([date]) => date.startsWith(this.date))
        .flatMap(([, items]) => items)
        .filter(item => item.amount);
    },
    filteredIncomeBox() {
      return Object.entries(this.$store.state.income)
        .filter(([date]) => date.startsWith(this.date))
        .flatMap(([, items]) => items)
        .filter(item => item.amount);
    },
    selectedType() {
      return this.$store.getters.getSelectedType;
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
