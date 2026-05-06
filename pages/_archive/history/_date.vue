<template>
  <div class="container">
    <div class="completed-rating">
      <h2>{{ date }}</h2>
      <p>達成率: {{ snapshotRate }}%</p>
    </div>
    <div class="routine-list-containers">
      <div class="routine-list-box-container">
        <h2>未実施</h2>
        <div class="routine-item-wrapper" v-for="item in snapshotRoutineList" :key="item.id">{{ item.name }}</div>
      </div>
      <div class="routine-list-box-container">
        <h2>完了</h2>
        <div class="completed-routine-item-wrapper" v-for="item in snapshotCompletedRoutineList" :key="item.id">{{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryDatePage',
  data() {
    return {
      snapshotRoutineList: [],
      snapshotCompletedRoutineList: [],
      snapshotRate: 0,
      date: ''
    }
  },
  mounted() {
    const date = this.$route.params.date; // URLから日付を取得
    const savedData = JSON.parse(localStorage.getItem('dailyRates') || '{}');
    const entry = savedData[date];
    if (entry) {
      this.snapshotRoutineList = entry.routineList || [];
      this.snapshotCompletedRoutineList = entry.completedRoutineList || [];
      this.snapshotRate = entry.rate || 0;
    }
  },
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
.routine-item-wrapper {
  font-size: 20px;
  color: #444;
  margin-bottom: 12px;
  max-width: 600px;
  margin-top: 20px;
  padding: 40px 20px;
  border: 1px solid black;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.completed-routine-item-wrapper {
  font-size: 20px;
  color: #444;
  margin-bottom: 12px;
  max-width: 600px;
  margin-top: 20px;
  padding: 40px 20px;
  border: 1px solid black;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: line-through;
  opacity: 0.6;
  color: #888;
}
.routine-list-box-container {
  width: 100%;
  padding: 40px 20px;
  text-align: center;
  border: 1px solid black;
}
</style>
