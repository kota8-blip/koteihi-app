<template>
  <div>
    <div class="container">
      <div class="date-display">
        <div class="categoryChoice--expense">
          <p @click="previousDate" class="previous-btn">&lt;</p>
          <select v-model="selectedDate">
            <option v-for="(date, key) in availableDates" :key="key" :value="date.value">{{ date.label }}</option>
          </select>
          <p @click="nextDate" class="next-btn">&gt;</p>
        </div>
      </div>
      <button class="visibility-toggle" @click="toggle">{{ isVisible ? '非表示' : '表示' }}</button>
      <div v-if="isVisible">
        <div>
          <div class="routine-list-containers">
            <GraphBox v-if="selectedType !== '収支'" :date="selectedDate" />
            <StackedBarChart v-else :chart-data="stackedChartData" />
            <div class="list-box-wrapper">
              <VariousTotalBudgetBox :date="selectedDate" />
              <ListBox :date="selectedDate" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GraphBox from '../components/graphBox.vue';
import VariousTotalBudgetBox from '../components/variousTotalBudgetBox.vue';
import ListBox from '../components/listBox.vue';
import StackedBarChart from '../components/StackedBarChart.vue';

export default {
  name: 'Graph',
  components: {
    GraphBox,
    VariousTotalBudgetBox,
    ListBox,
    StackedBarChart
  },
  data() {
    return {
      isVisible: true,
      selectedDate: (() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      })(),
      selectedMonth: (() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      })(),
      selectedYear: (() => {
        const d = new Date();
        return `${d.getFullYear()}`;
      })(),
      availableDates: (() => {
        const d = new Date();
      const today = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const month = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const year = `${d.getFullYear()}`;
      return [
        { label: today, value: today },
        { label: month, value: month },
        { label: year, value: year },
      ];
    })(),
    today: (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    })(),
    month: (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    })(),
    year: (() => {
      const d = new Date();
      return `${d.getFullYear()}`;
    })(),
  }
},
computed: {
  selectedType() {
    return this.$store.getters.getSelectedType;
  },
  stackedChartData() {
  const income = Object.entries(this.$store.state.income)
    .filter(([date]) => date.startsWith(this.selectedDate))
    .flatMap(([, items]) => items)
    .filter(item => item.amount);
  const expenses = Object.entries(this.$store.state.expenses)
    .filter(([date]) => date.startsWith(this.selectedDate))
    .flatMap(([, items]) => items)
    .filter(item => item.amount);

  // 日付をラベルにする場合
  const labels = [...new Set([
    ...Object.keys(this.$store.state.income),
    ...Object.keys(this.$store.state.expenses)
  ])].filter(date => date.startsWith(this.selectedDate)).sort();

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
methods: {
    toggle() {
      this.isVisible = !this.isVisible;
    },
    previousDate() {
      this.navigateDate(-1);
    },
    nextDate() {
      this.navigateDate(1);
    },
    navigateDate(delta) {
      const date = this.selectedDate;
      let newDate;
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const d = new Date(date);
        d.setDate(d.getDate() + delta);
        newDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      } else if (/^\d{4}-\d{2}$/.test(date)) {
        const [y, m] = date.split('-').map(Number);
        const d = new Date(y, m - 1 + delta, 1);
        newDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      } else if (/^\d{4}$/.test(date)) {
        newDate = String(Number(date) + delta);
      } else {
        return;
      }
      if (!this.availableDates.some(d => d.value === newDate)) {
        this.availableDates = [{ label: newDate, value: newDate }, ...this.availableDates];
      }
      this.selectedDate = newDate;
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
.categoryChoice--expense {
  display: flex;
  align-items: center;
}
.categoryChoice--expense p {
  width: 60px;
  text-align: center;
  cursor: pointer;
}
.categoryChoice--expense select {
  margin: 0 auto;
  padding: 10px 20px;
  border: 1px solid #000000;
  border-radius: 4px;
  font-size: 35px;
  height: 100px;
  color: #000000;
  cursor: pointer;
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
