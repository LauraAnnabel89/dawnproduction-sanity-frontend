import React from 'react'
import PropTypes from 'prop-types'

export default class Expandable extends React.Component {

  static propTypes = {
    expanded: PropTypes.bool,
    timeout: PropTypes.number
  }

  static defaultProps = {
    expanded: false,
    timeout: 500
  }

  state = {
    expanded: false,
    animating: false
  }

  calculatedHeight = 0

  componentWillMount () {
    this.setState(state => ({...state, expanded: this.props.expanded}))
  }

  componentWillUnmount () {
    if (this.timeout) clearTimeout(this.timeout)    
    if (this.interval) clearInterval(this.interval)
  }

  componentWillReceiveProps (props) {
    if (props.expanded === this.props.expanded) return

    if (this.timeout) clearTimeout(this.timeout)
    this.calculatedHeight = this.innerWrapper.clientHeight

    this.setState(state => ({...state, animating: true}))

    this.timeout = setTimeout(() => {
      this.setState(state => ({...state, expanded: !this.state.expanded}))

      // RAF completely thrashes the browser
      // Let's debounce it a little bit and reflow every 50ms while the animation is going on
      // Seems it's the most high number / less noticeable jittering
      this.interval = setInterval(() => {
        window.dispatchEvent(new Event('broadcast:parallax-reflow'))
      }, 50)

      this.timeout = setTimeout(() => {
        clearInterval(this.interval)
        this.setState(state => ({...state, animating: false}))
      }, this.props.timeout)
    }, 10)
  }

  render () {
    const { children } = this.props
    const { expanded, animating } = this.state

    const wrapperStyle = {}
    if (expanded) {
      wrapperStyle.height = animating ? this.calculatedHeight : 'auto'
    } else {
      wrapperStyle.height = 0
    }

    return (
      <div className={`expandable expandable--${expanded ? 'expanded' : 'closed'}`} style={wrapperStyle}>
        <div className='expandable__content' ref={ref => this.innerWrapper = ref}>
          {children}
        </div>
      </div>
    )
  }

}
