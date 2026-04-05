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
  computed: {
    chartData() {
      const filtered = this.$store.state.listBox.filter(item => item.amount);
      return {
        labels: filtered.map(item => item.category),
        datasets: [{
          data: filtered.map(item => item.amount),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }]
      }
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
  }
}
</script>

<style scoped>
.chart-wrapper {
  width: 800px;
  height: 800px;
}
</style>
