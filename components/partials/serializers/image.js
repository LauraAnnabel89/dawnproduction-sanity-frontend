import React from 'react'
import Image from 'components/partials/image'

export default class ImageSerializer extends React.Component {

  render () {
    const { node } = this.props
    return (
      <div className='block__image'>
        <Image src={node} width={1280} />
      </div>
    )
  }

}
