<template>
  <div class="container">
    <h2>未実施</h2>
    <draggable v-model="draggableLists" @end="onDragEnd" :options="{handle: '.move-button'}">
      <div class="routine-item-wrapper" v-for="list in lists" :key="list.id">
        <div class="move-button">∴</div>
        <div class="routine-lists" @click="routineList(list.id)">
          {{ list.name }}
          <p @click.stop="deleteRoutineList(list.id)">×</p>
        </div>
      </div>
    </draggable>
    <div>
      <p @click="addRoutineList">+</p>
      <input type="text" v-if="addListMocdal" class="inputAddListModal" v-model="add" @keyup.enter="addNewRoutineList" ref="inputAddList" @blur="closeModal">
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'RoutineListBox',
  components: {
    draggable
  },
  data() {
    return {
      add: '',
      // lists: [
      //   { id: 1, name: 'Morning Routine' },
      // ],
      addListMocdal: false
    };
  },
  computed: {
    lists() {
      return this.$store.state.routineList;
    },
    draggableLists: {
      get() {
        return this.$store.state.routineList;
      },
      set(value) {
        this.$store.commit('UPDATE_ROUTINE_LIST', value);
      }
    }
  },
  methods: {
    onDragEnd() {
      // ドラッグ終了時の処理（必要に応じて追加）
    },
    routineList(id) {
      const clickedList = this.lists.find(list => list.id === id);
      if (clickedList) {
        this.$store.commit('ADD_TO_COMPLETED', clickedList);
        this.$store.commit('REMOVE_FROM_ROUTINE', id);
      }
    },
    deleteRoutineList(id) {
      this.$store.commit('REMOVE_FROM_ROUTINE', id);
    },
    addRoutineList() {
      this.addListMocdal = !this.addListMocdal
      if (this.addListMocdal) {
        this.$nextTick(() => {
          this.$refs.inputAddList.focus();
        });
      }
    },
    addNewRoutineList() {
      if (this.add.trim() !== '') {
        this.$store.commit('ADD_TO_ROUTINE', { id: Date.now(), name: this.add });
        this.add = '';
        this.addListMocdal = false;
      }
    },
    closeModal() {
      if (this.add.trim() !== '') {
        this.$store.commit('ADD_TO_ROUTINE', { id: Date.now(), name: this.add });
        this.add = '';
      }
      this.addListMocdal = false;
    }
  }
}
</script>
<style scoped>
.container {
  width: 100%;
  padding: 40px 20px;
  text-align: center;
  border: 1px solid #b9b6b6;
}
.container h2 {
  font-size: 24px;
  color: #888;
  margin-top: 0;
}
.routine-item-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
}
.move-button {
  font-size: 30px;
  color: #888;
  cursor: pointer;
  margin-right: 10px;
  flex-shrink: 0;
}
.routine-lists {
  font-size: 20px;
  color: #444;
  margin-bottom: 12px;
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
  padding: 40px 20px;
  border: 1px solid #b9b6b6;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
.inputAddListModal {
  margin-top: 20px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: left;
  display: block;
  margin-left: 0;
}
</style>
