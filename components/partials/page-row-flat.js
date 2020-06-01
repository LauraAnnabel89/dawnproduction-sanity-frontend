import React from 'react'
import Blocks from 'components/partials/blocks'
import Parallax from 'components/partials/parallax'
import { isString } from 'lodash'
import { paramCase } from 'change-case'

const ROW_PROPS = [
  'type',
  'size',
  'textSize',
  'align',
  'theme'
]

// TODO: turn into components
// const ROW_RENDERERS = {
//   'double': row => {
//     const { content = [] } = row
//     let _content = [[]]
//     content.forEach(item => {
//       if (item._type === 'separator') {
//         _content.push([])
//         return
//       }
//       _content[_content.length - 1].push(item)
//     })
//     _content = _content.filter(item => item.length)
//     return (
//       <div className='page-row__content-row'>
//         {_content.map((column, i) => (
//            <div key={i} className='page-row__content-col'>
//              <Blocks content={column} />
//            </div>
//          ))}
//       </div>
//     )
//   }
// }

const ROW_RENDERER = row => {
  const { content = [] } = row
  let _content = [[]]
  content.forEach(item => {
    if (item._type === 'separator') {
      _content.push([])
      return
    }
    _content[_content.length - 1].push(item)
  })
  _content = _content.filter(item => item.length)
  const rowStyle = {}
  // if (row.height) {
  //   rowStyle.minHeight = isString(row.height) ? row.height : `${row.height}vh`
  // }
  return (
    <div className='page-row__content-row'>
      {_content.map((column, i) => (
         <div key={i} className='page-row__content-col' style={rowStyle}>
           <div className='page-row__content-inner'>
             <div className='page-row__content-inner-content'>
               <Blocks content={column} row={row} />
             </div>
           </div>
         </div>
       ))}
    </div>
  )
}

export default class PageRowFlat extends React.Component {

  render () {
    const { className, children, ...row } = this.props
    const rowClasses = ['page-row']
    if (className) rowClasses.push(className)
    ROW_PROPS.forEach(prop => {
      rowClasses.push(`page-row__${paramCase(prop)}-${row[prop] || 'default'}`)
    })
    const rowStyle = {}
    if (row.height) {
      rowStyle.minHeight = isString(row.height) ? row.height : `${row.height || 0}vh`
    }
    // const rowRender = ROW_RENDERERS[row.type]

    const rowRender = ROW_RENDERER
    return (
      <div className={rowClasses.join(' ')} style={rowStyle}>
        <div className='page-row__content'>
          <Parallax {...row}>
            {children || (rowRender && rowRender(row) || null)}
          </Parallax>
        </div>
      </div>
    )
  }

}
