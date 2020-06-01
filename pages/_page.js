import Base from './_base'
import PageRow from 'components/partials/page-row'

export default class Page extends Base {

  static query = `
    *[_type == "page" && slug.current == $slug] {
      _id,
      slug,
      title,
      navbar,
      "content": content[] {
        ...,
        markDefs[] {
          ...,
          "resolved": reference-> {
            _type,
            client,      
            title,
            slug,     	
          },
        },
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
        link {
          ...,
          "resolved": @->,
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
        internalLink {
          ...,
          "resolved": @-> {
            _type,
            title,
            name,
            slug,
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
    return (
      <section className={`page page__${slug.current}`}>
        {rows.map((row, i) => <PageRow key={row._key} {...row} />)}
      </section>
    )
  }

}
