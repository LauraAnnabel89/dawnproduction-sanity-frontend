import React from 'react'

export default class ParagraphSerializer extends React.Component {

  render () {
    const { node, children } = this.props
    const style = node.style || 'normal'

    return <p className={`paragraph--${style}`}>{children}</p>
  }

}
