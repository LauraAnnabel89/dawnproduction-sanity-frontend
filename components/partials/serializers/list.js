import React from 'react'

export default class ListSerializer extends React.Component {

  render () {
    const { node, children } = this.props

    return (
      <ul>{children}</ul>
    );
  }

}
