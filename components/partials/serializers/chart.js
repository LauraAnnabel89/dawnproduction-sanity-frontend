import React from 'react'
import { Parallax } from 'lib/parallax'

export default class ChartSerializer extends React.Component {

  // itemRefs = []
  //
  // state = {
  //   maxHeight: 0
  // }
  //
  // resize = () => {
  //   let maxHeight = 0
  //   this.itemRefs.forEach(el => {
  //     const height = el.clientHeight
  //     if (height > maxHeight) maxHeight = height
  //   })
  //   if (this.state.height !== maxHeight) {
  //     this.setState(state => ({...state, maxHeight}))
  //   }
  // }
  //
  // componentDidMount () {
  //   this.resize()
  //   window.addEventListener('resize', this.resize, false)
  // }
  //
  // componentWillUnmount () {
  //   window.removeEventListener('resize', this.resize, false)
  // }
  //
  // onItemRef = ref => {
  //   this.itemRefs.push(ref)
  // }

  render () {
    const { node = {} } = this.props
    // const { maxHeight } = this.state
    const { data = [] } = node
    return (
      <div className='chart'>
        <Parallax enterExitPadding={15}>
          <ul className='chart__list'>
            {data.map((item, i) => {
               const { name, list = [] } = item
               const itemStyle = {
                 transitionDelay: `${i * 150}ms`
               }
               return (
                 <li key={i} className='chart__list-item' style={itemStyle}>
                   <div ref={this.onItemRef} className='chart__list-item-inner'>
                     <h3>{name}</h3>
                     {list.length && (
                      <ul className='chart__list-items'>
                        {list.map((item, i) => (
                           <li key={i}>
                             {item}
                           </li>
                         ))}
                      </ul>
                      ) || null}
                   </div>
                 </li>
               )
             })}
          </ul>
        </Parallax>
      </div>
    )
  }

}
