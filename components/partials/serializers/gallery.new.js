import React from 'react'
import Carousel from 'components/partials/carousel'
import Image from 'components/partials/image'
import { isString } from 'lodash'

// import Icon from 'components/shared/icon'
// import { Carousel, Slide } from 'react-versatile-carousel'
// import 'react-versatile-carousel/build/carousel.css'
// import { get } from 'lodash'
//
// class Arrow extends React.Component {
//
//   render () {
//     const { label, onClick } = this.props
//     return (
//       <div className={`${label} gallery__carousel-arrow`} onClick={onClick}>
//         <div className='gallery__carousel-arrow-inner'>
//           <Icon arrow />
//         </div>
//       </div>
//     )
//   }
//
// }

export default class GallerySerializer extends React.Component {

  state = {
    paused: false
  }

  // onNav = direction => {
  //   if (!this.state.paused) {
  //     this.setState(state => ({...state, paused: true}))
  //   }
  // }

  renderSlide = (image, i) => {
    return (
      <Image src={image} width={2560} height={1440} />
    )
  }

  render () {
    const { node } = this.props
    const { paused } = this.state
    if (!node.slides || !node.slides.length) return null

    const { row = {} } = node
    const wrapperStyle = {}
    if (row.height) {
      wrapperStyle.minHeight = isString(row.height) ? row.height : `${row.height}vh`
    } else {
      wrapperStyle.paddingTop = '56.25%'
    }

    // const duration = (node.duration || 5) * 1000
    // const backgrounds = node.slides.map(image => get(image, 'asset.metadata.palette.dominant.background') || '#000000')
    // return (
    //   <Carousel
    //     cssName='gallery__carousel'
    //     interval={duration}
    //     pause={paused}
    //     duration={750}
    //     backgrounds={backgrounds}
    //     onNav={this.onNav}
    //     arrow={Arrow}>
    //     {node.slides.map((image, i) => (
    //        <Slide key={i}>
    //          <Image src={image} width={2560} height={1440} />
    //        </Slide>
    //      ))}
    //   </Carousel>
    // )
    return (
      <Carousel style={wrapperStyle} items={node.slides} itemRenderer={this.renderSlide} />
    )
  }

}
