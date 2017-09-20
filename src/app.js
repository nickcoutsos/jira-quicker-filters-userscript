import React from 'react'
import { connect } from 'react-redux'

import Dialog from './dialog'
import Switcher from './switcher'

function watch (selector, interval, onChange) {
  setInterval(function () {
    const element = document.querySelector(selector)
    if (element && !element.dataset.lastObserved) {
      element.setAttribute('data-last-observed', Date.now())
      onChange(element)
    }
  }, interval)
}

function getFilters () {
  const filters = document.querySelectorAll('#js-work-quickfilters dd a')
  const active = document.querySelectorAll('#js-work-quickfilters dd a.ghx-active')

  return {
    activeFilters: [...active].map(({ dataset }) => dataset.filterId),
    filters: [...filters]
      .map(({ dataset, textContent }) => ({ id: dataset.filterId, label: textContent }))
      .filter(({ id }) => id !== undefined)
  }
}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  componentDidMount () {
    const { dispatch } = this.props
    
    document.body.addEventListener('keypress', this.handleKeyPress)

    watch('#js-work-quickfilters dd', 200, gh => {
      const filters = getFilters()
      dispatch({ type: 'UPDATE_FILTERS', payload: filters })
    })
  }

  handleKeyPress (event) {
    const { dispatch, isDialogOpen } = this.props

    if (isDialogOpen || event.key !== 'f') {
      return
    }

    event.preventDefault()
    dispatch({ type: 'OPEN_DIALOG' })
  }

  render () {
    const { isDialogOpen, filters, activeFilters, dispatch } = this.props
    const activeFilter = (activeFilters && activeFilters.length) ? activeFilters[0] : null
    const close = () => dispatch({ type: 'CLOSE_DIALOG' })

    return (
      <Dialog active={isDialogOpen} onClickOutside={close} onEscape={close}>
        <Switcher
          filters={filters}
          activeFilter={activeFilter}
          onChange={active => dispatch({
            type: 'SELECT_FILTER',
            payload: active ? [active] : []
          })}
        />
      </Dialog>
    )
  }
}

const INITIAL_STATE = {
  filters: [],
  activeFilters: [],
  isDialogOpen: false
}

const mapStateToProps = (state = INITIAL_STATE) => {
  return state || {}
}

export default connect(mapStateToProps)(App)
