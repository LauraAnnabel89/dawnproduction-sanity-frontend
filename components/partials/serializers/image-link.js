import React from 'react'
import ImageLink from 'components/partials/image-link'

export default class ImageLinkSerializer extends React.Component {

  render () {
    const { node = {} } = this.props
    return (
      <ImageLink node={node || null} />
    )
  }

}
