import { produce } from 'immer'

export const StatusFilters = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
}

const types = new Proxy(
  {
    CHANGE_STATUS: 'CHANGE_STATUS',
    CHANGE_COLORS: 'CHANGE_COLORS',
  },
  {
    get: (target, prop) =>
      target[prop] ? `filter/${target[prop]}` : target[prop],
  }
)

const initialState = {
  status: StatusFilters.All,
  colors: [],
}

export default function filtersReducer(state = initialState, action) {
  const nextState = produce(state, (draft) => {
    switch (action.type) {
      case types.CHANGE_STATUS:
        draft.status = action.payload
        break

      case types.CHANGE_COLORS:
        let { color, changeType } = action.payload
        if (changeType === 'added' && !draft.colors.includes(color)) {
          draft.colors.push(color)
        } else if (changeType === 'removed') {
          draft.colors = draft.colors.filter((existingColor) => existingColor !== color)
        }
        break
      default:
        break
    }
  })
  return nextState
}

export const statusFilterChanged = (status) => ({
  type: types.CHANGE_STATUS,
  payload: status,
})

export const colorFilterChanged = (color, changeType) => {
  return {
    type: types.CHANGE_COLORS,
    payload: { color, changeType },
  }
}
