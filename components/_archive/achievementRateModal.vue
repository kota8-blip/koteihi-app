<template>
  <div>
    <div class="overlay" />
    <div class="achievement-modal">
      <h1>達成率</h1>
      <button @click="$emit('closeAchievementRateModal')" class="closeAchievementRate">Close</button>
      <p v-for="percentage in percentages" :key="percentage" @click="dayCategory(percentage)" class="colorDetaile" :class="{ highlight: $store.state.achievementRate === percentage }">
        <span>{{ percentage }}%</span>
        <span>{{ $store.state.achievementRate === percentage ? '✔' : '' }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AchievementRateModal',
  data() {
    return {
      percentages: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    }
  },
  methods: {
    changeColor(color) {
      this.$emit('changeColor', color);
    },
    dayCategory(percentage) {
      this.$store.commit('SET_ACHIEVEMENT_RATE', percentage);
    }
  }
}
</script>

<style scoped>
.achievement-modal {
  position: fixed;
  top: 10%;
  width: 98%;
  height: 90%;
  overflow-y: auto;
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  z-index: 1000;
}
h1 {
  margin-bottom: 20px;
  text-align: center;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明の黒 */
  z-index: 999; /* モーダルより1つ下 */
}
.closeAchievementRate {
  cursor: pointer;
}
.colorDetaile {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  padding: 10px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;;
  margin-left: -20px;
  margin-right: -20px;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 10px;
}
.highlight {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  padding: 10px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;;
  margin-left: -20px;
  margin-right: -20px;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: rgba(157, 157, 157, 0.3);
}
</style>
