<template>
  <div class="page">
    <!-- タブ切替 -->
    <div class="tab-bar">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'trend' }"
        @click="activeTab = 'trend'"
      >月額の推移</button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'category' }"
        @click="activeTab = 'category'"
      >カテゴリ別</button>
    </div>

    <!-- 合計カード -->
    <div class="total-card">
      <div class="total-card-label">{{ activeTab === 'category' ? selectedMonthDisplay + 'の固定費合計' : '月の固定費合計' }}</div>
      <div class="total-card-amount">¥{{ (activeTab === 'category' ? selectedMonthTotal : totalAmount).toLocaleString() }}</div>
    </div>

    <div v-if="fixedCosts.length > 0">
      <!-- 月額の推移 -->
      <template v-if="activeTab === 'trend'">
        <div v-if="costHistory.length > 1" class="chart-area chart-area--line">
          <line-chart :chart-data="trendChartData" :options="trendChartOptions" />
        </div>
        <div v-else class="empty">データが1ヶ月分しかないため推移グラフを表示できません</div>
      </template>

      <!-- カテゴリ別ドーナツ -->
      <template v-else>
        <div class="chart-wrapper">
          <button class="month-nav-btn" :disabled="selectedMonthIndex <= 0" @click="prevMonth">←</button>
          <div class="chart-area">
            <doughnut-chart :chart-data="chartData" :options="chartOptions" />
          </div>
          <button class="month-nav-btn" :disabled="selectedMonthIndex >= availableMonths.length - 1" @click="nextMonth">→</button>
        </div>
        <div class="breakdown-list">
          <div v-for="(item, i) in selectedMonthCategoryTotals" :key="i" class="breakdown-row">
            <span class="breakdown-dot" :style="{ background: chartColors[i % chartColors.length] }" />
            <span class="breakdown-name">{{ item.category }}</span>
            <span class="breakdown-pct">{{ item.pct }}%</span>
            <span class="breakdown-amount">¥{{ item.amount.toLocaleString() }}</span>
          </div>
        </div>
      </template>
    </div>

    <div v-else class="empty">固定費がまだ登録されていません</div>

    <!-- 非プレミアム: アップグレードモーダル -->
    <div v-if="!isPremium" class="upgrade-overlay">
      <div class="upgrade-modal">
        <div class="upgrade-icon">🔒</div>
        <h3>プレミアムプランの機能です</h3>
        <p class="upgrade-desc">グラフ機能はプレミアムプランでご利用いただけます。</p>
        <button class="btn-upgrade" :disabled="upgradeLoading" @click="startUpgrade">
          {{ upgradeLoading ? '処理中...' : 'プランをアップグレード' }}
        </button>
        <button class="btn-close" @click="$router.go(-1)">閉じる</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Doughnut, Line } from 'vue-chartjs'

const DoughnutChart = {
  extends: Doughnut,
  props: ['chartData', 'options'],
  mounted() { this.renderChart(this.chartData, this.options) },
  watch: { chartData(val) { this.renderChart(val, this.options) } }
}

const LineChart = {
  extends: Line,
  props: ['chartData', 'options'],
  mounted() { this.renderChart(this.chartData, this.options) },
  watch: { chartData(val) { this.renderChart(val, this.options) } }
}

