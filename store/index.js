import Vue from 'vue';

export const state = () => ({
  selectedType: '支出',
  routineList: [],
  completedRoutineList: [],
  currentColor: '#a0bad8',
  cheatDay: [],
  achievementRate: null,
  income: {
    '2026-04-09': [],
  },
  expenses: {
    '2026-04-09': [],
  }
})

export const getters = {
  getSelectedType(state) {
    return state.selectedType;
  },
  getExpenses(state) {
    return Object.values(state.expenses || {}).flat().reduce((total, item) => total + (item.amount || 0), 0);
  },
  getIncome(state) {
    return Object.values(state.income || {}).flat().reduce((total, item) => total + (item.amount || 0), 0);
  },
  getRoutineList(state) {
    return state.routineList;
  },
  getCompletedLists(state) {
    return state.completedRoutineList;
  },
  getCurrentColor(state) {
    return state.currentColor;
  },
  getCheatDay(state) {
    return state.cheatDay;
  },
  getAchievementRate(state) {
    return state.achievementRate;
  },
  getHobby(state) {
    return state.hobby;
  }
}

export const mutations = {
  // localStorageから読み込む
  LOAD_FROM_STORAGE(state) {
    if (process.client) {
      const routineList = localStorage.getItem('routineList');
      const completedRoutineList = localStorage.getItem('completedRoutineList');

      if (routineList) {
        state.routineList = JSON.parse(routineList);
      }
      if (completedRoutineList) {
        state.completedRoutineList = JSON.parse(completedRoutineList);
      }

      const currentColor = localStorage.getItem('currentColor');
      if (currentColor) {
        state.currentColor = currentColor;
      }

      const cheatDay = localStorage.getItem('cheatDay');
      if (cheatDay) {
        state.cheatDay = JSON.parse(cheatDay);
      }

      const achievementRate = localStorage.getItem('achievementRate');
      if (achievementRate) {
        state.achievementRate = JSON.parse(achievementRate);
      }

      const expenses = localStorage.getItem('expenses');
      if (expenses) {
        state.expenses = JSON.parse(expenses);
      }

      const income = localStorage.getItem('income');
      if (income) {
        state.income = JSON.parse(income);
      }

      // 日付チェックとリセット処理
      const lastResetDate = localStorage.getItem('lastResetDate');
      const d = new Date();
      const today = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

      if (lastResetDate !== today) {
        // completedRoutineListの全アイテムをroutineListに戻す
        state.routineList = [...state.routineList, ...state.completedRoutineList];
        // completedRoutineListを空にする
        state.completedRoutineList = [];
        // lastResetDateを更新
        localStorage.setItem('lastResetDate', today);
        // 保存
        this.commit('SAVE_TO_STORAGE');
      }

      if (state.expenses) {
        for (const date in state.expenses) {
          state.expenses[date] = state.expenses[date].filter(item => item.amount > 0);
        }
      }

      if (state.income) {
        for (const date in state.income) {
          state.income[date] = state.income[date].filter(item => item.amount > 0);
        }
      }
    }
  },
  SET_SELECTED_TYPE(state, type) {
    state.selectedType = type;
    if (process.client) {
      localStorage.setItem('selectedType', type);
    }
  },
  SET_CURRENT_COLOR(state, color) {
    state.currentColor = color;
    if (process.client) {
      localStorage.setItem('currentColor', color);
    }
  },
  // localStorageに保存するヘルパー
  SAVE_TO_STORAGE(state) {
    if (process.client) {
      localStorage.setItem('routineList', JSON.stringify(state.routineList));
      localStorage.setItem('completedRoutineList', JSON.stringify(state.completedRoutineList));
      localStorage.setItem('currentColor', state.currentColor);
      localStorage.setItem('cheatDay', JSON.stringify(state.cheatDay));
      localStorage.setItem('achievementRate', JSON.stringify(state.achievementRate));
      localStorage.setItem('expenses', JSON.stringify(state.expenses));
      localStorage.setItem('income', JSON.stringify(state.income));
      localStorage.setItem('selectedType', state.selectedType);
    }
  },

  ADD_TO_ROUTINE(state, payload) {
    state.routineList.push(payload);
    this.commit('SAVE_TO_STORAGE');
  },
  ADD_TO_COMPLETED(state, payload) {
    state.completedRoutineList.push(payload);
    this.commit('SAVE_TO_STORAGE');
  },
  REMOVE_FROM_ROUTINE(state, payload) {
    state.routineList = state.routineList.filter(list => list.id !== payload);
    this.commit('SAVE_TO_STORAGE');
  },
  REMOVE_FROM_COMPLETED(state, payload) {
    state.completedRoutineList = state.completedRoutineList.filter(list => list.id !== payload);
    this.commit('SAVE_TO_STORAGE');
  },
  UPDATE_ROUTINE_LIST(state, payload) {
    state.routineList = payload;
    this.commit('SAVE_TO_STORAGE');
  },
  SET_CHEAT_DAY(state, payload) {
    const index = state.cheatDay.indexOf(payload);
    if (index === -1) {
      state.cheatDay.push(payload);
    } else {
      state.cheatDay.splice(index, 1);
    }
    this.commit('SAVE_TO_STORAGE');
  },
  SET_ACHIEVEMENT_RATE(state, payload) {
    const index = state.achievementRate === payload ? -1 : payload;
    if (index === -1) {
      state.achievementRate = null;
    } else {
      state.achievementRate = payload;
    }
    this.commit('SAVE_TO_STORAGE');
  },
  SET_HOBBY_BUDGET(state, payload) {
    state.hobby = payload;
  },
  SET_EXPENSES(state, payload) {
    if (!state.expenses[payload.date]) {
      Vue.set(state.expenses, payload.date, []);
    }
    state.expenses[payload.date].push({
      id: Date.now(),
      category: payload.category,
      amount: payload.amount
    });
    this.commit('SAVE_TO_STORAGE');
  },
  SET_INCOME(state, payload) {
    if (!state.income[payload.date]) {
      Vue.set(state.income, payload.date, []);
    }
    state.income[payload.date].push({
      id: Date.now(),
      category: payload.category,
      amount: payload.amount
    });
    this.commit('SAVE_TO_STORAGE');
  }
}
export const actions = {
}

