import React from 'react'

export default class SmallSerializer extends React.Component {

  render () {
    const { children } = this.props

    return <small>{children}</small>
  }

}
