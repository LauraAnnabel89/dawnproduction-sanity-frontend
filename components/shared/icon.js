import React from 'react'
import { forEach } from 'lodash'

export default class Icon extends React.Component {

  render () {
    const { children, ...props } = this.props
    const classes = ['icon']

    forEach(props, (val, key) => {
      if (val === true) {
        // icon type
        classes.push(`icon__${key}`)
      } else {
        // icon property
        classes.push(`icon__${key}-${val}`)
      }
    })

    return (
      <div className={classes.join(' ')}>
        <div className='icon__el-1' />
        <div className='icon__el-2' />
      </div>
    )
  }

}
