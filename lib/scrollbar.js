import React from 'react'
import PropTypes from 'prop-types'
import SmoothScrollbar, { ScrollbarPlugin } from 'smooth-scrollbar'
import { defaultsDeep, indexOf, filter, isArray, uniq } from 'lodash'
// import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll'
import { getParallaxOffsets, isElementInView, parseValueAndUnit, testForPassiveScroll } from './parallax/utils/index'

const getClasses = element => {
  if (!element) return []
  if (!element.className) return []
  return element.className.split(/\s+/)
}

const addClass = (element, className) => {
  if (!element || !className) return
  const existingClassName = element.className || ''
  const classNames = isArray(className) ? className : [className]
  let needsAdding = false
  classNames.forEach(className => {
    if (needsAdding) return
    needsAdding = existingClassName.indexOf(className) === -1
  })
  if (needsAdding) {
    const existingClasses = getClasses(element)
    const classes = uniq(existingClasses.concat(classNames))
    element.className = classes.join(' ')
  }
}

const removeClass = (element, className) => {
  if (!element || !className) return
  const existingClassName = element.className || ''
  const classNames = isArray(className) ? className : [className]
  let needsRemoving = false
  classNames.forEach(className => {
    if (needsRemoving) return
    needsRemoving = existingClassName.indexOf(className) !== -1
  })
  if (needsRemoving) {
    const existingClasses = getClasses(element)
    const classes = filter(existingClasses, existingClassName => !classNames.includes(existingClassName))
    element.className = classes.join(' ')
  }
}

class StaticContainerPlugin extends ScrollbarPlugin {
  static pluginName = 'staticContainer'

  static defaultOptions = {}

  onInit () {
    const { children } = this.options
    const staticContainer = document.createElement('div')
    staticContainer.className = 'scroll-content-static'
    if (children) staticContainer.appendChild(children)
    this.scrollbar.containerEl.appendChild(staticContainer)
  }
}


class HijackScrollPlugin extends ScrollbarPlugin {
  static pluginName = 'hijackScroll'

  static defaultOptions = {
    direction: 'y',
  }

  transformDelta (delta, fromEvent) {
    if (!/wheel/.test(fromEvent.type)) {
      return delta;
    }

    const {x, y} = delta;

    if (this.options.direction === 'x') {
      return {
        y: 0,
        x: Math.abs(x) > Math.abs(y) ? x : y,
      };  
    }

    // Noop
    return {
      ...delta
    }
  }
}

SmoothScrollbar.use(StaticContainerPlugin, HijackScrollPlugin)

