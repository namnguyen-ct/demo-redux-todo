import React from 'react'
import { useSelector } from 'react-redux'
import TodoListItem from './TodoListItem'

import { selectFilteredTodos } from './todosSlice'

const TodoList = () => {
  const todos = useSelector(selectFilteredTodos)
  const loadingStatus = useSelector((state) => state.todos.loading)

  if (loadingStatus) {
    return (
      <div className="todo-list">
        <div className="loader" />
      </div>
    )
  }

  const renderedListItems = todos.map((todo) => {
    return <TodoListItem key={todo.id} todo={todo} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
