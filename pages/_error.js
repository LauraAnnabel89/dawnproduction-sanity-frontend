import React from 'react'

export default class Error extends React.Component {

  render () {
    return (
      <section className='fullscreen error'>
        <div className='content'>
          <h1>Page not found!</h1>
          <p>
            Looks like you might be lost.
          </p>
        </div>
      </section>
    )
  }
}