function ScrollController () {
  let container = null
  let scrollbar = null

  // All parallax elements to be updated
  let elements = []

  // Tracks current scroll distance
  let scrollX = 0
  let scrollY = 0

  // Tracks last scroll distance
  let lastScrollX = 0
  let lastScrollY = 0

  // Tracks direction
  let directionX = 1
  let directionY = 1

  // Window sizing
  let windowWidth = 0
  let windowHeight = 0

  // ID to increment for elements
  let id = 0

  // Ticking
  let ticking = false

  // Scroll direction
  // let scrollDown = null

  function _addListeners () {
    window.addEventListener('resize', _handleResize, false)
    window.addEventListener('broadcast:parallax-reflow', _handleResize, false)
  }

  function _removeListeners () {
    window.removeEventListener('resize', _handleResize, false)
  }

  _addListeners()

  function _handleScroll (xOffset, yOffset) {
    // reference to prev scroll y
    // const prevScrollY = scrollY

    // Save current scroll
    lastScrollX = scrollX
    scrollX = xOffset; // Supports IE 9 and up.
    directionX = scrollX >= lastScrollX ? 1 : -1
    lastScrollY = scrollY
    scrollY = yOffset; // Supports IE 9 and up.
    directionY = scrollY >= lastScrollY ? 1 : -1

    // direction
    // scrollDown = scrollY > prevScrollY

    // Only called if the last animation request has been
    // completed and there are parallax elements to update
    if (!ticking && elements.length > 0) {
      ticking = true
      window.requestAnimationFrame(_updateElementPositions)
    }
  }

  /**
   * Window resize handler. Sets the new window inner height
   * then updates parallax element attributes and positions.
   */
  function _handleResize () {
    _setWindowSize()
    _updateElementAttributes()
    _updateElementPositions()
  }

  /**
   * Creates a unique id to distinguish parallax elements.
   * @return {Number}
   */
  function _createID () {
    ++id
    return id
  }

  /**
   * Update element positions.
   * Determines if the element is in view based on the cached
   * attributes, if so set the elements parallax styles.
   */
  function _updateElementPositions () {
    elements.forEach(element => {
      if (element.props.disabled) return

      // check if the element is in view then
      const isInView = isElementInView(element, windowWidth, windowHeight, scrollX, scrollY)

      // set styles if it is
      if (isInView) _setParallaxStyles(element)

      _setParallaxClassNames(element)

      // reset ticking so more animations can be called
      ticking = false
    })
  }

  /**
   * Update element attributes.
   * Sets up the elements offsets based on the props passed from
   * the component then caches the elements current position and
   * other important attributes.
   */
  function _updateElementAttributes () {
    elements.forEach(element => {
      if (element.props.disabled) return

      _setupOffsets(element)

      _cacheAttributes(element)
    })
  }

  /**
   * Remove parallax styles from all elements.
   */
  function _removeParallaxStyles () {
    elements.forEach(element => {
      _resetStyles(element)
    })
  }

  /**
   * Cache the window height.
   */
  function _setWindowSize () {
    if (!container) {
      windowHeight = 0
      windowWidth = 0
      return
    }

    windowHeight = container.offsetHeight
    windowWidth = container.offsetWidth

  // const html = document.documentElement
  // windowHeight = window.innerHeight || html.clientHeight
  }

  /**
   * Takes a parallax element and caches important values that
   * cause layout reflow and paints. Stores the values as an
   * attribute object accesible on the parallax element.
   * @param {object} element
   */
  function _cacheAttributes (element) {
    const { yMin, yMax, xMax, xMin } = element.offsets

    const { slowerScrollRate } = element.props

    // NOTE: Many of these cause layout and reflow so we're not
    // calculating them on every frame -- instead these values
    // are cached on the element to access later when determining
    // the element's position and offset.
    const el = element.elOuter
    const rect = el.getBoundingClientRect()
    const elHeight = el.offsetHeight
    const elWidth = el.offsetWidth
    const scrollY = scrollbar && scrollbar.offset.y || 0

    // NOTE: offsetYMax and offsetYMin are percents
    // based of the height of the element. They must be
    // calculated as px to correctly determine whether
    // the element is in the viewport.
    const yPercent = yMax.unit === '%' || yMin.unit === '%'
    const xPercent = xMax.unit === '%' || xMin.unit === '%'

    // X offsets
    let yMinPx = yMin.value
    let yMaxPx = yMax.value

    if (yPercent) {
      const h100 = elHeight / 100
      yMaxPx = yMax.value * h100
      yMinPx = yMin.value * h100 // negative value
    }

    // Y offsets
    let xMinPx = xMax.value
    let xMaxPx = xMin.value

    if (xPercent) {
      const w100 = elWidth / 100
      xMaxPx = xMax.value * w100
      xMinPx = xMin.value * w100 // negative value
    }

    // NOTE: must add the current scroll position when the
    // element is checked so that we get its absolute position
    // relative to the document and not the viewport then
    // add the min/max offsets calculated above.
    let top = 0
    let bottom = 0
    let left = 0
    let right = 0    

    if (slowerScrollRate) {
      top = rect.top + scrollY + yMinPx
      bottom = rect.bottom + scrollY + yMaxPx
      left = rect.left + scrollX + xMinPx
      right = rect.right + scrollX + xMaxPx
    } else {
      top = rect.top + scrollY + yMaxPx * -1
      bottom = rect.bottom + scrollY + yMinPx * -1
      left = rect.left + scrollX + xMaxPx * -1
      right = rect.right + scrollX + xMinPx * -1
    }

    // NOTE: Total distance the element will move from when
    // the top enters the view to the bottom leaving
    // accounting for elements height and max/min offsets.
    const totalDistY = windowHeight + (elHeight + Math.abs(yMinPx) + yMaxPx)
    const totalDistX = windowWidth + (elWidth + Math.abs(xMinPx) + xMaxPx)

    element.attributes = {
      top,
      bottom,
      left,
      right,
      elHeight,
      elWidth,
      yMaxPx,
      yMinPx,
      xMaxPx,
      xMinPx,
      totalDistY,
      totalDistX
    }
  }

  /**
   * Takes a parallax element and parses the offset props to get the value
   * and unit. Sets these values as offset object accessible on the element.
   * @param {object} element
   */
  function _setupOffsets (element) {
    const {offsetYMin, offsetYMax, offsetXMax, offsetXMin} = element.props

    const yMin = parseValueAndUnit(offsetYMin)
    const yMax = parseValueAndUnit(offsetYMax)
    const xMin = parseValueAndUnit(offsetXMax)
    const xMax = parseValueAndUnit(offsetXMin)

    if (xMin.unit !== xMax.unit || yMin.unit !== yMax.unit) {
      throw new Error(
        'Must provide matching units for the min and max offset values of each axis.'
      )
    }

    const xUnit = xMin.unit || '%'
    const yUnit = yMin.unit || '%'

    element.offsets = {
      xUnit,
      yUnit,
      yMin,
      yMax,
      xMin,
      xMax
    }
  }

  function _setParallaxClassNames (element) {
    const top = element.attributes.top - scrollY
    const { totalDistX, totalDistY } = element.attributes

    // Percent the element has moved based on current and total distance to move
    const percentMoved = {
      x: (top * -1 + windowWidth) / totalDistX * 100,
      y: (top * -1 + windowHeight) / totalDistY * 100
    }

    const el = element.elInner

    const addClasses = []
    const removeClasses = []

    const padding = element.props.enterExitPadding || 0

    const from = 0
    const to = 100

    const fromPadded = from + padding
    const toPadded = to - padding

    if (directionX > 0) {
      // forward
      if (percentMoved.x >= fromPadded) {
        addClasses.push('parallax--left')
        removeClasses.push('parallax--not-left')
      }

      if (percentMoved.x > to) {
        removeClasses.push('parallax--right')
        addClasses.push('parallax--not-right')
      }
    } else {
      // backward

      if (percentMoved.x < from) {
        removeClasses.push('parallax--left')
        addClasses.push('parallax--not-left')
      }

      if (percentMoved.x <= toPadded) {
        addClasses.push('parallax--right')
        removeClasses.push('parallax--not-right')
      }
    }

    if (directionY > 0) {
      // forward
      if (percentMoved.y >= fromPadded) {
        addClasses.push('parallax--above')
        removeClasses.push('parallax--not-above')
      }

      if (percentMoved.y > to) {
        removeClasses.push('parallax--below')
        addClasses.push('parallax--not-below')
      }
    } else {
      // backward

      if (percentMoved.y < from) {
        removeClasses.push('parallax--above')
        addClasses.push('parallax--not-above')
      }

      if (percentMoved.y <= toPadded) {
        addClasses.push('parallax--below')
        removeClasses.push('parallax--not-below')
      }
    }

    // if (direction > 0) {
    //   addClasses.push('parallax--direction-forward')
    //   removeClasses.push('parallax--direction-backward')
    // } else {
    //   addClasses.push('parallax--direction-backward')
    //   removeClasses.push('parallax--direction-forward')
    // }
    //
    // if (percentMoved >= from && percentMoved <= to) {
    //   addClasses.push('parallax--in-view')
    // } else {
    //   removeClasses.push('parallax--in-view')
    // }
    //
    // if (percentMoved >= fromPadded && percentMoved <= toPadded) {
    //   addClasses.push('parallax--padded-in-view')
    // } else {
    //   removeClasses.push('parallax--padded-in-view')
    // }
    //
    // if (percentMoved > to) {
    //   addClasses.push('parallax--above')
    // } else {
    //   removeClasses.push('parallax--above')
    // }
    //
    // if (percentMoved > toPadded) {
    //   addClasses.push('parallax--padded-above')
    // } else {
    //   removeClasses.push('parallax--padded-above')
    // }
    //
    // if (percentMoved < from) {
    //   addClasses.push('parallax--below')
    // } else {
    //   removeClasses.push('parallax--below')
    // }
    //
    // if (percentMoved < fromPadded) {
    //   addClasses.push('parallax--padded-below')
    // } else {
    //   removeClasses.push('parallax--padded-below')
    // }

    addClass(el, addClasses)
    removeClass(el, removeClasses)
  }

  /**
   * Takes a parallax element and set the styles based on the
   * offsets and percent the element has moved though the viewport.
   * @param {object} element
   */
  function _setParallaxStyles (element) {
    const top = element.attributes.top - scrollY
    const left = element.attributes.left - scrollX
    const { totalDistX, totalDistY } = element.attributes

    // Percent the element has moved based on current and total distance to move
    const percentMoved = {
      x: (left * -1 + windowWidth) / totalDistX * 100,
      y: (top * -1 + windowHeight) / totalDistY * 100,
    }

    // Scale percentMoved to min/max percent determined by offset props
    const { slowerScrollRate } = element.props

    // Get the parallax X and Y offsets
    const offsets = getParallaxOffsets(
      element.offsets,
      percentMoved,
      slowerScrollRate
    )

    // Apply styles
    const el = element.elInner

    // prettier-ignore
    el.style.transform = `translate3d(${offsets.x.value}${offsets.x.unit}, ${offsets.y.value}${offsets.y.unit}, 0)`
  }

  /**
   * Takes a parallax element and removes parallax offset styles.
   * @param {object} element
   */
  function _resetStyles (element) {
    const el = element.elInner
    el.style.transform = ''
  }

  /**
   * -------------------------------------------------------
   * Public methods
   * -------------------------------------------------------
   */

  this.setContainer = function (el) {
    container = el
    this.update()
  }

  this.setScrollbar = function (el) {
    scrollbar = el
    this.update()
  }

  /**
   * Gets the parallax elements in the controller
   * @return {array} parallax elements
   */
  this.getElements = function () {
    return elements
  }

  /**
   * Creates a new parallax element object with new id
   * and options to store in the 'elements' array.
   * @param {object} options
   * @return {object} element
   */
  this.createElement = function (options) {
    const id = _createID()
    const newElement = {
      id,
      ...options
    }

    const updatedElements = [...elements, newElement]

    elements = updatedElements
    this.update()

    return newElement
  }

  /**
   * Creates a new parallax element object with new id
   * and options to store in the 'elements' array.
   * @param {object} element
   */
  this.removeElement = function (element) {
    const updatedElements = elements.filter(el => el.id !== element.id)
    elements = updatedElements
  }

  /**
   * Updates an existing parallax element object with new options.
   * @param {object} element
   * @param {object} options
   */
  this.updateElement = function (element, options) {
    const updatedElements = elements.map(el => {
      // create element with new options and replaces the old
      if (el.id === element.id) {
        // update props
        el.props = options.props
      }
      return el
    })

    elements = updatedElements

    // call update to set attributes and positions based on the new options
    this.update()
  }

  /**
   * Remove element styles.
   * @param {object} element
   */
  this.resetElementStyles = function (element) {
    _resetStyles(element)
  }

  this.onScroll = function (e) {
    _handleScroll(e.offset.x, e.offset.y)
  }

  /**
   * Updates all parallax element attributes and postitions.
   */
  this.update = function () {
    _setWindowSize()
    _updateElementAttributes()
    _updateElementPositions()
  }

  this.destroy = function () {
    // _removeListeners()
    // _removeParallaxStyles()
  }
}

