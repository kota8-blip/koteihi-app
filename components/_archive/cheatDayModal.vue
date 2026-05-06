<template>
  <div>
    <div class="overlay" />
    <div class="cheat-day-modal">
      <h1>チートDAY</h1>
      <button @click="$emit('closeCheatDayModal')" class="closeCheatDayModal">Close</button>
      <p v-for="day in days" :key="day" @click="dayCategory(day)" class="colorDetaile" :class="{ highlight: $store.state.cheatDay.includes(day.weekday) }">
        <span>{{ day.name }}</span>
        <span>{{ $store.state.cheatDay.includes(day.weekday) ? '✔' : '' }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheatDayModal',
  data() {
    return {
      days: [
        { name: '月曜', weekday: 1 },
        { name: '火曜', weekday: 2 },
        { name: '水曜', weekday: 3 },
        { name: '木曜', weekday: 4 },
        { name: '金曜', weekday: 5 },
        { name: '土曜', weekday: 6 },
        { name: '日曜', weekday: 7 }
      ]
    }
  },
  methods: {
    changeColor(color) {
      this.$emit('changeColor', color);
    },
    dayCategory(day) {
      this.$store.commit('SET_CHEAT_DAY', day.weekday);
    }
  }
}
</script>

<style scoped>
.color-modal {
  position: fixed;
  top: 10%;
  width: 98%;
  height: 90%;
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  z-index: 1000;
}
h1 {
  margin-bottom: 20px;
  text-align: center;
}
.cheat-day-modal {
  position: fixed;
  top: 10%;
  width: 98%;
  height: 90%;
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  z-index: 1000;
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
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明の黒 */
  z-index: 999; /* モーダルより1つ下 */
}
.closeCheatDayModal {
  cursor: pointer;
}
</style>
