import React, { Fragment } from 'react'
import { imageUrl } from 'lib/image'
import { get, forEach, isFunction, flatten } from 'lodash'
import ImagesLoaded from 'react-images-loaded'
import Parallax from 'components/partials/parallax'

export default class Image extends React.Component {

  static defaultProps = {
    quality: 60,
    format: 'jpg'
  }

  state = {
    loading: true,
    error: false
  }

  handleOnAlways = () => {
    const { onLoaded } = this.props
    onLoaded && onLoaded()
  }

  handleOnFail = () => {
    this.setState(state => ({...state, loading: false, error: true}))
  }

  handleDone = () => {
    this.setState(state => ({...state, loading: false}))
  }

  render () {
    const { src, className, style, children, variableSize, onLoaded, ...props } = this.props
    const { loading, error } = this.state
    let image = imageUrl(src)
    if (!image) return null
    const palette = get(src, 'asset.metadata.palette.dominant')
    const placeholder = get(src, 'asset.metadata.lqip')

    forEach(props, (value, key) => {
      const method = image[key]
      if (key === 'format' && src && src.asset && src.asset.mimeType) {
        return
      }
      if (isFunction(method)) {
        image = method.apply(image, flatten([value]))
      }
    })

    const renderImage = () => {
      const width = get(src, 'asset.metadata.dimensions.width')
      const height = get(src, 'asset.metadata.dimensions.height')
      const crop = get(src, 'crop')
      const _cropWidth = crop ? width * (crop.left + crop.right) : 0
      const _cropHeight = crop ? height * (crop.top + crop.bottom) : 0

      const { width: destWidth, height: destHeight } = image.options

      if (variableSize) {
        const { crop = { left: 0, top: 0 }, hotspot = { x: 0.5, y: 0.5 } } = src
        const imageStyle = {
          backgroundImage: `url(${image.url()})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `${(hotspot.x - crop.left) * 100}% ${(hotspot.y - crop.top) * 100}%`,
          backgroundSize: 'cover'
        }
        return {
          background: '.image__inner',
          image: <div className='image__inner' style={imageStyle} />
        }
      }

      let ratio = null

      if (destWidth && destHeight) {
        ratio = destHeight / destWidth
      } else if (width && height) {
        ratio = (height - _cropHeight) / (width - _cropWidth)
      }

      if (ratio !== null) {
        const { crop = { left: 0, top: 0 }, hotspot = { x: 0.5, y: 0.5 } } = src
        const imageStyle = {
          paddingTop: `${ratio * 100}%`,
          backgroundImage: `url(${image.url()})`,
          backgroundRepeat: 'no-repeat',
          // backgroundPosition: 'center',
          backgroundPosition: `${(hotspot.x - crop.left) * 100}% ${(hotspot.y - crop.top) * 100}%`,
          backgroundSize: 'cover',
          width: '100%',
        }
        return {
          background: '.image__inner',
          image: <div className='image__inner' style={imageStyle} />
        }
      }

      return {
        background: false,
        image: <img className='image__inner' style={{display: 'block', width: '100%', height: 'auto'}} src={image.url()} />
      }
    }

    const classes = ['image']
    if (className) classes.push(className)
    if (loading) {
      classes.push('image--loading')
    } else {
      classes.push(error ? 'image--error' : 'image--loaded')
    }

    const rendered = renderImage()

    const paletteBgStyle = {
      position: 'absolute',
      backgroundColor: palette && palette.background || 'transparent',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1
    }

    // if (placeholder) {
    //   paletteBgStyle.backgroundImage = `url(${placeholder})`
    // }
    
    const scrollAmount = 0

    return (
      <div className={classes.join(' ')} style={style}>
          <ImagesLoaded
            onAlways={this.handleOnAlways}
            onFail={this.handleOnFail}
            done={this.handleDone}
            background={rendered.background}>
              {
                loading ? 
                rendered.image : 
                <Parallax amount={scrollAmount} direction='vertical' pixels>
                  <div className='image__palette-background' style={paletteBgStyle} />
                  {rendered.image}
                </Parallax>
              }
          </ImagesLoaded>
        {children}
      </div>
    )
  }

}
