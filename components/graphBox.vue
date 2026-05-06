<template>
  <div class="chart-wrapper">
    <canvas ref="canvas" />
  </div>
</template>

<script>
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Doughnut } from 'vue-chartjs';
import { Chart } from 'chart.js';

export default {
  name: 'GraphBox',
  extends: Doughnut,
  props: {
    date: {
      type: String,
      required: true
    }
  },
  computed: {
    selectedType() {
      return this.$store.getters.getSelectedType;
    },
    chartData() {
      if (this.selectedType === '収入') {
        const incomeItems = Object.entries(this.$store.state.income)
          .filter(([date]) => date.startsWith(this.date))
          .flatMap(([, items]) => items)
          .filter(item => item.amount);
        const categoryColors = {
          '給料': '#FF6384',
          '副業': '#36A2EB',
          'その他': '#4BC0C0',
        };
        const filtered = incomeItems.filter(item => item.amount);
        return {
          labels: filtered.map(item => item.category),
          datasets: [{
            data: filtered.map(item => item.amount),
            backgroundColor: filtered.map(item => categoryColors[item.category] || '#000000')
          }]
        }
      }
      else {
        const items = Object.entries(this.$store.state.expenses)
          .filter(([date]) => date.startsWith(this.date))
          .flatMap(([, items]) => items)
          .filter(item => item.amount);
        const categoryColors = {
          '食事': '#FF6384',
          '交通': '#36A2EB',
          '娯楽': '#FFCE56',
          'その他': '#4BC0C0',
        };
        const filtered = items.filter(item => item.amount);
        return {
          labels: filtered.map(item => item.category),
          datasets: [{
            data: filtered.map(item => item.amount),
            backgroundColor: filtered.map(item => categoryColors[item.category] || '#000000')
          }]
        }
      }
    }
  },
  watch: {
    chartData: {
      handler() {
        this.renderChart(this.chartData, {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false,
          },
          tooltips: {
            bodyFontSize: 30,
            titleFontSize: 30
          },
          plugins: {
            datalabels: {
              color: '#fff',
              font: {
                size: 24
              },
              formatter: (value, context) => {
                const total = context.dataset.data.reduce((acc, val) => acc + val, 0);                return `${context.chart.data.labels[context.dataIndex]}`;
              }
            }
          }
        });
      },
      deep: true
    }
  },
  mounted() {
    Chart.plugins.register(ChartDataLabels);
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      tooltips: {
        bodyFontSize: 30,
        titleFontSize: 30
      },
      plugins: {
        datalabels: {
          color: '#fff',
          font: {
            size: 24
          },
          formatter: (value, context) => {
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);            return `${context.chart.data.labels[context.dataIndex]}`;
          }
        }
      }
    });
  },
}
</script>

<style scoped>
.chart-wrapper {
  width: 800px;
  height: 800px;
}
</style>
