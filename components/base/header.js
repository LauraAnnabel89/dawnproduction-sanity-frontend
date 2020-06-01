import React from 'react'
import PropTypes from 'prop-types'
import Logo from 'components/partials/logo'
import Expandable from 'components/partials/expandable'
import Icon from 'components/shared/icon'
import Menu from 'components/shared/menu'
import Link from 'next/link'

export default class Header extends React.Component {

  static propTypes = {
    visible: PropTypes.bool,
    items: PropTypes.array,
    social: PropTypes.array
  }

  static defaultProps = {
    visible: false,
    items: [],
    social: []
  }

  state = {
    open: false
  }

  onCrossClick = () => {
    this.setState(state => ({...state, open: !this.state.open}))
  }

  onLinkClick = () => {
    this.setState(state => ({...state, open: false}))
  }

  render () {
    const { visible, items, social, theme } = this.props
    const { open } = this.state

    return (
      <header className={`header header--${open || visible ? 'visible' : 'hidden'} header--${theme || 'generic'}`}>
        <div className='header__inner'>
          <div className='container-fluid'>
            <div className='header__top'>
              <h1 className='header__site-title'>Aesop Agency</h1>
              <Link href='/'>
              <a className='header__logo' onClick={this.onLinkClick}>
                <Logo />
              </a>
              </Link>

              <nav className='header__top-nav text-left'>
                <Menu className='header__nav-pages' items={items} onClick={this.onLinkClick} />
              </nav>

              {/* <a className={`header__cross header__cross--${open ? 'rotated' : 'normal'}`} onClick={this.onCrossClick}>
                <Icon cross />
              </a> */}
            </div>
            {/* <div className='header__bottom'>
              <Expandable expanded={open}>
                <div className='header__nav-wrapper'>
                  <nav className='header__nav text-left'>
                    <Menu className='header__nav-pages' items={items} onClick={this.onLinkClick} />
                  </nav>
                  <nav className='header__nav text-right'>
                    <Menu className='header__nav-social' items={social} onClick={this.onLinkClick} />
                  </nav>                  
                </div>
              </Expandable>
            </div>
            <div className={`header__slant header__slant--${open ? 'skewed' : 'normal'}`} /> */}
          </div>
        </div>
      </header>
    )
  }
}

// {config.social.map((item, i) => (
//    <li key={i}>
//      <Link href={item.url}>
//      <a target='_blank'>
//        {item.title}
//      </a>
//      </Link>
//    </li>
//  ))}
