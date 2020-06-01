import React from 'react'
import Image from 'components/partials/image'
import Blocks from 'components/partials/blocks'
import Parallax from 'components/partials/parallax'

export default class ProfileReferenceSerializer extends React.Component {

  render () {
    const { name, position, summary, description, image, social } = this.props

    const title = [
      name
    ].filter(o => !!o)

    const wrapName = name => {
      if (social && social.length && social.length === 1) {
        return (
          <a href={social[0].url} target='_blank'>
            {name}
          </a>
        )
      }
      return name
    }

    return (
      <div className='profile'>
        <div className='profile__inner'>
          <div className='profile__image-wrapper'>
            {image && (
             <Parallax direction='vertical' amount={20}>
               <div className='profile__image'>
                 <Image src={image} width={400} height={500} />
               </div>
             </Parallax>
             ) || null}
          </div>
          <div className='profile__description-wrapper'>
            <div className='profile__summary'>
              {title.length && wrapName(<h3>{title.join(', ')}</h3>) || null}
              {position && <h4 className='profile__summary-position'>{position}</h4> || null}
              {summary && (
               <p className='profile__summary-blurb'>
                 {summary}
               </p>
               ) || null}
            </div>
            <div className='profile__description'>
              <Blocks content={description} />
            </div>
            {social && social.length && social.length > 1 && (
             <div className='profile__social'>
               {social.map((socialItem, i) => (
                  <a
                    key={i}
                    href={socialItem.url}
                    target='_blank'
                    className='button button--filled'>
                    {socialItem.title || socialItem.url}
                  </a>
                ))}
             </div>
             ) || null}
          </div>
        </div>
      </div>
    )
  }

}
