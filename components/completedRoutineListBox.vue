<template>
  <div class="container">
    <h2>完了</h2>
    <div class="routine-lists" v-for="list in completedLists" :key="list.id" @click="routineList(list.id)">
      <span class="completed-text">{{ list.name }}</span>
      <p @click.stop="deleteRoutineList(list.id)">×</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompletedRoutineListBox',
  computed: {
    completedLists() {
      return this.$store.state.completedRoutineList;
    }
  },
  methods: {
      routineList(id) {
        const clickedList = this.completedLists.find(list => list.id === id);
        if (clickedList) {
          this.$store.commit('ADD_TO_ROUTINE', clickedList);
          this.$store.commit('REMOVE_FROM_COMPLETED', id);
        }
      },
    deleteRoutineList(id) {
      this.$store.commit('REMOVE_FROM_COMPLETED', id);
    },
  },
}
</script>

<style scoped>
.container {
  width: 100%;
  /* margin-top: 20px; */
  padding: 40px 20px;
  text-align: center;
  border: 1px solid black;
}
.container h2 {
  font-size: 24px;
  color: black;
  margin-top: 0;
}
.routine-lists {
  font-size: 20px;
  color: #444;
  margin-bottom: 12px;
  max-width: 600px;
  margin-top: 20px;
  padding: 40px 20px;
  border: 1px solid black;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.completed-text {
  text-decoration: line-through;
  opacity: 0.6;
  color: #888;
}
.routine-lists p {
  font-size: 20px;
  color: #888;
  cursor: pointer;
  margin-top: 0;
  text-align: right;
}
.container p {
  font-size: 24px;
  color: #888;
  cursor: pointer;
  text-align: left;
  width: 20px;
}
</style>
