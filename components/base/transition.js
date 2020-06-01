import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Transition from 'react-transition-group/Transition'
import CSSTransition from 'react-transition-group/CSSTransition'
import { timeoutsShape } from 'react-transition-group/utils/PropTypes'
import { withRouter } from 'next/router'
import { get, isFunction } from 'lodash'

const areChildrenDifferent = (oldChildren, newChildren) => {
  if (oldChildren === newChildren) return false
  if (
    React.isValidElement(oldChildren) &&
    React.isValidElement(newChildren) &&
    oldChildren.key != null &&
    oldChildren.key === newChildren.key
  ) {
    return false
  }
  return true
}

const ENTERING_STATES = [
  'enter',
  'entering',
  'entered'
]

const EXITING_STATES = [
  'exit',
  'exiting',
  'exited'
]

const buildClassName = (className, state) => {
  switch (state) {
    case 'enter':
      return `${className}-enter`
    case 'entering':
      return `${className}-enter ${className}-enter-active`
    case 'entered':
      return `${className}-enter-done`
    case 'exit':
      return `${className}-exit`
    case 'exiting':
      return `${className}-exit ${className}-exit-active`
    case 'exited':
      return `${className}-exit-done`
    default:
      return ''
  }
}

const shouldDelayEnter = children => {
  return (
    React.isValidElement(children) && children.type.pageTransitionDelayEnter
  )
}

