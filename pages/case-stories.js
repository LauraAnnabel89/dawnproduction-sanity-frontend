import { Fragment } from 'react'
import Base from './_base'
import Grid from 'components/shared/grid'
import Image from 'components/partials/image'
import ImageSet from 'components/partials/image-set'
import { Link } from 'routes'

export default class Work extends Base {

  static displayName = 'Work'

  static query = `
    *[_type == "work"] | order(client asc) {
      _id,
      title,
      client,
      slug,
      header,
      thumbnail
    }
  `

  static transitionConfig = {
    in: from => {
      switch (from) {
        case 'WorkSingle':
          return {
            name: 'fade',
            timeout: 500
          }
      }
    },
    out: to => {
      switch (to) {
        case 'WorkSingle':
          return {
            name: 'fade',
            timeout: 500
          }
      }
    }
  }

  renderProject = project => {
    const { slug, title, client, header, thumbnail } = project
    const _thumb = thumbnail || header

    return (
      <Link key={slug.current} route='work' params={{slug: slug.current}}>
        <a className='col-xs-12 work--client-link'>
          {client}
        </a>
      </Link>
    )
  }


  renderData (data) {
    
    return (
      <section className='page page__our-work'>
        <section className='section-row page-row__type-default page-row__theme-default'>
          <div className='container-fluid'>
            <div className='row'>
              {data.map((item) => {
                return this.renderProject(item)
              })}
            </div>
          </div>
        </section>
      </section>
    )
  }

}
