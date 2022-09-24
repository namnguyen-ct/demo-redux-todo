import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { availableColors, capitalize } from '../filters/colors'
import {
  StatusFilters,
  colorFilterChanged,
  statusFilterChanged,
} from '../filters/filtersSlice'
import {
  selectRemainTodosCount,
  selectFilterTodosCount,
  selectTotalTodosCount,
} from '../todos/todosSlice'

const StatTodos = ({ count, title, extra }) => {
  const suffix = count === 1 ? '' : 's'

  return (
    <div className="todo-count">
      <h5>{title}</h5>
      <strong>{count}</strong> item{suffix}
      <p>{extra}</p>
    </div>
  )
}

const StatusFilter = ({ value: status, onChange }) => {
  const renderedFilters = Object.keys(StatusFilters).map((key) => {
    const value = StatusFilters[key]
    const handleClick = () => onChange(value)
    const className = value === status ? 'selected' : ''

    return (
      <li key={value}>
        <button className={className} onClick={handleClick}>
          {key}
        </button>
      </li>
    )
  })

  return (
    <div className="filters statusFilters">
      <h5>Filter by Status</h5>
      <ul>{renderedFilters}</ul>
    </div>
  )
}

const ColorFilters = ({ value: colors, onChange }) => {
  const renderedColors = availableColors.map((color) => {
    const checked = colors.includes(color)
    const handleChange = () => {
      const changeType = checked ? 'removed' : 'added'
      onChange(color, changeType)
    }

    return (
      <label key={color}>
        <input
          type="checkbox"
          name={color}
          checked={checked}
          onChange={handleChange}
        />
        <span
          className="color-block"
          style={{
            backgroundColor: color,
          }}
        ></span>
        {capitalize(color)}
      </label>
    )
  })

  return (
    <div className="filters colorFilters">
      <h5>Filter by Color</h5>
      <form className="colorSelection">{renderedColors}</form>
    </div>
  )
}

// const mapState = createStructuredSelector({
//   allTodosCount: selectTotalTodosCount,
//   remainTodosCount: selectRemainTodosCount,
//   filterTodosCount: selectFilterTodosCount,
// })

const Footer = () => {
  const dispatch = useDispatch()

  const allTodosCount = useSelector((state) => selectTotalTodosCount(state, {max : 5}))
  const remainTodosCount = useSelector(selectRemainTodosCount)
  const filterTodosCount = useSelector(selectFilterTodosCount)
  const { status, colors } = useSelector((state) => state.filters)

  const onColorChange = (color, changeType) =>
    dispatch(colorFilterChanged(color, changeType))

  const onStatusChange = (status) => dispatch(statusFilterChanged(status))

  return (
    <footer className="footer">
      <StatTodos title="Total:" count={allTodosCount} />
      <StatTodos title="Showing:" count={filterTodosCount} />
      <StatTodos title="Remaining Todos:" count={remainTodosCount} />
      <StatusFilter value={status} onChange={onStatusChange} />
      <ColorFilters value={colors} onChange={onColorChange} />
    </footer>
  )
}

export default Footer
