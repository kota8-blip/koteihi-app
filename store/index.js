export const state = () => ({
  routineList: [],
  completedRoutineList: [],
  currentColor: '#a0bad8',
  cheatDay: [],
  achievementRate: null
})

export const getters = {
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
  }
}
export const actions = {
}

