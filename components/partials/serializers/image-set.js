import React from 'react'
import ImageSet from 'components/partials/image-set'

export default class ImageSetSerializer extends React.Component {

  render () {
    const { node = {} } = this.props
    return (
      <ImageSet node={node || null} />
    )
  }

}
