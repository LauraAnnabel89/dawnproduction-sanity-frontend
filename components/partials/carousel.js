import React from 'react'
import PropTypes from 'prop-types'

export default class Carousel extends React.Component {

  state = {
    current: 1
  }

  static propTypes = {
    items: PropTypes.array.isRequired,
    itemRenderer: PropTypes.func.isRequired,
    paused: PropTypes.bool
  }

  static defaultProps = {
    pasued: false
  }

  render () {
    const { items, itemRenderer, paused, style = {}, ...props } = this.props

    // TODO: handle no and single items
    const _items = [].concat([items[items.length - 1]], items, [items[0]])
    const slidesStyle = {
      width: `${_items.length * 100}%`
    }

    return (
      <div className='carousel__wrapper' style={{overflow: 'hidden', ...style}} {...props}>
        <div className='carousel__slides' style={slidesStyle}>
          {_items.map((item, i) => (
             <div key={i} className='carousel__slide'>
               {itemRenderer(item)}
             </div>
           ))}
        </div>
      </div>
    )
  }

}