class TransitionWrapperBase extends React.Component {

  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    classNames: PropTypes.string,
    timeout: process.env.NODE_ENV !== 'production' ? timeoutsShape : null,
    loadingComponent: PropTypes.element,
    loadingDelay: PropTypes.number,
    loadingCallbackName: PropTypes.string,
    loadingTimeout: (props, ...args) => {
      let pt = timeoutsShape
      if (props.loadingComponent && process.env.NODE_ENV !== 'production') {
        pt = pt.isRequired
        return pt(props, ...args)
      }
    },
    loadingClassNames: (props, ...args) => {
      let pt = PropTypes.string
      if (props.loadingTimeout) pt = pt.isRequired
      return pt(props, ...args)
    },
    monkeyPatchScrolling: PropTypes.bool
  }

  static defaultProps = {
    classNames: 'page-transition',
    timeout: 500,
    loadingComponent: null,
    loadingCallbackName: 'pageTransitionReadyToEnter',
    loadingDelay: 500,
    monkeyPatchScrolling: false
  }

  currentTransitionName = null
  currentTransitionDirection = null
  currentTransitionTimeout = null

  currentChildRef = React.createRef()

  constructor (props) {
    super(props)

    const { children, component } = props
    const _children = this.getChildren(children)

    this.state = {
      state: 'enter',
      isIn: !shouldDelayEnter(_children),
      currentChildren: _children,
      currentComponent: component,
      previousChildren: null,
      previousComponent: null,
      nextChildren: null,
      nextComponent: null,
      renderedChildren: _children,
      renderedComponent: component,
      showLoading: false
    }
  }

  getChildren = children => {
    if (isFunction(children)) {
      return children(this.currentChildRef)
    }
    return children
  }

  callListener (state) {
    if (!state) return
    const listenerName = `on${state.charAt(0).toUpperCase()}${state.slice(1)}`
    const listener = this.props[listenerName]
    listener && isFunction(listener) && listener()
  }

  makeStateUpdater (state, otherProps) {
    return () => {
      this.setState({
        state,
        ...otherProps
      })
      this.callListener(state)
    }
  }

  componentDidMount () {
    if (shouldDelayEnter(this.props.children)) {
      this.setState({
        timeoutId: this.startEnterTimer()
      })
    }

    if (this.props.monkeyPatchScrolling && typeof window !== 'undefined') {
      // Forgive me for what I'm about to do
      this.originalScrollTo = window.scrollTo
      this.disableScrolling = false
      window.scrollTo = (...args) => {
        if (this.disableScrolling) return
        this.originalScrollTo.apply(window, args)
      }
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { currentChildren, renderedChildren, previousChildren, nextChildren } = this.state
    const { currentComponent, renderedComponent, previousComponent, nextComponent } = this.state
    const { isIn, state } = this.state
    const { router, children, component } = this.props

    const _children = this.getChildren(children)

    const hasNewChildren = areChildrenDifferent(currentChildren, _children)
    const needsTransition = areChildrenDifferent(renderedChildren, _children)

    if (hasNewChildren) {
      // We got a new set of children while we were transitioning some in
      // Immediately start transitioning out this component and update the next
      // component

      if (isIn) {
        this.currentTransitionName = null
        this.currentTransitionDirection = null
        this.currentTransitionTimeout = null

        const currentConfig = get(currentComponent, 'transitionConfig') || get(currentChildren, 'type.transitionConfig') || {}
        // const currentInstanceConfig = get(this.currentChildRef, 'current.instanceTransitionConfig') || {}
        const nextName = get(component, 'displayName') || get(_children, 'type.name')

        // console.log('---- OUT -----')
        // console.log('currentComponent', currentComponent)
        // console.log('currentConfig', currentConfig)
        // console.log('nextName', nextName)

        const outConfigFunc = currentConfig.out
        if (outConfigFunc) {
          const outConfig = outConfigFunc(nextName)
          if (outConfig && outConfig.name) this.currentTransitionName = outConfig.name
          if (outConfig && outConfig.timeout) this.currentTransitionTimeout = outConfig.timeout
        }

      // const outInstanceConfigFunc = currentInstanceConfig.out
      // if (outInstanceConfigFunc) {
      //   const outConfig = outInstanceConfigFunc(nextName, router.asPath)
      //   if (outConfig && outConfig.name) this.currentTransitionName = outConfig.name
      //   if (outConfig && outConfig.direction) this.currentTransitionDirection = outConfig.direction
      //   if (outConfig && outConfig.timeout) this.currentTransitionTimeout = outConfig.timeout
      // }
      }

      this.setState({
        isIn: false,
        previousChildren: currentChildren,
        previousComponent: currentComponent,
        nextChildren: _children,
        nextComponent: component,
        currentChildren: _children,
        currentComponent: component
      })
      if (this.state.timeoutId) {
        clearTimeout(this.state.timeoutId)
      }
    } else if (needsTransition && !isIn && (state === 'enter' || state === 'exited')) {
      this.currentTransitionName = null
      this.currentTransitionDirection = null
      this.currentTransitionTimeout = null

      const nextConfig = get(nextComponent, 'transitionConfig') || get(nextChildren, 'type.transitionConfig') || {}
      const previousName = get(previousComponent, 'displayName') || get(previousChildren, 'type.name')

      // const currentInstanceConfig = get(this.currentChildRef, 'current.instanceTransitionConfig') || {}
      // console.log(this.currentChildRef)

      // console.log('---- IN -----')
      // console.log('nextComponent', nextComponent)
      // console.log('nextConfig', nextConfig)
      // console.log('previousName', previousName)

      const inConfigFunc = nextConfig.in
      if (inConfigFunc) {
        const inConfig = inConfigFunc(previousName)
        if (inConfig && inConfig.name) this.currentTransitionName = inConfig.name
        if (inConfig && inConfig.timeout) this.currentTransitionTimeout = inConfig.timeout
      }

      if (shouldDelayEnter(nextChildren)) {
        // Wait for the ready callback to actually transition in, but still
        // mount the component to allow it to start loading things
        this.setState({
          renderedChildren: nextChildren,
          renderedComponent: nextComponent,
          nextChildren: null,
          nextComponent: null,
          timeoutId: this.startEnterTimer()
        })
      } else {
        // No need to wait, mount immediately
        this.setState({
          isIn: true,
          renderedChildren: nextChildren,
          renderedComponent: nextComponent,
          nextChildren: null,
          nextComponent: null
        })
      }
    } else if (prevState.showLoading && !this.state.showLoading) {
      // We hid the loading indicator; now that that change has been flushed to
      // the DOM, we can now bring in the next component!
      this.setState({
        isIn: true
      })
    } else {
      // console.log('')
      // console.log('currentChildRef', this.currentChildRef)
      // console.log('needsTransition', needsTransition)
      // console.log('isIn', isIn)
      // console.log('state', state)
    }
  }

  componentWillUnmount () {
    if (this.originalScrollTo && typeof window !== 'undefined') {
      window.scrollTo = this.originalScrollTo
    }
    if (this.state.timeoutId) clearTimeout(this.state.timeoutId)
  }

  onEnter = () => {
    // It's safe to reenable scrolling now
    this.disableScrolling = false
    this.setState({
      state: 'enter',
      showLoading: false
    })
    this.callListener('enter')
  }

  onExit = () => {
    // Disable scrolling until this component has unmounted
    this.disableScrolling = true
    this.setState({
      state: 'exit'
    })
    this.callListener('exit')
  }

  onChildLoaded () {
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId)
    }
    if (this.state.showLoading) {
      // We'll hide the loader first and animate in the page on the next tick
      this.setState({
        showLoading: false
      })
    } else {
      // We can immediately bring in the next page!
      this.setState({
        isIn: true
      })
    }
  }

  startEnterTimer () {
    return setTimeout(() => {
      this.setState({
        showLoading: true
      })
    }, this.props.loadingDelay)
  }

  render () {
    const { timeout, loadingComponent, loadingCallbackName, classNames } = this.props
    const { renderedChildren: children, state } = this.state

    if (['entering', 'exiting', 'exited'].indexOf(state) !== -1) {
      // Need to reflow!
      if (document.body) document.body.scrollTop
    }

    const hasLoadingComponent = !!loadingComponent

    let _classNames = classNames
    if (this.currentTransitionName) _classNames += `__${this.currentTransitionName}`
    if (this.currentTransitionDirection) _classNames += `${this.currentTransitionDirection < 0 ? '-backward' : ''}`
    const containerClassName = buildClassName(_classNames, state)

    return (
      <Fragment>
        <Transition
          timeout={this.currentTransitionTimeout || timeout}
          in={this.state.isIn}
          appear
          onEnter={this.onEnter}
          onEntering={this.makeStateUpdater('entering')}
          onEntered={this.makeStateUpdater('entered')}
          onExit={this.onExit}
          onExiting={this.makeStateUpdater('exiting')}
          onExited={this.makeStateUpdater('exited', { renderedChildren: null })}>
          <div className={containerClassName}>
            {children &&
             React.cloneElement(children, {
               // Commented out as it prints an error on React - not sure what this does
               // [loadingCallbackName]: () => this.onChildLoaded()
             })}
          </div>
        </Transition>
        {hasLoadingComponent && (
         <CSSTransition
           in={this.state.showLoading}
           mountOnEnter
           unmountOnExit
           appear
           classNames={this.props.loadingClassNames}
           timeout={this.props.loadingTimeout}>
           {loadingComponent}
         </CSSTransition>
         )}
      </Fragment>
    )
  }

}

export const TransitionWrapper = withRouter(TransitionWrapperBase)
