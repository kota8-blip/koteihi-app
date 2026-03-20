<template>
  <div>
    <div class="overlay" />
    <div class="color-modal">
      <h1>Color</h1>
      <button @click="$emit('closeColorModal')">Close</button>
      <p v-for="color in colors" :key="color.name" @click="changeColor(color.code)" class="colorDetaile" :class="color.class">
        <span>{{ color.name }}</span>
        <span>{{ color.code === $store.state.currentColor ? '✔' : '' }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColorModal',
  data() {
    return {
      colors: [
        { name: 'Red', code: '#f4a8a8', class: 'red' }, { name: 'Green', code: '#a8dfa0', class: 'green' }, { name: 'Blue', code: '#a0d4db', class: 'blue' }, { name: 'Yellow', code: '#e8eb9f', class: 'yellow' }, { name: 'Purple', code: '#cfa0d8', class: 'purple' }, { name: 'White', code: '#ffffff', class: 'white' }, { name: 'Black', code: '#000000', class: 'black' }
      ],
    }
  },
  methods: {
    changeColor(color) {
      this.$store.commit('SET_CURRENT_COLOR', color);
    },
    dayCategory(day) {
      this.$emit('dayCategory', day);
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
.colorDetaile.red    { background-color: #f4a8a8; }
.colorDetaile.green  { background-color: #a8dfa0; }
.colorDetaile.blue   { background-color: #a0d4db; }
.colorDetaile.yellow { background-color: #e8eb9f; }
.colorDetaile.purple { background-color: #cfa0d8; }
.colorDetaile.white  { background-color: #ffffff; }
.colorDetaile.black  { background-color: #000000; color: white;
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
button {
  cursor: pointer;
}
</style>
