<template>
  <div class="calendar-page">
    <v-calendar>
      <template v-slot:day-content="{ day }">
        <div class="day-cell" @click="openRateModal(day)">
          <span class="day-number">{{ day.day }}</span>
          <div v-if="selectedType === '支出'" class="day-data">
            {{ getExpenses(day) }}円
          </div>
          <div v-else-if="selectedType === '収入'" class="day-data">
            {{ getIncome(day) }}円
          </div>
          <div v-else class="day-data">
            {{ getIncome(day) !== null && getExpenses(day) !== null ? (getIncome(day) - getExpenses(day)) + '円' : '' }}
          </div>
        </div>
      </template>
    </v-calendar>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CalendarPage',
  data() {
    return {
      isVisible: true,
    }
  },
  computed: {
    ...mapState(['expenses', 'income']),
    selectedType() {
      return this.$store.getters.getSelectedType;
    },
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    openRateModal(day) {
        this.$router.push(`/calendar/${day.year}-${String(day.month).padStart(2,'0')}-${String(day.day).padStart(2,'0')}`);
    },
    getExpenses(day) {
      const dateStr = `${day.year}-${String(day.month).padStart(2,'0')}-${String(day.day).padStart(2,'0')}`;
      const dayExpenses = (this.expenses[dateStr] || []).reduce((sum, item) => sum + (item.amount || 0), 0);
      return dayExpenses !== 0 ? dayExpenses : null;
    },
    getIncome(day) {
      const dateStr = `${day.year}-${String(day.month).padStart(2,'0')}-${String(day.day).padStart(2,'0')}`;
      const dayIncome = (this.income[dateStr] || []).reduce((sum, item) => sum + (item.amount || 0), 0);
      return dayIncome !== 0 ? dayIncome : null;
    },
  }
}
</script>

<style scoped>
  .calendar-page {
    display: flex;
    justify-content: center;
  }
  /* カレンダー全体のサイズ */
::v-deep .vc-container {
  width: 90%;
  height: 70vh;
}
::v-deep .vc-arrow svg {
  width: 40px;
  height: 40px;
  color: #333;
}
/* 曜日ヘッダー（月〜日） */
::v-deep .vc-weekday {
  font-size: 40px;
  font-weight: bold;
  padding: 100px 100px;
}
/* 日付セル全体 */
::v-deep .vc-day {
  min-height: 80px;
  border: 1px solid #ddd;
}
.day-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: space-between;
  cursor: pointer;
}
/* 日付の数字 */
.day-number {
  font-size: 40px;
  font-weight: bold;
  padding: 10px;
}
.day-data {
    font-size: 30px;
    color: #333;
    margin-top: 5px;
  }
/* 月のヘッダー（「April 2026」部分） */
::v-deep .vc-title {
  font-size: 40px;
}
/* 前月・次月の矢印ボタン */
::v-deep .vc-arrow {
  width: 40px;
  height: 40px;
}
::v-deep .vc-day {
  padding: 25px;
}
</style>
