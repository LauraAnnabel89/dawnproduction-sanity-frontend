import { Fragment } from 'react'
import Base from './_base'
import Grid from 'components/shared/grid'
import Image from 'components/partials/image'
import { Link } from 'routes'
import moment from 'moment'

export default class Journal extends Base {

  static displayName = 'Journal'

  static query = `
    *[_type == "post"] | order(published desc) {
      _id,
      title,
      slug,
      "author": author->,
      image(header),
      published
    }
  `

  static transitionConfig = {
    in: from => {
      switch (from) {
        case 'JournalSingle':
          return {
            name: 'fade',
            timeout: 500
          }
      }
    },
    out: to => {
      switch (to) {
        case 'JournalSingle':
          return {
            name: 'fade',
            timeout: 500
          }
      }
    }
  }

  renderJournal = journal => {
    const { slug, title, author, header, published } = journal
    const content = (
    <Fragment>
      <div className='journal-grid__journal-image'>
        {header && <Image src={header} width={1248} height={702} /> || null}
      </div>
      <div className='journal-grid__journal-meta'>
        <h3>{title}</h3>
        <h4>{author && author.name}</h4>
        <h5>{published && moment(published).format('Do MMM Y')}</h5>
      </div>
    </Fragment>
    )
    return (
      <Link route='post' params={{slug: slug.current}}>
      <a className='journal-grid__journal'>
        {content}
      </a>
      </Link>
    )
  }

  renderData (data) {
    return (
      <div className='page-wrapper'>
        <div className='page-row__content'>
          <Grid type='journal' items={this.props.data} renderItem={this.renderJournal} />
        </div>
      </div>
    )
  }

}
