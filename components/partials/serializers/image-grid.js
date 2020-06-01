import React from 'react'
import ImageGrid from 'components/partials/image-grid'

export default class ImageGridSerializer extends React.Component {

  render () {
    const { node = {} } = this.props
    return (
      <ImageGrid images={node.images || []} />
    )
  }

}
