<template>
  <div class="container">
    <div class="completed-rating">
      <p>達成率:{{ rating }}%</p>
    </div>
    <div class="routine-list-containers">
      <RoutineListBox />
      <CompletedRoutineListBox />
    </div>
  </div>
</template>

<script>
import RoutineListBox from '../components/routineListBox.vue';
import CompletedRoutineListBox from '../components/completedRoutineListBox.vue';

export default {
  name: 'IndexPage',
  components: {
    RoutineListBox,
    CompletedRoutineListBox
  },
  // data() {
  //   return {
  //     // message: 'Welcome to Routine Tracker!'
  //   }
  // },
  computed: {
    rating() {
      const total = this.$store.state.routineList.length + this.$store.state.completedRoutineList.length;
      const completed = this.$store.state.completedRoutineList.length;
      return total === 0 ? 0 : Math.round((completed / total) * 100);
    }
  },
  watch: {
    rating(newRate) {
      const d = new Date();
      const today = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const savedData = JSON.parse(localStorage.getItem('dailyRates') || '{}');
      savedData[today] = {
        rate: newRate,
        routineList: [...this.$store.state.routineList],
        completedRoutineList: [...this.$store.state.completedRoutineList]
      };
      localStorage.setItem('dailyRates', JSON.stringify(savedData))
    }
  },
  methods: {
    saveRate() {
      // 今日の日付を取得
      const today = new Date().toISOString().split('T')[0];
      // 保存するデータ
      const rateData = {
        date: today,
        rate: this.rating
      }
      // 既存のデータを取得（あれば）
      const savedData = JSON.parse(localStorage.getItem('dailyRates') || '{}');
      // 今日の達成率を追加
      savedData[today] = rateData.rate
      // 保存
      localStorage.setItem('dailyRates', JSON.stringify(savedData))
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
  border: 1px solid black;
}

/* .title {
  font-size: 32px;
  color: #333;
  margin-bottom: 16px;
  cursor: pointer;
  font-weight: bold;
  display: inline-block;
} */

.completed-rating {
  font-size: 18px;
  color: black;
  margin-bottom: 20px;
  text-align: right;
}

.routine-list-containers {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 20px;
}
.routine-list-containers > *:first-child {
  flex: 2; /* routineListBox を2の比率 */
}

.routine-list-containers > *:last-child {
  flex: 1; /* completedRoutineListBox を1の比率 */
}
</style>
