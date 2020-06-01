import React from 'react'

export default class HighlightSerializer extends React.Component {

  render () {
    const { children } = this.props
    return <span className="text-highlight">{children}</span>
  }

}
