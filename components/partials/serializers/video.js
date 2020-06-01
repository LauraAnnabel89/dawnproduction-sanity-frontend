import React from 'react'
import Video from 'components/partials/video'

export default class VideoSerializer extends React.Component {

  render () {
    const { node } = this.props

    return <Video {...node} />
  }

}
