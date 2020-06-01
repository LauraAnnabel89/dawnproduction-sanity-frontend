import React from 'react'

export default class ListItemSerializer extends React.Component {

  render () {
    const { node, children } = this.props

    return (
      <li>{children}</li>
    );
  }

}
