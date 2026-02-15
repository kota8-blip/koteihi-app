<template>
  <div class="container">
    <div class="title" @click="routine">Routine Tracker</div>
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
  data() {
    return {
      message: 'Welcome to Routine Tracker!'
    }
  },
  computed: {
    rating() {
      const total = this.$store.state.routineList.length + this.$store.state.completedRoutineList.length;
      const completed = this.$store.state.completedRoutineList.length;
      return total === 0 ? 0 : Math.round((completed / total) * 100);
    }
  },
  methods: {
    routine() {
      window.location.reload();
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
}

.title {
  font-size: 32px;
  color: #333;
  margin-bottom: 16px;
  cursor: pointer;
  font-weight: bold;
  display: inline-block;
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
</style>
