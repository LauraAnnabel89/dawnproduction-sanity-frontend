import Base from './_base'
import Meta from 'components/base/meta'
import Title from 'components/shared/title'
import Share from 'components/partials/share'
import Expandable from 'components/partials/expandable'
import Blocks from 'components/partials/blocks'
import Image from 'components/partials/image'
import ImageSet from 'components/partials/image-set'
import ImageGrid from 'components/partials/image-grid'
import Video from 'components/partials/video'
import PageRow from 'components/partials/page-row'
import Icon from 'components/shared/icon'
import Parallax from 'components/partials/parallax'
import { get, findIndex } from 'lodash'
import WorkHeader from 'components/partials/work-header'
import NextSeo from 'next-seo'
import { imageUrl } from 'lib/image'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const BASE_URL = publicRuntimeConfig && publicRuntimeConfig.baseUrl ? publicRuntimeConfig.baseUrl : 'http://localhost:3000'

export default class WorkSingle extends Base {

  static displayName = 'WorkSingle'

  static query = {
    all: `
      *[_type == "work"] | order(date desc) {
        _type,
        _id,
        slug,
        imageset(header),
        imageset(thumbnail)
      }
    `,
    current: `
      *[_type == "work" && slug.current == $slug] {
        _id,
        slug,
        title,
        client,
        category,
        header,
        navbar,
        intro,
        more,
        "content": content[] {
          ...,
          image{
            ...,
            "asset": asset->,
          },
        },
      }[0]
    `,
    pinned: `
      *[_type == "page" && slug.current == "ea9f91b2cda019730f2891bd12a7a4d6"] {
        _id,
        slug,
        title,
        "content": content[] {
          ...,
          slides[] {
            background[] {
              _type,
              "asset": asset->,
              crop,
              hotspot,
              hex
            },
            "linkInternal": linkInternal->,
            linkExternal,
            caption,
            subCaption,
            captionPosition,
            copy
          },
          internalLink {
            ...,
            "resolved": @-> {
              _type,
              title,
              name,
              slug,
            },
          },        
          link {
            ...,
            internalLink {
              ...,
              "resolved": @-> {
                _type,
                title,
                name,
                slug,
              },
            },
          },
          image{
            ...,
            "asset": asset->,
          },       
          clients[] {
            ...,
            "resolved": @-> {
              ...,
              image(logo),
              "caseStudy": caseStudy->
            }
          },
          "resolved": @->
        }
      }[0]    
    `
  }

  state = {
    infoExpanded: false
  }

  constructor (props) {
    super(props)
  }

  // static transitionConfig = {
  //   in: from => {
  //     switch (from) {
  //       case 'WorkSingle':
  //         return {
  //           name: 'slide',
  //           timeout: 500
  //         }
  //       case 'Work':
  //         return {
  //           name: 'slide-vertical',
  //           timeout: 500
  //         }
  //     }
  //   },
  //   out: to => {
  //     switch (to) {
  //       case 'WorkSingle':
  //         return {
  //           name: 'slide',
  //           timeout: 500
  //         }
  //       case 'Work':
  //         return {
  //           name: 'slide-vertical',
  //           timeout: 500
  //         }
  //     }
  //   }
  // }

  // instanceTransitionConfig = {
  //   out: (to, path) => {
  //     if (to === 'WorkSingle') {
  //       const pathParts = path.split('/')
  //       const nextSlug = pathParts.pop()
  //       const currentSlug = get(this.props, 'data.current.slug.current')
  //       const all = get(this.props, 'data.all', [])
  //
  //       const currentIndex = findIndex(all, {slug: { current: currentSlug }})
  //       const nextIndex = findIndex(all, {slug: { current: nextSlug }})
  //
  //       return {
  //         direction: nextIndex > currentIndex ? 1 : -1
  //       }
  //     }
  //   }
  // }

  onInfoClick() {
    this.setState(state => {
      const { infoExpanded } = this.state

      return {
        ...state,
        infoExpanded: !infoExpanded
      }
    })
  }  

  renderData (data) {
    if (!data) {
      return null;
    }

    const { all, current, pinned } = data
    const { _id, client, title, slug, header, intro, more } = current
    const { images } = header
    const { infoExpanded } = this.state

    const currentIndex = findIndex(all, {_id})

    // Roll work pages over from start
    let next = all[currentIndex + 1]
    if (!next) {
      next = all[0]
    }

    const contentCurrent = current.content || []
    const contentPinned = pinned.content || []

    let rowsCurrent = [{content: []}]

    contentCurrent.forEach(item => {
      if (item._type === 'row') {
        rowsCurrent.push({...item, content: []})
        return
      }
      rowsCurrent[rowsCurrent.length - 1].content.push(item)
    })

    rowsCurrent = rowsCurrent.filter(row => row.content.length)

    let rowsPinned = [{content: []}]

    contentPinned.forEach(item => {
      if (item._type === 'row') {
        rowsPinned.push({...item, content: []})
        return
      }
      rowsPinned[rowsPinned.length - 1].content.push(item)
    })

    rowsPinned = rowsPinned.filter(row => row.content.length)

    const description = intro[0].children[0].text
    const seoTitle = `Aesop Agency - Our Work / ${client}`
    const seoImage = images[0].poster ? imageUrl(images[0].poster) : imageUrl(images[0])

    return (
      <>
        <NextSeo
          config={{
            title: seoTitle,
            description,
            openGraph: {
              title: seoTitle,
              description,
              url: `${BASE_URL}/our-work/${slug.current}`,
              images: [
                {
                  url: seoImage,
                  alt: `Aesop Agency for ${title ? `${client} - ${title}` : client}`,
                },
              ],
            },
          }}
        />
        <section className={`page page__not-front page__work-single page__${slug.current}`}>
          <WorkHeader client={client} title={title} images={images} />
          <section className='section-row overflow pos-relative work-single__top-info'>
            <div className='container-fluid'>
              <div className='row'>
                <div className='col-xs-12 col-md-4'>
                  {client ? <h1><strong>{client}</strong></h1> : null}
                  {/* {title ? <h3><strong>{title}</strong></h3> : null} */}
                </div>
                {intro ? 
                  <div className='col-xs-12 col-md-8 work-single__intro-copy'>
                    {
                      intro.map(child => {
                        const { _key } = child
                        return <Blocks key={_key} content={child} />
                      })
                    }
                  </div>
                : null}
              </div>
              {more ? 
                <>
                  <div className='row end-md'>
                    <div className='col-xs-12 col-md-8 work-single__overview-expand'>
                      <div className={`work-single__overview-expand-link work-single__overview-expand-link--${infoExpanded ? 'rotated' : 'normal'}`} onClick={() => this.onInfoClick()}>
                        <span>More info</span>
                        <Icon cross />
                      </div>
                    </div>
                  </div>

                  <Expandable expanded={infoExpanded}>
                    <div className='row end-md'>
                      <div className='text-left col-xs-12 col-md-8'>
                        {
                          more.map(child => {
                            const { _key } = child
                            return <Blocks key={_key} content={child} />
                          })
                        }
                      </div>
                    </div>
                  </Expandable>
                </>
              : null}
            </div>
          </section>
          {rowsCurrent.map((row, i) => <PageRow key={row._key || `row-current-${i}`} {...row} />)}
          <Title className='page-title__bottom' next={next} />
          {rowsPinned.map((row, i) => <PageRow key={row._key || `row-pinned-${i}`} {...row} />)}
        </section>
      </>
    )
  }
}
