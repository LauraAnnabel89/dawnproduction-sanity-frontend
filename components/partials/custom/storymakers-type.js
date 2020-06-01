import React, { Component } from 'react'
import Heading from '../heading'


export default class StorymakersType extends Component {
  constructor(props) {
    super(props)
    this.index = 0
    this.state = {
      text: null
    }
    this.interval = null
    this.raf = null
    this.dom = React.createRef()
  }

  componentDidMount() {
    const { sessionStorage } = window 
    const currentVisit = sessionStorage.getItem('currentVisit')

    const text = [
      'A creative agency',
      'for brands that',
      'need a new story.',
    ]

    this.animate = (e) => {
      if (!e) {
        return
      }

      let { pageX, pageY } = e

      if (e.type === 'touchmove') {
        pageX = e.touches[0].pageX
        pageY = e.touches[0].pageY
      }

      // const time = performance.now()
      const variation = Math.sin(pageX / window.innerWidth) * 1000 + 0 
      const variationScale = Math.sin(pageY / window.innerHeight) / 8 + 0.92
      const variationSpacing = Math.sin(pageX / window.innerWidth) / 4 + 1 / 10 - 0.15
      // const variation3 = Math.cos(Math.sin(time / 500)) * 500 + 500
      this.dom.current.style = `transform: scale(1, ${variationScale}); letter-spacing: ${variationSpacing}rem; font-variation-settings: 'wght' ${variation}`
    }
    
    window.addEventListener('mousemove', this.animate, false)
    window.addEventListener('touchmove', this.animate)
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.raf)
    this.raf = null

    window.removeEventListener('mousemove', this.animate)
    window.removeEventListener('touchmove', this.animate)

  }

  render() {
    const { text } = this.state

    return (
      <div ref={this.dom} className={`storymakers-type text-blue storymakers-type--text-${this.index % 2}`}>
        <h1 className='heading-component font-bold size-fluid'>
          <span>A creative agency </span>
          <span>for brands that </span>
          <span>need a new story.</span>
        </h1>
      </div>
    )
  }
}


	