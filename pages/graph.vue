<template>
  <div>
    <div class="container">
      <div class="completed-rating">
        <p>家計簿:{{ "日付" }}</p>
      </div>
      <button class="visibility-toggle" @click="toggle">{{ isVisible ? '非表示' : '表示' }}</button>
      <div v-if="isVisible">
        <div class="routine-list-containers">
          <div class="chart-wrapper">
            <GraphBox />
            <VariousTotalBudgetBox />
          </div>
        </div>
      </div>
    </div>
    <div v-if="isVisible">
      <div class="list-box-wrapper">
        <ListBox />
      </div>
    </div>
  </div>
</template>

<script>
import GraphBox from '../components/graphBox.vue';
import VariousTotalBudgetBox from '../components/variousTotalBudgetBox.vue';
import ListBox from '../components/listBox.vue';

export default {
  name: 'Graph',
  components: {
    GraphBox,
    VariousTotalBudgetBox,
    ListBox
  },
  data() {
    return {
      isVisible: true
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    saveRate() {
      // 今日の日付を取得
      const today = new Date().toISOString().split('T')[0];
      // 保存するデータ
      const rateData = {
        date: today,
      }
      // 既存のデータを取得（あれば）
      const savedData = JSON.parse(localStorage.getItem('dailyRates') || '{}');
      // 今日の達成率を追加
      savedData[today] = rateData.rate
      // 保存
      localStorage.setItem('dailyRates', JSON.stringify(savedData))
    },
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
  padding: 40px 20px;
  text-align: center;
  border: 1px solid black;
}
.completed-rating {
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
