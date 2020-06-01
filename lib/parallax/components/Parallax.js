import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { offsetMin, offsetMax } from '../utils/propValidation'

export default class Parallax extends Component {
  static defaultProps = {
    disabled: false,
    offsetYMax: 0,
    offsetYMin: 0,
    offsetXMax: 0,
    offsetXMin: 0,
    enterExitPadding: 0,
    slowerScrollRate: false, // determines whether scroll rate is faster or slower than standard scroll
    tag: 'div'
  }

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
    offsetXMax: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    offsetXMin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    offsetYMax: offsetMax,
    offsetYMin: offsetMin,
    enterExitPadding: PropTypes.number,
    slowerScrollRate: PropTypes.bool.isRequired,
    styleOuter: PropTypes.object,
    styleInner: PropTypes.object,
    tag: PropTypes.string.isRequired
  }

  static contextTypes = {
    parallaxController: PropTypes.object, // not required because this could be rendered on the server.
  }

  componentDidMount () {

    // Throw if neither context or global is available
    if (!this.controller) {
      throw new Error(
        "Must wrap your application's <Parallax /> components in a <ParallaxProvider />."
      )
    }

    // create a new parallax element and save the reference
    this.element = this.controller.createElement({
      elInner: this._inner,
      elOuter: this._outer,
      props: {
        disabled: this.props.disabled,
        offsetXMax: this.props.offsetXMax,
        offsetXMin: this.props.offsetXMin,
        offsetYMax: this.props.offsetYMax,
        offsetYMin: this.props.offsetYMin,
        enterExitPadding: this.props.enterExitPadding,
        slowerScrollRate: this.props.slowerScrollRate
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    // updates the elements props when relevant parallax props change
    if (
      this.props.disabled !== nextProps.disabled ||
      this.props.offsetXMax !== nextProps.offsetXMax ||
      this.props.offsetXMin !== nextProps.offsetXMin ||
      this.props.offsetYMax !== nextProps.offsetYMax ||
      this.props.offsetYMin !== nextProps.offsetYMin ||
      this.props.enterExitPadding !== nextProps.enterExitPadding ||
      this.props.slowerScrollRate !== nextProps.slowerScrollRate
    ) {
      this.controller.updateElement(this.element, {
        props: {
          disabled: nextProps.disabled,
          offsetXMax: nextProps.offsetXMax,
          offsetXMin: nextProps.offsetXMin,
          offsetYMax: nextProps.offsetYMax,
          offsetYMin: nextProps.offsetYMin,
          enterExitPadding: nextProps.enterExitPadding,
          slowerScrollRate: nextProps.slowerScrollRate
        }
      })
    }
    // resets element styles when disabled
    if (this.props.disabled !== nextProps.disabled && nextProps.disabled) {
      this.controller.resetElementStyles(this.element)
    }
  }

  componentWillUnmount () {
    this.controller.removeElement(this.element)
  }

  get controller () {
    // Legacy versions may use the global, not context
    return this.context.parallaxController || window.ParallaxController
  }

  // refs
  mapRefOuter = ref => {
    this._outer = ref
  }

  mapRefInner = ref => {
    this._inner = ref
  }

  render () {
    const {children, className, tag: Tag, styleOuter, styleInner} = this.props

    const rootClass = 'parallax-outer' + (className ? ` ${className}` : '')

    return (
      <Tag className={rootClass} ref={this.mapRefOuter} style={styleOuter}>
        <div className='parallax-inner' ref={this.mapRefInner} style={styleInner}>
          {children}
        </div>
      </Tag>
    )
  }
}
