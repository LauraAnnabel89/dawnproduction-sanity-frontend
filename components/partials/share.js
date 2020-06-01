import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'next/router'

const format = (quote, info, limit) => {
  let formatted = quote + ' - ' + info
  // find out if quote and info is larger than limit
  if (formatted.length > 280) {
    // if it is get info length and subtract that and anything over 283 and add ...
    formatted = (quote.substring(0, (280 - ('... - ' + info).length)))
      + '... - ' + info
  }

  return formatted
}

class Share extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string
  }

  static defaultProps = {
    title: '',
    description: ''
  }

  getPath () {
    const { router } = this.props
    return router.asPath
  }

  onClick = (url, referrer) => e => {
    const { title, description } = this.props
    const path = this.getPath()

    // Prevent default anchor event
    e.preventDefault()

    // Set values for window
    var width = '500'
    var height = '400'
    var resize = 'no'
    const params = 'width=' + width + ',height=' + height + ',resizable=' + resize

    const urlParams = (referrer === 'linkedIn')
      ? `?url=https%3A%2F%2Faesopagency.com${path}&amp;title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description.substring(0, 150))}&amp;source=https%3A%2F%2Faesopagency.com${path}`
      : `?text=${encodeURIComponent(format(description, title + ' - https://aesopagency.com' + path))}&url='https://aesopagency.com${path}'`

    return window.open(`${url}${urlParams}`, 'Share', params).focus()
  }

  render () {
    const { description, router } = this.props
    const path = this.getPath()

    return (
      <ul className='sharing--links'>
        <li>
          <a
            className='resp-sharing-button__link'
            target='_blank'
            href={`https://twitter.com/intent/tweet/?text=${description}&url=${path}`}
            rel='noopener'
            onClick={this.onClick('https://twitter.com/intent/tweet/', 'twitter')}>
            <div className='resp-sharing-button resp-sharing-button--twitter resp-sharing-button--small'>
              <div aria-hidden='true' className='resp-sharing-button__icon resp-sharing-button__icon--solid'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                  <path d='M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z'
                  /> </svg>
              </div>
            </div>
          </a>
        </li>
        <li>
          <a
            className='resp-sharing-button__link'
            target='_blank'
            href='https://www.linkedin.com/shareArticle?mini=true&url=http%3A%2F%2Fsharingbuttons.io&amp;title=Super%20fast%20and%20easy%20Social%20Media%20Sharing%20Buttons.%20No%20JavaScript.%20No%20tracking.&amp;summary=Super%20fast%20and%20easy%20Social%20Media%20Sharing%20Buttons.%20No%20JavaScript.%20No%20tracking.&amp;source=http%3A%2F%2Fsharingbuttons.io'
            rel='noopener'
            onClick={this.onClick('https://www.linkedin.com/shareArticle?mini=true', 'linkedIn')}>
            <div className='resp-sharing-button resp-sharing-button--linkedin resp-sharing-button--small'>
              <div aria-hidden='true' className='resp-sharing-button__icon resp-sharing-button__icon--solid'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                  <path d='M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z'
                  /> </svg>
              </div>
            </div>
          </a>
        </li>
      </ul>
    )
  }
}

export default withRouter(Share)