export default {
  name: 'GraphPage',
  middleware: 'auth',
  components: { DoughnutChart, LineChart },
  data() {
    return {
      activeTab: 'trend',
      costHistory: [],
      allCosts: [],
      selectedMonth: '',
      upgradeLoading: false,
      chartColors: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#66BB6A', '#EC407A',
        '#26C6DA', '#8D6E63',
      ],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        legend: { display: false },
        tooltips: {
          callbacks: {
            label(tooltipItem, data) {
              const val = data.datasets[0].data[tooltipItem.index]
              const label = data.labels[tooltipItem.index]
              return ` ${label}：¥${Number(val).toLocaleString()}`
            }
          }
        }
      },
      trendChartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        legend: { display: false },
        scales: {
          xAxes: [{ gridLines: { display: false } }],
          yAxes: [{
            ticks: {
              beginAtZero: false,
              callback: val => `¥${Number(val).toLocaleString()}`
            }
          }]
        },
        tooltips: {
          callbacks: {
            label(tooltipItem) {
              return ` ¥${Number(tooltipItem.yLabel).toLocaleString()}`
            }
          }
        }
      }
    }
  },
  computed: {
    fixedCosts() {
      return this.$store.state.fixedCosts
    },
    isPremium() {
      return this.$store.state.isPremium
    },
    totalAmount() {
      return this.fixedCosts.reduce((sum, item) => sum + Number(item.amount), 0)
    },
    availableMonths() {
      return this.costHistory.map(h => h.month)
    },
    selectedMonthIndex() {
      return this.availableMonths.indexOf(this.selectedMonth)
    },
    selectedMonthDisplay() {
      if (!this.selectedMonth) return ''
      const [y, m] = this.selectedMonth.split('-')
      return `${y}/${m}`
    },
    selectedMonthCosts() {
      return this.allCosts.filter(cost => {
        const created = cost.created_at ? cost.created_at.substring(0, 7) : null
        const deleted = cost.deleted_at ? cost.deleted_at.substring(0, 7) : null
        if (!created) return false
        return created <= this.selectedMonth && (deleted === null || deleted > this.selectedMonth)
      })
    },
    selectedMonthTotal() {
      return this.selectedMonthCosts.reduce((sum, item) => sum + Number(item.amount), 0)
    },
    selectedMonthCategoryTotals() {
      const map = {}
      this.selectedMonthCosts.forEach(item => {
        const cat = item.category || 'その他'
        map[cat] = (map[cat] || 0) + Number(item.amount)
      })
      const total = this.selectedMonthTotal || 1
      return Object.entries(map)
        .sort((a, b) => b[1] - a[1])
        .map(([category, amount]) => ({
          category,
          amount,
          pct: Math.round((amount / total) * 100)
        }))
    },
    chartData() {
      return {
        labels: this.selectedMonthCategoryTotals.map(i => i.category),
        datasets: [{
          data: this.selectedMonthCategoryTotals.map(i => i.amount),
          backgroundColor: this.selectedMonthCategoryTotals.map((_, i) => this.chartColors[i % this.chartColors.length]),
          borderWidth: 2,
          borderColor: '#fff',
        }]
      }
    },
    trendChartData() {
      return {
        labels: this.costHistory.map(h => {
          const [y, m] = h.month.split('-')
          return `${y}/${m}`
        }),
        datasets: [{
          label: '月額合計',
          data: this.costHistory.map(h => Number(h.total)),
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54,162,235,0.10)',
          pointBackgroundColor: '#36A2EB',
          pointRadius: 4,
          fill: true,
          tension: 0.3,
        }]
      }
    }
  },
  watch: {
    activeTab(val) {
      localStorage.setItem('graphActiveTab', val)
    }
  },
  async mounted() {
    const savedTab = localStorage.getItem('graphActiveTab')
    if (savedTab) this.activeTab = savedTab
    await this.$store.dispatch('loadFixedCosts')
    this.costHistory = await this.$store.dispatch('fetchCostHistory')
    const res = await this.$axios.get('/api/fixed-costs/history-detail')
    this.allCosts = res.data
    if (this.availableMonths.length > 0) {
      this.selectedMonth = this.availableMonths[this.availableMonths.length - 1]
    }
  },
  methods: {
    prevMonth() {
      if (this.selectedMonthIndex > 0) {
        this.selectedMonth = this.availableMonths[this.selectedMonthIndex - 1]
      }
    },
    nextMonth() {
      if (this.selectedMonthIndex < this.availableMonths.length - 1) {
        this.selectedMonth = this.availableMonths[this.selectedMonthIndex + 1]
      }
    },
    async startUpgrade() {
      this.upgradeLoading = true
      try {
        const res = await this.$axios.post('/api/create-checkout-session')
        window.location.href = res.data.url
      } catch (err) {
        alert('エラーが発生しました。もう一度お試しください。')
        this.upgradeLoading = false
      }
    },
  }
}
</script>

<style scoped>
.page {
  padding: 20px 16px 136px;
  max-width: 800px;
  margin: 0 auto;
  box-sizing: border-box;
}

/* タブ */
.tab-bar {
  display: flex;
  background: #f2f2f7;
  border-radius: 10px;
  padding: 3px;
  margin-bottom: 20px;
}
.tab-btn {
  flex: 1;
  padding: 8px 0;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  color: #888;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
}
.tab-btn.active {
  background: #fff;
  color: #222;
  font-weight: 700;
  box-shadow: 0 1px 4px rgba(0,0,0,0.10);
}

/* 合計カード */
.total-card {
  background: #f8f8f8;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.total-card-label {
  font-size: 14px;
  color: #888;
  font-weight: 500;
}
.total-card-amount {
  font-size: 28px;
  font-weight: bold;
  color: #222;
}

/* グラフ + 月ナビ wrapper */
.chart-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}
.month-nav-btn {
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  color: #000;
  line-height: 1;
}
.month-nav-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}
/* グラフ */
.chart-area {
  max-width: 260px;
  width: 100%;
  flex-shrink: 1;
}
.chart-area--line {
  max-width: 100%;
  margin-bottom: 20px;
}

/* 内訳リスト（共通） */
.breakdown-list {
  border-top: 1px solid #f0f0f0;
}
.breakdown-row {
  display: flex;
  align-items: center;
  padding: 14px 4px;
  border-bottom: 1px solid #f0f0f0;
  gap: 10px;
}

/* カテゴリ別 */
.breakdown-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}
.breakdown-name {
  flex: 1;
  font-size: 15px;
  color: #222;
}
.breakdown-pct {
  font-size: 13px;
  color: #aaa;
  width: 40px;
  text-align: right;
}
.breakdown-amount {
  font-size: 16px;
  font-weight: 600;
  color: #222;
  width: 100px;
  text-align: right;
  flex-shrink: 0;
}

.empty {
  text-align: center;
  color: #aaa;
  padding: 60px 0;
}

/* アップグレードモーダル */
.upgrade-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}
.upgrade-modal {
  background: #fff;
  border-radius: 16px;
  padding: 36px 28px;
  max-width: 320px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}
.upgrade-icon {
  font-size: 40px;
  margin-bottom: 12px;
}
.upgrade-modal h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 10px;
  color: #111;
}
.upgrade-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 24px;
  line-height: 1.6;
}
.btn-upgrade {
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}
.btn-upgrade:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-close {
  background: none;
  border: none;
  color: #aaa;
  font-size: 14px;
  margin-top: 12px;
  cursor: pointer;
  width: 100%;
}
</style>
