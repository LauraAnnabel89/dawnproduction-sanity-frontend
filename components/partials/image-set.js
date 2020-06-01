import React from 'react'
import PropTypes from 'prop-types'
import routes, { Link } from 'routes'
import Image from 'components/partials/image'
import VisibilitySensor from 'react-visibility-sensor'

export default class ImageGrid extends React.Component {
  constructor(props) {
    super(props)
    this.reachedVisibility = false
  }

  static propTypes = {
    images: PropTypes.array
  }

  wrapImage = (node, children) => {
    if (!children) {
      return null
    }

    const { overlap, internalLink, externalLink, textTop, textBottom } = node
    if (!internalLink && !externalLink) return children
    
    const overlapClass = overlap === 'none' || !overlap ? 'overlap-none' : `overlap-${overlap}`
    
    const overlay = (
      <div className={`image-grid__image-overlay ${overlapClass}`}>
        {textTop ? <h2><span>{textTop}</span></h2> : null}
        {textBottom ? <small><span>{textBottom}</span></small> : null}
      </div>
    )

    if (internalLink && internalLink.resolved) {
      const { resolved } = internalLink
      if (!resolved || !resolved.slug || !resolved.slug.current) {
        return null
      }
      return (
        <Link route={resolved._type} params={{slug: resolved.slug.current}}>
          <a>
            {children}
            {overlay}
          </a>
        </Link>
      )
    } else if (externalLink && externalLink.indexOf('http') === 0) {
      return (
        <a target='_blank' rel="noopener noreferrer" href={externalLink.url}>
          {children}
          {overlay}
        </a>
      )
    } else {
      return null
    }
  }

  onChange = (isVisible) => {
    if (isVisible && !this.reachedVisibility) {
      this.reachedVisibility = true
    }
  }

  render () {
    const { node } = this.props
    const { image, width, overlap } = node

    const imageClasses = overlap && overlap !== 'center' && overlap !== 'none' ? `w-100 w-50-md nudge-${overlap}` : 'w-100';

    return (
      <div className={`image-grid w-100 w-${width || 100}-md`}>
        <div className='image-grid__inner'>
          {this.wrapImage(node, image ? <Image key={node._key} src={image} className={imageClasses} /> : null)}
        </div>
      </div>
    )
  }

}
