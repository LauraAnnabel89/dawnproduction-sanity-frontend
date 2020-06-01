import React from 'react'
import App, { Container } from 'next/app'
import css from '../assets/css/styles.scss'
import withGA from 'next-ga'
import axios from 'axios'
import Router, { withRouter } from 'next/router'
import highlightShare from 'highlight-share'
import * as twitterSharer from 'highlight-share/dist/sharers/twitter'
import * as linkedInSharer from 'highlight-share/dist/sharers/linked-in'
import { TransitionWrapper } from 'components/base/transition'
import { ParallaxProvider } from 'lib/parallax'
import Scrollbar from 'lib/scrollbar'
import NProgress from 'next-nprogress/component'
import withNProgress from 'next-nprogress'

import sanity from 'lib/sanity'
import { find } from 'lodash'

import Header from 'components/base/header'
import Footer from 'components/base/footer'
import Meta from 'components/base/meta'
import FirstVisit from 'components/base/first-visit'

const SCROLL_OFFSET = 25

let menuCache = null

const MENU_QUERY = `
  *[_type == "menu"] {
    _id,
    id,
    items[] {
      ...,
      "resolved": @->
    }
  }
`

const SCROLLBAR_PLUGIN_OPTIONS = {
  overscroll: false
}

class AesopApp extends App {

  state = {
    headerIsVisible: true
  }

  yOffset = 0
  previousYOffset = 0

  static async getInitialProps ({Component, ctx}) {
    let props = {}

    if (!menuCache) {
      const menus = await sanity.fetch(MENU_QUERY)
      const _menus = menus || []
      menuCache = {
        main: find(_menus, {id: { current: 'main' }}),
        social: find(_menus, {id: { current: 'social' }})
      }
    }
    props.menus = menuCache

    if (Component.getInitialProps) {
      const pageProps = await Component.getInitialProps(ctx)
      props.page = pageProps || {}
    }
    return {
      Component,
      pageProps: props
    }
  }

  onScroll = e => {
    const currentYOffset = e.offset.y
    this.yOffset = Math.max(0, Math.min(this.yOffset + currentYOffset - this.previousYOffset, SCROLL_OFFSET))
    this.previousYOffset = currentYOffset

    if (this.yOffset === 0 || this.yOffset === SCROLL_OFFSET) {
      const headerIsVisible = this.yOffset === 0
      if (this.state.headerIsVisible !== headerIsVisible) {
        this.setState(state => ({...state, headerIsVisible}))
      }
    }

    if (this.transitionCover) this.transitionCover.style.top = `${e.offset.y}px`
  }

  onTransitionExited = () => {
    if (this.scrollbar && this.scrollbar.scrollbar) {
      this.scrollbar.scrollbar.setPosition(0, 0)
    }
  }

  render () {
    const { Component, pageProps = {} } = this.props
    const { menus = {} } = pageProps
    const compName = (Component.displayName && Component.displayName.toLowerCase()) || (Component.name && Component.name.toLowerCase()) || 'generic'
    const data = (pageProps.page && pageProps.page.data) ? pageProps.page.data.current || pageProps.page.data : { navbar: 'generic' }
    const { navbar } = data
    const header = <Header key="static-scroll-header" theme={navbar} visible={this.state.headerIsVisible} items={menus && menus.main && menus.main.items || []} social={menus && menus.social && menus.social.items || []} />
    const firstVisit = <FirstVisit key="static-scroll-firstvisit" />
    // const staticChildren = [header, firstVisit] // Don't use the welcome screen anymore
    const staticChildren = header

    return (
      <Container>
        <Meta />
        <NProgress />
        <Scrollbar
          ref={ref => this.scrollbar = ref}
          className='scrollbar'
          continuousScrolling={false}
          staticChildren={staticChildren}
          onScroll={this.onScroll}
          plugins={SCROLLBAR_PLUGIN_OPTIONS}>
          <div className='scroll-content-inner'>
            <TransitionWrapper
              component={Component}
              monkeyPatchScrolling={true}
              timeout={750}
              onExited={this.onTransitionExited}>
              <div key={this.props.router.asPath} className='app-wrapper'>
                <div className='app-content'>
                  <div ref={ref => this.transitionCover = ref} className='transition-cover--container'>
                    <div className={`transition-cover--inner transition-cover--theme-${navbar || 'generic'}`} />
                  </div>
                  <Component {...pageProps.page} />
                </div>
              </div>
            </TransitionWrapper>
          </div>
          <Footer social={menus && menus.social && menus.social.items || []} />
        </Scrollbar>
      </Container>
    )
  }

}

export default withGA('UA-22971552-1', Router)(withNProgress(300, {showSpinner: false})(AesopApp))
