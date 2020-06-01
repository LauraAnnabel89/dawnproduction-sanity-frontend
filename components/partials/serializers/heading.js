import React from 'react'
import Heading from '../heading'

export default class HeadingSerializer extends React.Component {

  render () {
    const { node } = this.props

    return <Heading key={node._key} {...node} />
  }

}
