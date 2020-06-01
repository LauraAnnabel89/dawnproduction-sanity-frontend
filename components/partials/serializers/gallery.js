import React from 'react'
import Image from 'components/partials/image'
import Icon from 'components/shared/icon'
import { Carousel, Slide } from 'react-versatile-carousel'
import 'react-versatile-carousel/build/carousel.css'
import Blocks from 'components/partials/blocks'
import { get, isString } from 'lodash'
import Color from 'color'

const colourClass = (colour, className) => {
  return Color(colour).luminosity() > 0.5 ? `${className}-light` : `${className}-dark`
}

class Arrow extends React.Component {

  render () {
    const { label, onClick } = this.props
    return (
      <div className={`${label} gallery__carousel-arrow`} onClick={onClick}>
        <div className='gallery__carousel-arrow-inner'>
          <Icon arrow />
        </div>
      </div>
    )
  }

}

export default class GallerySerializer extends React.Component {

  state = {
    paused: false
  }

  onNav = direction => {
    if (!this.state.paused) {
      this.setState(state => ({...state, paused: true}))
    }
  }

  render () {
    const { node } = this.props
    const { paused } = this.state
    if (!node.slides || !node.slides.length) return null
    const duration = (node.duration || 5) * 1000
    const backgrounds = node.slides.map(slide => {
      const bg = slide.background && slide.background[0]
      if (!bg) return '#000000'
      if (bg._type === 'color') {
        return bg.hex || '#000000'
      }
      return get(bg, 'asset.metadata.palette.dominant.background') || '#000000'
    })
    const { row = {} } = node
    const wrapperStyle = {}
    if (row.height) {
      wrapperStyle.minHeight = isString(row.height) ? row.height : `${row.height}vh`
    } else {
      wrapperStyle.paddingTop = '56.25%'
    }

    const renderCopy = slide => {
      let caption = slide.caption && [slide.caption]
      let subCaption = slide.subCaption && [slide.subCaption]

      if (!caption) {
        if (slide.linkExternal) {
        } else if (slide.linkInternal) {
          if (slide.linkInternal._type === 'work') {
            caption = [slide.linkInternal.client, 'Aesop'].filter(o => !!o)
          } else {
            caption = [slide.linkInternal.title]
          }
        }
      }

      if (!subCaption) {
        if (slide.linkExternal) {
        } else if (slide.linkInternal) {
          if (slide.linkInternal._type === 'work') {
            subCaption = slide.linkInternal.category.filter(o => !!o)
          }
        }
      }

      const hasCaption = ((caption && caption.length) || (subCaption && subCaption.length))

      return (
        <React.Fragment>
          {hasCaption && (
           <div className={`gallery__carousel-slide-caption-wrapper${slide.captionPosition === 'top' ? ' gallery__carousel-slide-caption-wrapper-top' : ''}`}>
             <div className='gallery__carousel-slide-caption'>
               {caption && caption.length && (
                <div className='gallery__carousel-slide-caption-main'>
                  {caption.map((captionPart, i) => (
                     <span key={i}>{captionPart}</span>
                   ))}
                </div>
                ) || null}
               {subCaption && subCaption.length && (
                <div className='gallery__carousel-slide-caption-sub'>
                  {subCaption.map((captionPart, i) => (
                     <span key={i}>{captionPart}</span>
                   ))}
                </div>
                ) || null}
             </div>
           </div>
           ) || null}
          <div className='gallery__carousel-slide-copy'>
            <div className='gallery__carousel-slide-copy-inner'>
              {slide.copy && <Blocks content={slide.copy} /> || null}
            </div>
          </div>
        </React.Fragment>
      )
    }

    return (
      <div className='gallery__carousel-wrapper' style={wrapperStyle}>
        <Carousel
          cssName='gallery__carousel'
          interval={duration}
          pause={false}
          duration={750}
          interval={7500}
          backgrounds={backgrounds}
          onNav={this.onNav}
          arrow={Arrow}>
          {node.slides.map((slide, i) => {
             const bg = slide.background && slide.background[0]
             if (!bg) return null
             let colour
             if (bg._type === 'color') {
               colour = bg.hex
             } else {
               colour = get(bg, 'asset.metadata.palette.dominant.background')
             }
             if (!colour) colour = '#000000'
             if (bg._type === 'color') {
               return (
                 <Slide key={i}>
                   <div className={colourClass(colour, 'slide-colour')} style={{backgroundColor: colour, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                     {renderCopy(slide)}
                   </div>
                 </Slide>
               )
             }
             return (
               <Slide key={i}>
                 <div className={colourClass(colour, 'slide-colour')}>
                   <Image src={bg} width={2560 * 1.5} height={1440 * 1.5}>
                     {renderCopy(slide)}
                   </Image>
                 </div>
               </Slide>
             )
           })}
        </Carousel>
      </div>
    )
  }

}
