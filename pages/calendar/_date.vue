<template>
  <div>
    <div class="container">
      <div class="date-display">
        <p>日付: {{ snapshotDate }}</p>
      </div>
      <button class="visibility-toggle" @click="toggle">{{ isVisible ? '非表示' : '表示' }}</button>
      <div v-if="isVisible">
        <div class="routine-list-containers">
          <GraphBox v-if="selectedType !== '収支'" :date="date" />
          <StackedBarChart v-else :chart-data="stackedChartData" />
          <div class="list-box-wrapper">
            <VariousTotalBudgetBox :date="date" />
            <ListBox :date="date" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GraphBox from '../../components/graphBox.vue';
import StackedBarChart from '../../components/StackedBarChart.vue';
import VariousTotalBudgetBox from '../../components/variousTotalBudgetBox.vue';
import ListBox from '../../components/listBox.vue';

export default {
  name: 'CalendarDatePage',
  components: {
    GraphBox,
    VariousTotalBudgetBox,
    ListBox,
    StackedBarChart
  },
  data() {
    return {
      snapshotDate: this.$route.params.date,
      date: this.$route.params.date,
      isVisible: true
    }
  },
  computed: {
    selectedType() {
      return this.$store.getters.getSelectedType;
    },
    stackedChartData() {
      const income = Object.entries(this.$store.state.income)
        .filter(([date]) => date.startsWith(this.date))
        .flatMap(([, items]) => items)
        .filter(item => item.amount);
        const expenses = Object.entries(this.$store.state.expenses)
        .filter(([date]) => date.startsWith(this.date))
        .flatMap(([, items]) => items)
        .filter(item => item.amount);

      // 日付をラベルにする場合
      const labels = [...new Set([
        ...Object.keys(this.$store.state.income),
        ...Object.keys(this.$store.state.expenses)
      ])].filter(date => date.startsWith(this.date)).sort();

    return {
    labels,
    datasets: [
      {
        label: '収入',
        data: labels.map(date => (this.$store.state.income[date] || []).reduce((sum, i) => sum + i.amount, 0)),
        backgroundColor: '#36A2EB'
      },
      {
        label: '支出',
        data: labels.map(date => -(this.$store.state.expenses[date] || []).reduce((sum, i) => sum + i.amount, 0)),
        backgroundColor: '#FF6384'
      }
      ]
    }
    }
  },
  mounted() {
  },
  methods: {
    toggle() {
      this.isVisible = !this.isVisible;
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-width: 1700px;
  margin: 0 auto;
  padding: 20px 20px;
  text-align: center;
  border: 1px solid black;
}
.date-display {
  font-size: 45px;
  color: black;
  margin-bottom: 20px;
  text-align: left;
}
.visibility-toggle {
  margin-bottom: 20px;
  padding: 10px 20px;
  font-size: 20px;
  margin-left: auto;
}
.routine-list-containers {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 20px;
  text-align: left;
}
.chart-wrapper {
  display: flex;
  margin-right: 40px;
}
.list-box-wrapper {
  margin-top: 20px;
  font-size: 50px;
  font-weight: bold;
}
</style>
