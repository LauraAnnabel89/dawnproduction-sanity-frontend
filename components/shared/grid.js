import React from 'react'
import PropTypes from 'prop-types'

export default class Grid extends React.Component {

  static propTypes = {
    type: PropTypes.string,
    items: PropTypes.array,
    renderItem: PropTypes.func.isRequired
  }

  static defaultProps = {
    type: 'default',
    items: []
  }

  render () {
    const { type, items, renderItem } = this.props
    return (
      <div className={`grid grid__type-${type}`}>
        <div className='grid__inner'>
          {items.map((item, i) => (
             <div key={i} className='grid__cell'>
               {renderItem(item)}
             </div>
           ))}
        </div>
      </div>
    )
  }

}
