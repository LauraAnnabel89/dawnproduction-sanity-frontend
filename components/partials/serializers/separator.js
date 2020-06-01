import React from 'react'

export default class SeparatorSerializer extends React.Component {

  render () {
    const { node = {} } = this.props
    const { weight } = node

    return <hr style={{border: 0, borderBottom: `${weight || 1}px solid black`}} />
  }

}
