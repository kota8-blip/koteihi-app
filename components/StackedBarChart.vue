<script>
import { Bar, mixins } from 'vue-chartjs';

export default {
  name: 'StackedBarChart',
  extends: Bar,
  mixins: [mixins.reactiveProp],
  props: ['chartData', 'options'],
  mounted() {
    this.renderChart(this.chartData, {
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [{
          stacked: true,
          ticks: {
            callback: (value) => Math.abs(value) // 表示はマイナス記号なしにする場合
          }
        }]
      }
    });
  }
}
</script>
