import React from 'react'

export default class UppercaseSerializer extends React.Component {

  render () {
    const { children } = this.props
    return <span className="text-uppercase">{children}</span>
  }

}
