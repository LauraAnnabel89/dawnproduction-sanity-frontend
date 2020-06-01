import React, {Component} from 'react'
import Parallax from 'components/partials/parallax'
import Image from 'components/partials/image'
import Video from './video'

export default class WorkHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true
    }
  }

  componentDidMount() {
    const { sessionStorage } = window 
    const currentVisit = sessionStorage.getItem('currentVisit')
    
    const timeout = !currentVisit ? 2500 : 0

    setTimeout(() => {
      this.setState({
        visible: true
      })
    }, timeout)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
    this.interval = null
  }

  renderTitle() {
    const { client, title } = this.props

    return (
      <div className="image-grid__image-overlay">
        {client ? <h1 className="work-header__client font-700"><span>{client}</span></h1> : null}
        {title ? <h2 className="work-header__title font-200"><span>{title}</span></h2> : null}
      </div>
    );
  }

  renderHero(asset) {
    const { _type, url, poster } = asset

    if (_type === 'video') {
      return <Video url={url} poster={poster} autoplay muted loop />
    }

    if (_type === 'image') {
      return <Image src={asset} />
    }

    return null
  }

  render () {
    const { images } = this.props
    const { visible } = this.state
    const media = images.asset ? images : images[0]

    return (
      <section className={`section-row work-header work-header__${visible ? 'visible' : 'not-visible'}`}>
        <Parallax amount={600} pixels direction='vertical' offset={0}>
          <div className="image-grid w-100">
            <div className="image-grid__inner">
              {media ? this.renderHero(media) : null}
            </div>
          </div>
        </Parallax>
      </section>
    )
  }
}
