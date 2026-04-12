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
          @keyup.enter="saveAmount(inputValue)"
        >
      </div>
      <div class="categoryChoice">
        <select v-model="selectCategory">
          <option v-for="list in lists" :key="list.id" :value="list.name">{{ list.name }}</option>
        </select>
      </div>
      <BaseButton :button-text="'保存'" :is-disabled="!inputValue" @click="saveAmount(inputValue)" />
      <div @click="showCalendar = !showCalendar" class="showCalendarButton">{{ selectedDate }}</div>
      <v-calendar v-if="showCalendar">
        <template v-slot:day-content="{ day }">
          <div class="custom-day">
            <span class="day-number" @click="onDayClick(day)">{{ day.day }}</span>
          </div>
        </template>
      </v-calendar>
      <div class="simple-keyboard" />
    </div>
  </div>
</template>

<script>
import BaseButton from '~/components/BaseButton.vue';
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';

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
      showCalendar: false,
      selectedDate: '',
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    this.$refs.mainInput.focus();
    this.selectedDate = `${this.day().year}-${String(this.day().month).padStart(2,'0')}-${String(this.day().day).padStart(2,'0')}`;
    this.keyboard = new Keyboard({
      onChange: input => {
        this.inputValue = input.replace(/[^0-9]/g, '').replace(/^0+/, '');
      },
      onKeyPress: button => {
        if (button === '{enter}') {
          this.saveAmount(this.inputValue);
          this.keyboard.clearInput();
        }
      },
      layout: {
        default: ['1 2 3', '4 5 6', '7 8 9', '{bksp} 0 {enter}']
      }
    });
  },
  methods: {
    saveAmount(inputValue) {
      const amount = parseInt(inputValue);
      this.$store.commit('SET_LIST_BOX', {
        date: this.selectedDate,
        category: this.selectCategory,
        amount
      });
      this.inputValue = "";
      this.keyboard.clearInput();
    },
    onDayClick(day) {
      this.selectedDate = `${day.year}-${String(day.month).padStart(2,'0')}-${String(day.day).padStart(2,'0')}`;
      this.showCalendar = false;
    },
    day() {
      const today = new Date();
      return {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
      };
    },
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
  font-size: 50px;
  height: 150px;
  width: 1000px;
}
.yen-symbol {
  font-size: 50px;
  color: #000000;
}
.yen-input-wrapper input {
  width: 1000px;
  height: 100%;
  padding: 10px 10px 10px 4px;
  font-size: 50px;
  border: none;
  outline: none;
  text-align: right;
}
.yen-input-wrapper:focus-within {
  border-color: #3b8070;
  box-shadow: 0 0 5px rgba(59, 128, 112, 0.5);
}
.categoryChoice select {
  padding: 10px 20px;
  border: 1px solid #000000;
  border-radius: 4px;
  font-size: 35px;
  height: 100px;
  color: #000000;
  cursor: pointer;
}
.showCalendarButton {
  padding: 0 20px;
  border: 1px solid #000000;
  border-radius: 4px;
  cursor: pointer;
  color: #000000;
  font-size: 35px;
  height: 100px;
  display: flex;
  align-items: center;
}
.day-number {
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
::v-deep .simple-keyboard {
  margin-top: 20px;
  color: #000000;
}
::v-deep .hg-theme-default {
  width: 50%;
}
::v-deep .hg-theme-default .hg-button {
  height: 70px;
  font-size: 24px;
}
</style>
