import React from 'react'
import VideoLink from 'components/partials/video-link'

export default class VideoLinkSerializer extends React.Component {

  render () {
    const { node = {} } = this.props
    return (
      <VideoLink node={node || null} />
    )
  }

}
