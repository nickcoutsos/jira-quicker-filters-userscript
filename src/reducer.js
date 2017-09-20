export default (state={}, { type, payload }) => {
  switch(type) {
    case 'OPEN_DIALOG':
      return Object.assign({}, state, { isDialogOpen: true })
    case 'CLOSE_DIALOG':
      return Object.assign({}, state, { isDialogOpen: false })
    case 'UPDATE_FILTERS':
      const { filters, activeFilter } = payload
      return Object.assign({}, state, {
        filters,
        activeFilter
      })
    case 'SELECT_FILTER':
      const current = new URL(location.href)

      current.searchParams.delete('quickFilter')
      if (payload.length > 0) {
        current.searchParams.append('quickFilter', payload)
      }

      window.history.pushState({}, null, current.href)
      window.history.back()
      setTimeout(() => window.history.forward(), 100)

      return Object.assign({}, state, {
        isDialogOpen: false,
        activeFilters: payload
      })
  }
}
