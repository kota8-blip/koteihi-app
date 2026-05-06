<template>
  <div class="total-budget-box">
    <div class="budget-row" v-if="currentBudget">
      <h2>{{ currentBudget.type }}</h2>
      <p>{{ currentBudget.amount }}円</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VariousTotalBudgetBox',
  components: {
  },
  props: {
    date: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selectedDate: (() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      })(),
    }
  },
  computed: {
    selectedType() {
      return this.$store.getters.getSelectedType;
    },
    currentBudget() {
      return this.budgetTimes.find(item => item.type === this.selectedType);
    },
    budgetTimes() {
      const income = Object.entries(this.$store.state.income)
        .filter(([date]) => date.startsWith(this.date))
        .flatMap(([, items]) => items)
        .filter(item => item.amount)
        .reduce((sum, item) => sum + item.amount, 0);
      const expenses = Object.entries(this.$store.state.expenses)
        .filter(([date]) => date.startsWith(this.date))
        .flatMap(([, items]) => items)
        .filter(item => item.amount)
        .reduce((sum, item) => sum + item.amount, 0);
      return [
        { id: 1, type: '収入', amount: income },
        { id: 2, type: '支出', amount: expenses },
        { id: 3, type: '収支', amount: income - expenses },
      ]
    }
  },
}
</script>

<style scoped>
.total-budget-box {
  width: 800px;
  padding: 20px;
  font-size: 35px;
}
.budget-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 150px;
}
.budget-row h2,
.budget-row p {
  margin: 0;
  white-space: nowrap;
}
.list-box-wrapper {
  margin-top: 20px;
  font-size: 50px;
  font-weight: bold;
}
</style>
