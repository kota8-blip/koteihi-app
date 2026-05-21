<template>
  <div class="list-box">
    <ul>
      <div v-if="selectedType === '支出'">
        <div v-for="item in filteredExpensesBox" :key="item.id">
          {{ item.category }}: {{ item.amount }}円
          <button @click="deleteExpense(item.id)">削除</button>
          <button @click="editExpense(item.id)">編集</button>
        </div>
      </div>
      <div v-else-if="selectedType === '収入'">
        <div v-for="item in filteredIncomeBox" :key="item.id">
          {{ item.category }}: {{ item.amount }}円
          <button @click="deleteIncome(item.id)">削除</button>
          <button @click="editIncome(item.id)">編集</button>
        </div>
      </div>
    </ul>
    <div v-if="editModal" class="modal-overlay" @click.self="editModal = false">
      <div class="modal-wrapper">

        <button class="closeButton" @click="editModal = false">閉じる</button>
        <div class="modal-content">
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
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import BaseButton from '~/components/BaseButton.vue';
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';

export default {
  name: 'ListBox',
  components: {
    BaseButton
  },
  props: {
    date: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      editModal: false,
      inputValue: '',
      selectExpenseCategory: '',
      selectIncomeCategory: '',
      showCalendar: false,
      selectedDate: this.date,
      editingId: null,
      editingDate: null,
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
    };
  },
  computed: {
    ...mapState(['expenses','income']),
    filteredExpensesBox() {
      return Object.entries(this.$store.state.expenses)
        .filter(([date]) => date.startsWith(this.date))
        .flatMap(([date, items]) => items.map(item => ({ ...item, date })))
        .filter(item => item.amount);
    },
    filteredIncomeBox() {
      return Object.entries(this.$store.state.income)
        .filter(([date]) => date.startsWith(this.date))
        .flatMap(([date, items]) => items.map(item => ({ ...item, date })))
        .filter(item => item.amount);
    },
    selectedType() {
      return this.$store.getters.getSelectedType;
    }
  },
  watch: {
    editModal(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.mainInput.focus();
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
        });
      }
    }
  },
  methods: {
    deleteExpense(id) {
      this.$store.dispatch('deleteTransaction', id);
    },
    deleteIncome(id) {
      this.$store.dispatch('deleteTransaction', id);
    },
    editExpense(id) {
      this.editModal = true;
        const transaction = this.filteredExpensesBox.find(item => item.id === id);
        if (transaction) {
          this.editingId = id;
          this.editingDate = transaction.date;
          this.inputValue = transaction.amount.toString();
          this.selectExpenseCategory = transaction.category;
        }
      this.$store.dispatch('editTransaction', id);
    },
    editIncome(id) {
      this.editModal = true;
        const transaction = this.filteredIncomeBox.find(item => item.id === id);
        if (transaction) {
          this.editingId = id;
          this.editingDate = transaction.date;
          this.inputValue = transaction.amount.toString();
          this.selectIncomeCategory = transaction.category;
        }
      this.$store.dispatch('editTransaction', id);
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
    saveAmount(inputValue) {
      const amount = parseInt(inputValue);
      if (this.editingId) {
        this.$store.dispatch('editTransaction', {
          id: this.editingId,
          date: this.editingDate,
          category: this.selectedType === '支出' ? this.selectExpenseCategory : this.selectIncomeCategory,
          amount,
          type: this.selectedType
        });
        this.editingId = null;
        this.editingDate = null;
      } else if (this.selectedType === '支出') {
        this.$store.dispatch('addExpense', {
          date: this.selectedDate,
          category: this.selectExpenseCategory,
          amount,
          type: this.selectedType
        });
      } else {
        this.$store.dispatch('addIncome', {
          date: this.selectedDate,
          category: this.selectIncomeCategory,
          amount,
          type: this.selectedType
        });
      }
      this.keyboard.clearInput();
    }
  }
}
</script>

<style scoped>
.list-box {
  width: 800px;
  padding: 20px;
  font-size: 50px;
}
.list-box li {
  margin-bottom: 100px;
}
.modal-wrapper {
  position: relative;
  width: 80%;
  max-width: 1200px;
}
.closeButton {
  position: absolute;
  top: -50px;
  right: 0;
  background: transparent;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #fff;  /* 暗い背景の上なので白文字 */
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;  /* 画面中央 */
}

.modal-content {
  position: relative;
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  max-height: 90vh;
  overflow-y: auto;
}
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
