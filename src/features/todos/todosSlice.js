import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import isEqual from 'lodash/isEqual'
import { client } from '../../api/client'
import { StatusFilters } from '../filters/filtersSlice'

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual)

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

// reducer
export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case types.TODO_ADDED: {
      const todo = action.payload
      return {
        ...state,
        entities: {
          ...state.entities,
          [todo.id]: todo,
        },
      }
    }
    case types.TODO_TOGGLED: {
      const todoId = action.payload
      const todo = state.entities[todoId]
      return {
        ...state,
        entities: {
          ...state.entities,
          [todoId]: {
            ...todo,
            completed: !todo.completed,
          },
        },
      }
    }
    case types.COLOR_SELECTED: {
      const { color, todoId } = action.payload
      const todo = state.entities[todoId]
      return {
        ...state,
        entities: {
          ...state.entities,
          [todoId]: {
            ...todo,
            color,
          },
        },
      }
    }
    case types.TODO_DELETED: {
      const newEntities = { ...state.entities }
      delete newEntities[action.payload]
      return {
        ...state,
        entities: newEntities,
      }
    }
    case types.TODOS_LOADING: {
      return {
        ...state,
        status: 'loading',
      }
    }
    case types.TODOS_LOADED: {
      const newEntities = {}
      action.payload.forEach((todo) => {
        newEntities[todo.id] = todo
      })
      return {
        ...state,
        status: 'idle',
        entities: newEntities,
      }
    }
    default:
      return state
  }
}

// action
export const todoAdded = (todo) => ({ type: types.TODO_ADDED, payload: todo })

export const todoToggled = (todoId) => ({
  type: types.TODO_TOGGLED,
  payload: todoId,
})

export const todoColorSelected = (todoId, color) => ({
  type: types.COLOR_SELECTED,
  payload: { todoId, color },
})

export const todoDeleted = (todoId) => ({
  type: types.TODO_DELETED,
  payload: todoId,
})

export const todosLoading = () => ({ type: types.TODOS_LOADING })

export const todosLoaded = (todos) => ({
  type: types.TODOS_LOADED,
  payload: todos,
})

// Thunk function
export const fetchTodos = () => async (dispatch) => {
  dispatch(todosLoading())
  const response = await client.get('/fakeApi/todos')
  dispatch(todosLoaded(response.todos))
}

export function saveNewTodo(text) {
  return async function saveNewTodoThunk(dispatch, getState) {
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    dispatch(todoAdded(response.todo))
  }
}

// selector
export const selectTodos = createSelector(
  (state) => state.todos.entities,
  (entities) => Object.values(entities)
)

// with args
export const selectTotalTodosCount = createSelector(
  selectTodos,
  (_, args) => args,
  (todos, args) => {
    // console.log('args', args)
    return todos.length
  }
)

export const selectFilteredTodos = createSelector(
  selectTodos,
  (state) => state.filters,
  (todos, filters) => {
    console.log('call selectFilteredTodos', filters, todos)
    const { status, colors } = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) {
      return todos
    }

    const completedStatus = status === StatusFilters.Completed
    return todos.filter((todo) => {
      const statusMatches =
        showAllCompletions || todo.completed === completedStatus
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }

  // custom memoizeOptions
  // {
  //   memoizeOptions: {
  //     // equalityCheck: isEqual,
  //     maxSize: 3,
  //     resultEqualityCheck: (cache, result) => {
  //       const useCache = isEqual(cache, result)
  //       console.log({ cache, result, useCache})
  //       return useCache
  //     },
  //   },
  // }
)

export const selectFilterTodosCount = createSelector(
  selectFilteredTodos,
  (todos) => todos.length
)

export const selectRemainTodosCount = createSelector(selectTodos, (todos) => {
  const uncompletedTodos = todos.filter((todo) => !todo.completed)
  return uncompletedTodos.length
})
