import React from 'react'

export default class Fullpage extends React.Component {

  render () {
    const { cssClass } = this.props

    return (
      <div className={`fullscreen masthead ${cssClass || ''}`}>
        {this.props.cssClass.split(' ').indexOf('skew') > 0 &&
          <div className='skew before' />
        }
        {this.props.children}
        {this.props.cssClass.split(' ').indexOf('skew') > 0 &&
          <div className='skew after' />
        }
      </div>
    )
  }
}
