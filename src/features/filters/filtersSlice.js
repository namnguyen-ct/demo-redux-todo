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
  switch (action.type) {
    case types.CHANGE_STATUS: {
      return {
        ...state,
        status: action.payload,
      }
    }
    case types.CHANGE_COLORS: {
      let { color, changeType } = action.payload
      const { colors } = state

      switch (changeType) {
        case 'added': {
          if (colors.includes(color)) {
            // This color already is set as a filter. Don't change the state.
            return state
          }

          return {
            ...state,
            colors: state.colors.concat(color),
          }
        }
        case 'removed': {
          return {
            ...state,
            colors: state.colors.filter(
              (existingColor) => existingColor !== color
            ),
          }
        }
        default:
          return state
      }
    }
    default:
      return state
  }
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
