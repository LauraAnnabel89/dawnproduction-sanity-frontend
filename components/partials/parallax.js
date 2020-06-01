import React from 'react'
import { Parallax as ScrollParallax } from 'lib/parallax'

export default class Parallax extends React.Component {

  render () {
    const { children, direction, amount, parallaxDirection, parallaxAmount, parallaxOffset = 15, offset = 0, pixels } = this.props
    if (!children || (!parallaxDirection && !direction)) return children

    const _direction = direction || parallaxDirection
    let _amount = amount || parallaxAmount || 0
    let slowerScrollRate = false

    if (_amount < 0) {
      _amount = Math.abs(_amount)
      slowerScrollRate = true
    }

    const parallaxProps = {
      tag: 'div',
      slowerScrollRate: true,
      enterExitPadding: parallaxOffset
    }

    let amountMin = -_amount + offset
    let amountMax = _amount + offset

    if (pixels) {
      amountMin = `${amountMin}px`
      amountMax = `${amountMax}px`
    }

    if (_direction === 'horizontal') {
      parallaxProps.offsetXMin = amountMin
      parallaxProps.offsetXMax = amountMax
    } else {
      parallaxProps.offsetYMin = amountMin
      parallaxProps.offsetYMax = amountMax
    }
    return (
      <ScrollParallax slowerScrollRate={slowerScrollRate} {...parallaxProps}>
        {children}
      </ScrollParallax>
    )
  }

}
