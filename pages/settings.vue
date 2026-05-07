<template>
  <div class="settings-page">
    <h2>一般</h2>
    <div class="setting-row" @click="color">
      <p>テーマ</p>
      <button>　色</button>
    </div>
    <div v-if="colorModal">
      <colorModal @closeColorModal="color" />
    </div>
  </div>
</template>

<script>
import colorModal from '~/components/_archive/colorModal.vue';
export default {
  name: 'Settings',
  components: {
    colorModal,
  },
  data() {
    return {
      colorModal: false,
    };
  },
  methods: {
    color() {
      this.colorModal = !this.colorModal;
    },
  }
}
</script>

<style scoped>
.settings-page {
  width: 100%;
  padding: 40px 20px;
  text-align: left;
  border: 1px solid black;
  margin-bottom: 30px;
}
.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  margin-left: -20px;
  margin-right: -20px;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
  background-color: rgba(157, 157, 157, 0.3);
}
button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #000000;
  border: none;
}
</style>
