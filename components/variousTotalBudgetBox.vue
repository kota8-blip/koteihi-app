<template>
  <div class="total-budget-box">
    <div class="budget-row" v-for="budgetTime in budgetTimes" :key="budgetTime.id">
      <h2>{{ budgetTime.type }}</h2>
      <p>{{ budgetTime.amount }}円</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VariousTotalBudgetBox',
  computed: {
    budgetTimes() {
      const income = this.$store.state.income;
      const expenses = this.$store.getters.getExpenses;
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
</style>
