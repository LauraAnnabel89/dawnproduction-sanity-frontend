import React from 'react'
import { isString } from 'lodash'
import { paramCase } from 'change-case'

import Blocks from 'components/partials/blocks'
import Expandable from 'components/partials/expandable'
import Parallax from 'components/partials/parallax'
import Icon from 'components/shared/icon'

const SECTION_PROPS = [
  'type',
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
  let _columns = []

  content.forEach((item, i) => {
    if (item._type === 'column') {
      const newItem = { children: [], ...item }
      _columns.push(newItem)
      return
    }
    if (item._type === 'separator') {
      return
    }
    if (_columns.length === 0) {
      return
    }
    
    _columns[_columns.length - 1].children.push(item)
  })

  return _columns.map((column, i) => {
    const { _key, children, parallaxAmount, offset, size, align, layer, anchor } = column
    const parallax = {
      amount: parallaxAmount > 100 ? parallaxAmount * 2 : parallaxAmount,
      direction: 'vertical',
      pixels: parallaxAmount > 100 ? true : false,
    }

    const classes = [
      'col-xs-12',
      !size || size === 0 ? 'col-md' : `col-md-${size}`,
      align ? `${align}-md` : undefined,
      layer ? `layer-${layer}` : undefined,
      anchor === 'end' ? `col-md-offset-${12-size}` : undefined,
    ].join(' ').trim()

    let marginTop = null
    if (offset) {
      marginTop = isString(offset) ? offset : parseInt(offset)
    }

    return (
      <div key={_key} className={classes} style={{ marginTop }}>
        <Parallax {...parallax}>
          {
            children.map(child => {
              const { _key } = child
              return <Blocks key={_key} content={child} row={row} />
            })
          }
        </Parallax>
      </div>
    )
  })
}

export default class PageRow extends React.Component {
  state = {
    infoExpanded: []
  }

  onInfoClick(key) {
    this.setState(state => {
      const { infoExpanded } = this.state
      infoExpanded[key] = !infoExpanded[key]

      return {
        ...state,
        infoExpanded
      }
    })
  }

  constructor (props) {
    super(props)
  }

  render () {
    const { className, children, _key, ...row } = this.props
    const { infoExpanded } = this.state

    const sectionClasses = [
      'section-row',
      row.overflow || row.expandable ? 'overflow pos-relative' : undefined,
      row.frontpage ? 'only-frontpage' : undefined
    ]

    const containerClasses = row.collapse ? [] : ['container-fluid'] 

    if (!row.size) {
      containerClasses.push('wrapper')
    }

    const rowClasses = ['row']

    if (className) rowClasses.push(className)
    SECTION_PROPS.forEach(prop => {
      sectionClasses.push(`page-row__${paramCase(prop)}-${row[prop] || 'default'}`)
    })
    rowClasses.push(`${row.align || 'middle'}-xs ${row.anchor || 'left'}-xs`)

    const rowStyle = {}
    if (row.height) {
      rowStyle.minHeight = isString(row.height) ? row.height : `${row.height || 0}vh`
    }

    if (row.padding) {
      const padding = isString(row.padding) ? row.padding : parseInt(row.padding)
      rowStyle.paddingTop = `${padding / 10 / 2}rem`
      rowStyle.paddingBottom = `${padding / 10 / 2}rem`
      rowClasses.push('desktop-padding')
    }
    
    if (row.expandable) {
      infoExpanded.push(_key)
    }

    const rowRender = ROW_RENDERER
    return (
      <section className={sectionClasses.join(' ')}>
        <div className={containerClasses.join(' ')}>
          {row.expandable === true ? (
            <>
              <div className='row'>
                <div className='col-xs-12 col-md-4'></div>
                <div className='col-xs-12 col-md-8 work-single__overview-expand'>
                  <div className={`work-single__overview-expand-link work-single__overview-expand-link--${infoExpanded[_key] ? 'rotated' : 'normal'}`} onClick={() => this.onInfoClick(_key)}>
                    <span>{row.expandableTitle || 'More info'}</span>
                    <Icon cross />
                  </div>
                </div>
              </div>

              <Expandable expanded={infoExpanded[_key]}>
                <div className={rowClasses.join(' ')} style={rowStyle}>
                  {children || (rowRender && rowRender(row) || null)}
                </div>
              </Expandable>
            </>
          ) : (
            <div className={rowClasses.join(' ')} style={rowStyle}>
              {children || (rowRender && rowRender(row) || null)}
            </div>
          )}
        </div>
      </section>
    )
  }

}
