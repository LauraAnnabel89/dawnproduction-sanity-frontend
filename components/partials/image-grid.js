import React from 'react'
import PropTypes from 'prop-types'
import Image from 'components/partials/image'
import ImageSet from 'components/partials/image-set'
import Parallax from 'components/partials/parallax'
import { Link } from 'routes'
import Icon from 'components/shared/icon'

export default class ImageGrid extends React.Component {

  static propTypes = {
    images: PropTypes.array
  }

  wrapImage = (image, children) => {
    const { link } = image
    if (!link) return children
    const { _type, slug, client, name, title } = link
    if (!_type || !slug || !slug.current) return children
    let _title = []
    if (_type === 'work' && client) {
      _title.push(client)
      _title.push('F')
    } else if (name) {
      _title.push(name)
    } else if (title) {
      _title.push(title)
    }
    const overlay = (
    <div className='image-grid__image-overlay'>
      <h4>{_title.map((titlePart, i) => <span key={i}>{titlePart}</span>)}</h4>
      <Icon arrow />
    </div>
    )
    return (
      <Link route={_type} params={{slug: slug.current}}>
        <a>
          {children}
          {overlay}
        </a>
      </Link>
    )
  }

  render () {
    const { images } = this.props
    return (
      <div className='image-grid'>
        <div className='image-grid__inner'>
          {images.map((image, i) => {
             const ImageComponent = image._type === 'spacer' ? null : (image._type === 'image' ? Image : ImageSet)
             const { span = 1, verticalAdjust = 0, horizontalAdjust = 0 } = image
             const width = span * 2560
             const imageStyle = {
               display: 'block',
               flexBasis: `${span * 100}%`,
               transform: `translateX(${(horizontalAdjust * 100).toFixed(5)}%)`,
               marginTop: `${(verticalAdjust * 100).toFixed(5)}%`
             }
             return (
               <div key={i} className={`image-grid__image image-grid__image-type-${image._type}`} style={imageStyle}>
                 <Parallax {...image}>
                   {this.wrapImage(image, ImageComponent && <ImageComponent key={i} src={image} width={width} /> || null)}
                 </Parallax>
               </div>
             )
           })}
        </div>
      </div>
    )
  }

}
