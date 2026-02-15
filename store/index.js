export const state = () => ({
  routineList: [],
  completedRoutineList: []
})

export const getters = {
  getRoutineList(state) {
    return state.routineList;
  },
  getCompletedLists(state) {
    return state.completedRoutineList;
  }
}

export const mutations = {
  ADD_TO_ROUTINE(state, payload) {
    state.routineList.push(payload);
  },
  ADD_TO_COMPLETED(state, payload) {
    state.completedRoutineList.push(payload);
  },
  REMOVE_FROM_ROUTINE(state, payload) {
    state.routineList = state.routineList.filter(list => list.id !== payload);
  },
  REMOVE_FROM_COMPLETED(state, payload) {
    state.completedRoutineList = state.completedRoutineList.filter(list => list.id !== payload);
  },
  UPDATE_ROUTINE_LIST(state, payload) {
    state.routineList = payload;
  }
}

export const actions = {
}