ScrollController.init = function () {
  const hasWindow = typeof window !== 'undefined'

  if (!hasWindow) {
    throw new Error(
      'Looks like ScrollController.init() was called on the server. This method must be called on the client.'
    )
  }

  const controller = new ScrollController()

  return controller
}

class Scrollbar extends React.Component {
  static propTypes = {
    damping: PropTypes.number,
    thumbMinSize: PropTypes.number,
    syncCallbacks: PropTypes.bool,
    renderByPixels: PropTypes.bool,
    alwaysShowTracks: PropTypes.bool,
    continuousScrolling: PropTypes.bool,
    plugins: PropTypes.object,
    onScroll: PropTypes.func,
    children: PropTypes.node,
    staticChildren: PropTypes.node,
    innerRef: PropTypes.func
  }

  static defaultProps = {
    innerRef: () => {
    }
  }

  static childContextTypes = {
    parallaxController: PropTypes.object
  }

  mounted = false
  contentHeight = 0

  getChildContext () {
    const { parallaxController } = this
    return {parallaxController}
  }

  componentWillMount () {
    this.mounted = true

    // Don't initialize on the server
    const isServer = typeof window === 'undefined'

    if (!isServer) {
      // Must not be the server so kick it off...
      this.parallaxController = ScrollController.init()
    }
  }

