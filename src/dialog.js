import React from 'react'
import Portal from 'react-portal'

const modalStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  zIndex: 100
}

const dialogStyle = {
  width: '300px',
  margin: '0 auto',
  position: 'relative',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'white',
  padding: '20px',
  borderRadius: '2px',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.25)'
}

class Dialog extends React.Component {
  constructor (props) {
    super(props)
    this.attachListeners = this.attachListeners.bind(this)
    this.handleClickAnywhere = this.handleClickAnywhere.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)
  }

  attachListeners (ref) {
    this.ref = ref
    document.body.addEventListener('click', this.handleClickAnywhere)
    document.body.addEventListener('keydown', this.handleKeydown)
  }

  handleClickAnywhere ({ target }) {
    if (!this.ref || this.ref.contains(target)) {
      return
    }

    this.props.onClickOutside()
  }

  handleKeydown ({ key }) {
    if (key !== 'Escape') {
      return
    }

    this.props.onEscape()
  }

  render () {
    const { active, children } = this.props
    return (
      <Portal isOpened={active}>
        <div style={modalStyle}>
          <div ref={this.attachListeners} style={dialogStyle}>
            {children}
          </div>
        </div>
      </Portal>
    )
  }
}

export default Dialog
