import Base from './_base'
import PageRow from 'components/partials/page-row'
import MapSerializer from 'components/partials/serializers/map'
import NextSeo from 'next-seo'

export default class About extends Base {

  static query = `
    *[_type == "page" && slug.current == "about"] {
      _id,
      slug,
      title,
      navbar,
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
        image {
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

  renderData (data) {
    if (!data) {
      return null;
    }

    const { title, slug, content = [] } = data

    let rows = [{content: []}]

    content.forEach(item => {
      if (item._type === 'row') {
        rows.push({...item, content: []})
        return
      }
      rows[rows.length - 1].content.push(item)
    })

    rows = rows.filter(row => row.content.length)

    const mapNode = {
      location: {
        lat: 51.5243335,
        lng: -0.0870439,
      },
      zoom: 17,
      height: 700,
    };

    return (
      <>
        <section className={`page page__${slug.current}`}>
          {rows.map((row, i) => <PageRow key={row._key} {...row} />)}
        </section>

        <section className='section-map container-fluid'>
          <div className='row'>
            <div className='col-xs-12 col-md-4 between-xs column'>
              <div className='top-xs'>
                <p>
                  <strong>General enquiries</strong><br/>
                  <a href='mailto:tortoise@thestorymakers.com'>tortoise@thestorymakers.com</a>
                </p> 
                
                <p>
                  <strong>New business</strong><br/>
                  <a href='mailto:newbiz@thestorymakers.com'>newbiz@thestorymakers.com</a>
                </p> 
                
                <p>
                  <strong>Careers</strong><br/>
                  <a href='mailto:careers@thestorymakers.com'>careers@thestorymakers.com</a>
                </p>
              </div>
            </div>


            <div className='col-xs-12 col-md-8'>
              <MapSerializer node={mapNode} />
            </div>
          </div>
        </section>
      </>
    )
  }

}
