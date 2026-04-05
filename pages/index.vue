<template>
  <div>
    <div class="input-wrapper">
      <div class="button-group">
        <div v-for="item in items" :key="item.id">
          <BaseButton :button-text="item.name" />
        </div>
      </div>
      <div class="yen-input-wrapper">
        <span class="yen-symbol">¥</span>
        <input
          type="text"
          ref="mainInput"
          inputmode="numeric"
          v-model="inputValue"
          @input="inputValue = inputValue.replace(/[^0-9]/g, '').replace(/^0+/, '')"
        >
      </div>
      <div class="categoryChoice">
        <select v-model="selectCategory">
          <option v-for="list in lists" :key="list.id" :value="list.name">{{ list.name }}</option>
        </select>
      </div>
      <BaseButton :button-text="'保存'" :is-disabled="!inputValue" @click="saveAmount(inputValue)" />
    </div>
  </div>
</template>

<script>
import BaseButton from '~/components/BaseButton.vue';

export default {
  name: 'IndexPage',
  components: {
    BaseButton
  },
  data() {
    return {
      isVisible: true,
      inputValue: '',
      items: [
        { id: 1, name: '支出' },
        { id: 2, name: '収入' },
      ],
      lists: [
        { id: 1, name: '食事' },
        { id: 2, name: '交通' },
        { id: 3, name: '娯楽' },
        { id: 4, name: 'その他' },
      ],
      selectCategory: '食事',
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    this.$refs.mainInput.focus();
  },
  methods: {
    saveAmount(inputValue) {
      const amount = parseInt(inputValue);
      const current = this.$store.state.listBox.find(item => item.id === this.selectCategoryId)?.item.amount || 0;
      console.log('保存する金額:', amount);
      if (this.selectCategory === '食事') {
        this.$store.commit('SET_lIST_BOX', { id: 1, amount: current + amount });
      } else if (this.selectCategory === '交通') {
        this.$store.commit('SET_lIST_BOX', { id: 2, amount: current + amount });
      } else if (this.selectCategory === '娯楽') {
        this.$store.commit('SET_lIST_BOX', { id: 3, amount: current + amount });
      } else if (this.selectCategory === 'その他') {
        this.$store.commit('SET_lIST_BOX', { id: 4, amount: current + amount });
      }
      this.inputValue = ""
    }
  },
}
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  color: #ccc;
}
.button-group {
  display: flex;
  gap: 20px;
}
.main-input {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.yen-input-wrapper {
  display: inline-flex;
  align-items: center;
  border: 1px solid #000000;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 16px;
}
.yen-symbol {
  font-size: 16px;
  color: #000000;
}
.yen-input-wrapper input {
  width: 300px;
  padding: 10px 10px 10px 4px;
  font-size: 16px;
  border: none;
  outline: none;
}
.yen-input-wrapper:focus-within {
  border-color: #3b8070;
  box-shadow: 0 0 5px rgba(59, 128, 112, 0.5);
}
</style>
