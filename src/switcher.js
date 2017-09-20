import React from 'react'

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '5px',
  margin: '10px 0',
  boxSizing: 'border-box',
  fontSize: '18px',
  border: '1px solid rgba(0, 0, 0, 0.25)',
  borderRadius: '3px'
}

const pendingStyle = {
  borderColor: '#ccc',
  borderRadius: '3px'
}

const activeStyle = {
  background: '#ccd9ea',
  borderColor: '#3572b0',
  borderRadius: '3px'
}

const filterListStyle = {
  maxHeight: '300px',
  overflow: 'scroll'
}

const renderLabel = (label, search) => {
  if (!search) {
    return label
  }

  const matchStart = label.toLowerCase().indexOf(search)
  const matchEnd = Math.min(label.length, matchStart + search.length)

  return (
    <span>
      {label.substr(0, matchStart)}
      <strong>{label.substr(matchStart, search.length)}</strong>
      {label.substr(matchStart + search.length)}
    </span>
  )
}

class Switcher extends React.Component {
  constructor(props) {
    super(props)
    const { activeFilter, filters } = props

    this.state = {
      search: '',
      pending: activeFilter || filters[0] && filters[0].id,
      filterResults: props.filters
    }

    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  handleSearchChange ({ target }) {
    const search = target.value
    const { pending } = this.state
    const filterResults = this.searchFilters(search.toLowerCase())

    const newPending = (
      filterResults.find(({ id }) => id === pending) ||
      filterResults[0]
    )

    this.setState({ search, filterResults, pending: newPending && newPending.id })
  }

  handleKeyDown (event) {
    const { key } = event
    const { pending } = this.state

    if (['ArrowUp', 'ArrowDown'].indexOf(key) !== -1) {
      event.preventDefault()
      this.handleScroll(key === 'ArrowUp' ? -1 : 1)
    } else if (key === 'Enter') {
      event.preventDefault()
      this.handleSelection(pending)
    }
  }

  handleScroll (direction) {
    const { filterResults, pending } = this.state
    const index = filterResults.findIndex(({ id }) => id === pending)
    const next = (index + direction) % filterResults.length
    const actualNext = next < 0 ? next + filterResults.length : next
    const nextPending = filterResults[actualNext]
    
    this.setState({ pending: nextPending && nextPending.id }, () => {
      if (!this.list) {
        return
      }

      const pending = this.list.querySelector('.pending')
      pending.scrollIntoViewIfNeeded(false)
    })
  }

  handleSelection (selection) {
    const { activeFilter, onChange } = this.props
    onChange(activeFilter === selection ? null : selection)
  }

  searchFilters (search) {
    const { filters } = this.props

    if (!search) {
      return filters
    }

    return filters.filter(({ label }) => (
      label.toLowerCase().indexOf(search) !== -1
    ))
  }

  render () {
    const { onChange, filters, activeFilter } = this.props
    const { search, pending, filterResults } = this.state
    const visibleFilters = filterResults || filters

    return (
      <div>
        <h4>Quick Filters</h4>

        <input
          style={inputStyle}
          placeholder="Search..."
          onChange={this.handleSearchChange}
          onKeyDown={this.handleKeyDown}
          ref={input => input && input.focus()}
          value={search}
        />

        {
          visibleFilters.length === 0
            ? <p><em>No matching filters</em></p>
            : (
              <dl
                ref={list => this.list = list}
                style={filterListStyle}
                className="ghx-controls-filters"
              >
                {visibleFilters.map(({ id, label }) => (
                  <dd className={id === pending && 'pending' || ''} key={`filter-${id}`}>
                    <a
                      onClick={() => this.handleSelection(id)}
                      style={Object.assign(
                        {},
                        id === pending && pendingStyle,
                        id === activeFilter && activeStyle
                      )}
                    >
                      {renderLabel(label, search.toLowerCase())}
                    </a>
                  </dd>
                ))}
              </dl>
            )
        }
      </div>
    )
  }
}

export default Switcher
