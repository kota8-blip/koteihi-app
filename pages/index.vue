<template>
  <div>
    <div class="input-wrapper">
      <div class="yen-input-wrapper">
        <span class="yen-symbol">¥</span>
        <input
          type="text"
          ref="mainInput"
          inputmode="numeric"
          v-model="inputValue"
          @input="inputValue = inputValue.replace(/[^0-9]/g, '').replace(/^0+/, '')"
          @keyup.enter="saveAmount(inputValue)"
          style="text-align: right;"
        >
      </div>
      <div v-if="selectedType === '支出'">
        <div class="categoryChoice--expense">
          <select v-model="selectExpenseCategory">
            <option v-for="list in expensesLists" :key="list.id" :value="list.name">{{ list.name }}</option>
          </select>
        </div>
      </div>
      <div v-else>
        <div class="categoryChoice--income">
          <select v-model="selectIncomeCategory">
            <option v-for="list in incomeLists" :key="list.id" :value="list.name">{{ list.name }}</option>
          </select>
        </div>
      </div>
      <BaseButton
        :button-text="'保存'"
        :is-disabled="!inputValue"
        :bg-color="inputValue ? '#f0f0f0' : '#f0f0f0'"
        :text-color="inputValue ? '#000000' : '#d4cccc'"
        @click="saveAmount(inputValue)"
      />
      <div @click="showCalendar = !showCalendar" class="showCalendarButton">{{ selectedDate }}</div>
      <div v-if="showCalendar">カレンダー表示中</div>
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
      expensesLists: [
        { id: 1, name: '食事' },
        { id: 2, name: '交通' },
        { id: 3, name: '娯楽' },
        { id: 4, name: 'その他' },
      ],
      incomeLists: [
        { id: 1, name: '給料' },
        { id: 2, name: '副業' },
        { id: 3, name: 'その他' },
      ],
      selectExpenseCategory: '食事',
      selectIncomeCategory: '給料',
      showCalendar: false,
      selectedDate: '',
    }
  },
  computed: {
    selectedType() {
      return this.$store.getters.getSelectedType;
    }
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

    this.$store.commit('LOAD_FROM_STORAGE');
  },
  methods: {
    saveAmount(inputValue) {
      const amount = parseInt(inputValue);
      if (this.selectedType === '支出') {
        this.$store.commit('SET_EXPENSES', {
          date: this.selectedDate,
          category: this.selectExpenseCategory,
          amount
        });
      } else {
        this.$store.commit('SET_INCOME', {
          date: this.selectedDate,
          category: this.selectIncomeCategory,
          amount
        });
      }
      // this.$store.commit('SET_LIST_BOX', {
      //   date: this.selectedDate,
      //   category: this.selectedType === '支出' ? this.selectExpenseCategory : this.selectIncomeCategory,
      //   amount
      // });
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
.categoryChoice--income select {
  padding: 10px 20px;
  border: 1px solid #000000;
  border-radius: 4px;
  font-size: 35px;
  height: 100px;
  color: #000000;
  cursor: pointer;
}
.categoryChoice--expense select {
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
.custom-day {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
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
