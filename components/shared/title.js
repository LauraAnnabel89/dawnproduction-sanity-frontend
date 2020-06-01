import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'components/shared/icon'
import Image from 'components/partials/image'
import ImageSet from 'components/partials/image-set'
import { Link } from 'routes'
import { isArray } from 'lodash'

export default class Title extends React.Component {

  static propTypes = {
    type: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    previous: PropTypes.object,
    next: PropTypes.object
  }

  state = {
    arrowOver: false,
    clicked: false
  }

  onIndexClick() {
    if (window) {
      window.dispatchEvent(new Event('broadcast:scrolltop'))
      return true
    } else {
      return false
    }
  }

  renderIndex (item, side) {
    return (
      <Link href='/our-work'>
        <a className='flex start-xs' onClick={this.onArrowClick(side)} onMouseEnter={this.onArrowMouseEnter(side)} onMouseLeave={this.onArrowMouseLeave}>
          <Icon arrow='270deg' />
          <strong>All Projects</strong>
        </a>
      </Link>
    )
  }

  renderNav (item, side) {
    const { type } = this.props
    if (!item || !item.slug) {
      return <Icon arrow state='disabled' />
    }
    return (
      <Link route={type || item._type} params={{slug: item.slug.current}}>
      <a className='flex end-xs' onClick={this.onArrowClick(side)} onMouseEnter={this.onArrowMouseEnter(side)} onMouseLeave={this.onArrowMouseLeave}>
        <strong>Next</strong>
        <Icon arrow />
      </a>
      </Link>
    )
  }

  renderNavThumb (item) {
    if (!item) return null
    const { thumbnail, header } = item
    if (!thumbnail && !header) return null
    const image = thumbnail || header
    const imgSrc = image.images ? image[0] : image
    return <Image src={imgSrc} width={896} height={504} />
  }

  onArrowMouseEnter = side => () => {
    this.setState(state => ({...state, arrowOver: side}))
  }

  onArrowMouseLeave = () => {
    this.setState(state => ({...state, arrowOver: false}))
  }

  onArrowClick = side => () => {
    // this.setState(state => ({...state, clicked: this.state.arrowOver}))
  }

  render () {
    const { className, title, subtitle, previous, next } = this.props
    const { arrowOver, clicked } = this.state

    const _title = title ? (isArray(title) ? title : [title]) : null
    const _subtitle = subtitle ? (isArray(subtitle) ? subtitle : [subtitle]) : null
    const hasNav = previous || next

    const classNames = ['page-title']
    if (className) classNames.push(className)

    return (
      <div className={classNames.join(' ')}>
        <div className='container-fluid'>
          <div className='row between-sm'>
            <div className='col-xs-6'>
              {this.renderIndex()}
            </div>

            {hasNav && (
              <div className='col-xs-6'>
                {this.renderNav(next, 'next')}
              </div>
            ) || null}
          </div>
        </div>
      </div>
    )
  }

}
