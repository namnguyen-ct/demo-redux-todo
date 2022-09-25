import { produce } from 'immer'

// action types
export const types = new Proxy(
  {
    TODO_ADDED: 'TODO_ADDED',
    TODO_TOGGLED: 'TODO_TOGGLED',
    COLOR_SELECTED: 'COLOR_SELECTED',
    TODO_DELETED: 'TODO_DELETED',
    TODOS_LOADING: 'TODOS_LOADING',
    TODOS_LOADED: 'TODOS_LOADED',
  },
  {
    get: (target, prop) =>
      target[prop] ? `entities/${target[prop]}` : target[prop],
  }
)

const initialState = {
  status: 'idle',
  entities: {},
}

export default function todosReducer(state = initialState, action) {
  const nextState = produce(state, (draft) => {
    switch (action.type) {
      case types.TODO_ADDED:
        const todo = action.payload
        draft.entities[todo.id] = todo
        break

      case types.TODO_TOGGLED:
        draft.entities[action.payload].completed =
          !draft.entities[action.payload].completed
        break

      case types.COLOR_SELECTED:
        const { color, todoId } = action.payload
        draft.entities[todoId].color = color
        break

      case types.TODO_DELETED:
        delete draft.entities[action.payload]
        break

      case types.TODOS_LOADING:
        draft.status = 'loading'
        break

      case types.TODOS_LOADED:
        const newEntities = {}
        action.payload.forEach((todo) => {
          newEntities[todo.id] = todo
        })
        draft.status = 'idle'
        draft.entities = action.payload.reduce((acc, item) => {
          return { ...acc, [item.id]: item }
        }, {})
        break

      default:
        break
    }
  })
  return nextState
}
