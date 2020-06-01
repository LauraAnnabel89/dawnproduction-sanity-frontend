import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import anime from 'animejs'
import VisibilitySensor from 'react-visibility-sensor'
import { set } from 'react-ga'

export default class Heading extends React.Component {

  static propTypes = {
    heading: PropTypes.any,
    lettering: PropTypes.any,
    weight: PropTypes.string,
    capitalize: PropTypes.string,
    text: PropTypes.string.isRequired
  }

  static defaultProps = {
    played: false
  }

  constructor(props) {
    super(props)
    // create a ref to store the textInput DOM element
    this.dom = React.createRef()
    this.played = false
    this.timeout = null
  }



  renderText = (text, lettering, _key) => {    
    if (lettering) {
      // Wrap every word and every letter in a span
      const words = text.split(' ')

      return words.map((word, index) => {
        const letters = word.split('')
        const id = word.replace(/\W/g,'_')
        return (
          <Fragment key={`word-${_key}-${id}-${index}`}>
            <span className='word'>
              {letters.map((letter, index) => <span key={`letter-${_key}-${id}-${letter}-${index}`} className='letter'>{letter}</span>)}
            </span>
            {' '}
          </Fragment>
        )
      })
    }

    return text.split('\n').map(function(item, key) {
      return (
        <span key={key}>
          {item}
          <br/>
        </span>
      )
    })
  }

  onChange = (isVisible) => {
    const { lettering, paused } = this.props

    if (!lettering || paused) {
      return;
    }

    if (isVisible && !this.played) {
      const letters = this.dom.current.querySelectorAll('.letter')

      this.timeout = setTimeout(() => {
        anime({
          targets: letters,
          translateY: '0%',
          opacity: 1,
          delay: anime.stagger(15),
        })
      }, 750)

      this.played = true
    }
  }

  componentDidMount() {
    const { lettering, paused } = this.props

    if (lettering && !paused) {
      const letters = this.dom.current.querySelectorAll('.letter')

      anime.set(letters, {
        translateY: '100%',
        opacity: 0,
      })
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
    this.timeout = null
  }

  render () {
    const { heading, _key, text, lettering, weight, capitalize, size, fluid, show, paused } = this.props
    const classes = [
      'heading-component',
      lettering ? 'lettering' : undefined,
      paused ? 'lettering-paused' : undefined,
      weight ? `font-${weight}` : undefined,
      capitalize ? `text-${capitalize}` : undefined,
      size ? `size-${size}` : undefined,
      fluid ? `size-fluid` : undefined,
      show ? show : undefined,
    ].join(' ').trim()

    const HeadingTag = heading || 'h1'

    return (
      <VisibilitySensor key={_key} active={lettering} onChange={this.onChange}>
        <HeadingTag
          key={_key}
          className={classes}
          ref={this.dom}
        >
          {this.renderText(text, lettering, _key)}
        </HeadingTag>
      </VisibilitySensor>
    )
  }

}
