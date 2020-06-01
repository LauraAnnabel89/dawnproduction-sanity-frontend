import Base from './_base'
import Meta from 'components/base/meta'
import Title from 'components/shared/title'
import Blocks from 'components/partials/blocks'
import Share from 'components/partials/share'
import Image from 'components/partials/image'
import PageRowFlat from 'components/partials/page-row-flat'
import Parallax from 'components/partials/parallax'
import WorkHeader from 'components/partials/work-header'

import moment from 'moment'
import { findIndex } from 'lodash'

export default class JournalSingle extends Base {

  static displayName = 'JournalSingle'

  static query = {
    all: `
      *[_type == "post"] | order(published desc) {
        _type,
        _id,
        slug,
        image(header)
      }
    `,
    current: `
      *[_type == "post" && slug.current == $slug] {
        _id,
        title,
        header,
        "author": author->,
        published,
        intro,
        body[] {
          ...,
          "asset": asset->,
          hotspot,
          crop
        },
        outro
      }[0]
    `
  }

  static transitionConfig = {
    in: from => {
      switch (from) {
        case 'JournalSingle':
          return {
            name: 'slide',
            timeout: 500
          }
        case 'Journal':
          return {
            name: 'slide-vertical',
            timeout: 500
          }
      }
    },
    out: to => {
      switch (to) {
        case 'JournalSingle':
          return {
            name: 'slide',
            timeout: 500
          }
        case 'Journal':
          return {
            name: 'slide-vertical',
            timeout: 500
          }
      }
    }
  }

  getTransitionConfig = () => {
    return 'test'
  }

  renderData (data) {
    const { all, current } = data
    const { _id, title, author, header, published, intro, body, outro } = current

    const currentIndex = findIndex(all, {_id})
    const previous = all[currentIndex - 1]
    const next = all[currentIndex + 1]

    const subtitle = []
    if (author) subtitle.push(author.name)
    if (published) subtitle.push(moment(published).format('Do MMM Y'))

    return (
      <div className='page-journal-single-view'>
        <Meta title={title} />
        {header && (
          <>
            <WorkHeader images={header} />
            {/* <PageRowFlat height='auto'>
              <Image src={header} width={2560} height={1440} />
            </PageRowFlat> */}
          </>
         ) || null}
        {intro && (
         <PageRowFlat content={intro} height='auto' />
         ) || null}
        {body && (
         <PageRowFlat
           className='page-row__journal-single-content'
           content={body}
           theme='grey'
           height='auto' />
         ) || null}
        {outro && (
         <PageRowFlat content={outro} height='auto' />
         ) || null}
        <div className='journal-share'>
          <Share title={title} />
        </div>
      </div>
    )
  }

}