  monitorHeight = () => {
    if (this.scrollbar && this.content) {
      const height = this.content.clientHeight
      if (height !== this.contentHeight) {
        this.contentHeight = height
        const atBottomLimit = this.scrollbar.offset.y === this.scrollbar.limit.y
        this.scrollbar.update()
        if (atBottomLimit) {
          this.scrollbar.setPosition(this.scrollbar.limit.x, this.scrollbar.limit.y)
        }
      }
    }
    if (this.mounted) requestAnimationFrame(this.monitorHeight)
  }

  scrollTop () {
    if (this.scrollbar && this.content) {
      this.scrollbar.scrollTo(0, 0, 600)
    }
  }


  componentDidMount () {
    const props = defaultsDeep({
      plugins: {
        staticContainer: {
          children: this.staticContainer
        }
      }
    }, this.props)

    this.scrollbar = SmoothScrollbar.init(this.container, props)

    this.scrollbar.addListener(this.handleScroll.bind(this))

    this.props.innerRef(this.scrollbar)

    if (this.parallaxController) {
      this.parallaxController.setContainer(this.container)
      this.parallaxController.setScrollbar(this.scrollbar)
    }

    if (window) {
      window.addEventListener('broadcast:scrolltop', this.scrollTop.bind(this), false)
    }
    
    requestAnimationFrame(this.monitorHeight)
  }

