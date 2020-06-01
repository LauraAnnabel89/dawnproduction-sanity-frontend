import React from 'react'
import ReactPlayer from 'react-player'
import screenfull from 'screenfull'
import { findDOMNode } from 'react-dom'
import { isString } from 'lodash'
import { imageUrl } from 'lib/image'

const PLAYER_OPTIONS = {
  vimeo: {
    playerOptions: {
      byline: false,
      portrait: false,
      title: false,
      color: 'ffffff'
    }
  }
}

export default class Video extends React.Component {

  state = {
    playing: false,
    started: false,
    fullscreen: false,
  }

  player = null

  componentDidMount() { 
  }

  onPlayClick = e => {
    this.setState(state => ({...state, playing: true, started: true}))
  }

  onPauseClick = e => {
    this.setState(state => ({...state, playing: false}))
  }

  onEnded = () => {
    const { isFullscreen } = screenfull
    this.setState(state => ({...state, playing: false, started: false}))

    // Disable the fullscreen automatically if the video has finished
    // playing, otherwise it gets stuck to a black screen.
    if (isFullscreen) {
      this.toggleFullscreen()
    }
  }

  toggleFullscreen = () => {
    const { playing } = this.state
    const { isEnabled, isFullscreen } = screenfull

    if (this.player && isEnabled) {
      const element = findDOMNode(this.player)

      if (!isFullscreen) {
        screenfull.request(element)
        this.setState(state => ({...state, fullscreen: true}))
        
        // Issue an automatic play if we are clicking on the fullscreen and it isn't played
        if (!playing) {
          this.onPlayClick()
        }
      } else {
        screenfull.exit(element)
        this.setState(state => ({...state, fullscreen: false}))
      }
    }
  }

  renderPlayPauseButton = (type) => {
    return (
      <div className='video-button-wrapper'>
        <div className='video-button-inner' onClick={type === 'pause' ? this.onPauseClick : this.onPlayClick}>
          <div className='video-button-icon-wrapper'>
            <div className={`video-button-icon-${type}`} />
          </div>
        </div>
      </div>
    )
  } 

  renderFullscreenButton = () => {
    const { isFullscreen, isEnabled } = screenfull

    if (isEnabled) {
      return <div className={`video-button-fullscreen ${isFullscreen ? 'is-fullscreen' : 'is-window'}`} onClick={this.toggleFullscreen}></div>
    } else {
      return null
    }
  }

  ref = player => {
    this.player = player
  }

  render () {
    const { poster, url, autoplay, muted, loop, ratio } = this.props
    const { playing, started } = this.state
    if (!url) return null

    if (autoplay) {
      PLAYER_OPTIONS.vimeo.playerOptions.background = true
      PLAYER_OPTIONS.vimeo.playerOptions.autoplay = true
      PLAYER_OPTIONS.vimeo.playerOptions.loop = true
      PLAYER_OPTIONS.vimeo.preload = true

      if (this.player && !playing) {
        this.state.playing = true
      }
    }

    let volume = 0
    if (playing) {
      volume = 1
    }

    const paddingTop = ratio && isString(ratio) ? ratio : `${ratio || 56.25}%`
    const maxHeight = `${parseInt(ratio) || 56.25}vw`
    const posterBg = imageUrl(poster)    
    return (

      <div className={`video video--${poster ? 'poster' : 'no-poster'} video--${autoplay ? 'autoplay' : 'no-autoplay'}`} style={{maxHeight, overflow: 'hidden'}}>
        <div className='video__inner' style={{ paddingTop }}>
          <div className={`video__inn__cont video-${playing ? 'playing' : 'stopped'}`} style={{visibility: autoplay ? 'visible' : started ? 'visible' : 'hidden'}}>
            <ReactPlayer
              url={url}
              ref={this.ref}
              autoPlay={autoplay}
              loop={loop || autoplay}
              muted={muted || autoplay}
              volume={this.player ? volume : 0}
              playing={playing}
              onEnded={this.onEnded}
              config={PLAYER_OPTIONS} />
          </div>
          {!playing && (
            <div className='video__poster'>
              <>
                {(poster && !started) && (
                  <div className='video__poster-custom' style={posterBg ? {backgroundImage: `url(${posterBg}?q=60)`} : {}}></div>
                ) || null}
                {this.renderPlayPauseButton('play')}
                {this.renderFullscreenButton()}
              </>
            </div>
          ) || (
            <div className='video__poster'>
              {!autoplay ? (
              <>
                {this.renderPlayPauseButton('pause')}
                {this.renderFullscreenButton()}
              </>
              ) : null}
            </div>
          )}

          {autoplay && <div className='video__poster'></div> || null}
        </div>
      </div>

    )
  }

}
