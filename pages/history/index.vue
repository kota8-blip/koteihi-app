<template>
  <div class="history-page">
    <v-calendar>
      <template v-slot:day-content="{ day }">
        <div class="custom-day" :style="getDayStyle(day)">
          <span class="day-number" @click="openRateModal(day)">{{ day.day }}</span>
          <div v-if="getRate(day)" class="day-data">
            {{ getRate(day) }}%
          </div>
        </div>
      </template>
    </v-calendar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dailyRatesData: {} // localStorageから読み込んだデータを保持
    }
  },
  computed: {
    cheatDay() {
      return this.$store.state.cheatDay;
    },
    achievementRate() {
      return this.$store.state.achievementRate;
    }
  },
  mounted() {
    // localStorageからデータを読み込む
    const savedData = JSON.parse(localStorage.getItem('dailyRates') || '{}');
    this.dailyRatesData = savedData;
  },
  methods: {
    getRate(day) {
      const dateStr = `${day.year}-${String(day.month).padStart(2,'0')}-${String(day.day).padStart(2,'0')}`;
      const entry = this.dailyRatesData[dateStr];
      if (!entry) return null;
      // 新形式 { rate, routineList, completedRoutineList }
      return typeof entry === 'object' ? entry.rate : entry;
    },
    getDayStyle(day) {
      if (this.cheatDay.includes(day.weekday)) {
        return { backgroundColor: 'rgba(128, 128, 128, 0.3)' }; // チートデイは灰色
      }
      const rate = this.getRate(day);
      if (this.achievementRate !== null) {
        if (rate === null) return {};
        if (rate >= this.achievementRate) return { backgroundColor: 'rgba(0, 128, 0, 0.3)' };
        else if (rate < this.achievementRate) return { backgroundColor: 'rgba(255, 0, 0, 0.3)' };
      }
      else {
        if (rate === null) return {};
        if (rate >= 80) return { backgroundColor: 'rgba(0, 128, 0, 0.3)' };
        if (rate >= 50) return { backgroundColor: 'rgba(255, 165, 0, 0.3)' };
        if (rate > 0) return { backgroundColor: 'rgba(255, 0, 0, 0.3)' };
        return {};
      }
    },
    openRateModal(day) {
      const rate = this.getRate(day);
      if (rate !== null) {
        this.$router.push(`/history/${day.year}-${String(day.month).padStart(2,'0')}-${String(day.day).padStart(2,'0')}`);
      } else {
        alert(`日付: ${day.year}-${day.month}-${day.day}\n達成率のデータがありません。`);
      }
    }
  }
}
</script>

<style>
  .history-page {
    display: flex;
    justify-content: center;
  }
  .vc-container {
    width: 90%;
    max-width: 1250px;
    min-width: 320px;
    height: 60vh;
    max-height: 800px;
    min-height: 250px;
    margin-bottom: 50px;
    overflow: hidden;
  }
  .vc-weeks {
    height: 100%;
    border: 1px solid #141414;
  }
  .vc-weekday {
    height: 100%;
    border: 1px solid #141414;
  }
  .vc-day-box-center-center[data-v-4420d078] {
    border: 1px solid #141414;
    align-items: baseline;
  }
  .custom-day {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
    width: 100%;
    height: 100%;
  }
  .day-number {
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
  .day-data {
    font-size: 14px;
    color: #333;
    margin-top: 5px;
  }
  /* .vc-dots[data-v-4420d078] {
    width: 10px;
  } */
  .vc-bars[data-v-4420d078] {
    width: 0;
    height: 0;
  }
  .achievement-rate {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-top: 5px;
  }
</style>