  componentWillReceiveProps (nextProps) {
    Object.keys(nextProps).forEach(key => {
      if (!key in this.scrollbar.options) {
        return
      }

      if (key === 'plugins') {
        Object.keys(nextProps.plugins).forEach(pluginName => {
          this.scrollbar.updatePluginOptions(
            pluginName,
            nextProps.plugins[pluginName]
          )
        })
      } else {
        this.scrollbar.options[key] = nextProps[key]
      }
    })
  }

  componentDidUpdate (prevProps) {
    this.scrollbar && this.scrollbar.update()
  }

  componentWillUnmount () {
    this.mounted = false
    if (this.scrollbar) {
      this.scrollbar.destroy()
    }
    this.scrollbar = null
    if (this.parallaxController) {
      this.parallaxController = this.parallaxController.destroy()
    }
  }

  handleScroll (status) {
    if (this.parallaxController) {
      this.parallaxController.onScroll(status)
    }
    if (this.props.onScroll) {
      this.props.onScroll(status, this.scrollbar)
    }
  }

  render () {
    const {damping, thumbMinSize, syncCallbacks, renderByPixels, alwaysShowTracks, continuousScrolling, plugins, onScroll, children, staticChildren, innerRef, ...props} = this.props

    return (
      <div className='scollbar__wrapper'>
        <div ref={ref => this.staticContainer = ref}>
          {staticChildren}
        </div>
        <div {...props} ref={ref => this.container = ref}>
          <div ref={ref => this.content = ref} className='scrollbar__content'>
            {children}
          </div>
        </div>
      </div>
    )

  // const count = React.Children.count(children)
  //
  // if (count === 1 && typeof children.type === 'string') {
  //   return React.cloneElement(children, {
  //     ...others,
  //     ref: node => (this.container = node)
  //   })
  // }
  //
  // return React.createElement(
  //   'div',
  //   {
  //     ...others,
  //     ref: node => (this.container = node),
  //     style: {
  //       WebkitBoxFlex: 1,
  //       msFlex: 1,
  //       MozFlex: 1,
  //       flex: 1
  //     }
  //   },
  //   React.createElement(
  //     'div',
  //     {
  //       className: 'scroll-content-inner'
  //     },
  //     children
  //   )
  // )
  }
}

export default Scrollbar
