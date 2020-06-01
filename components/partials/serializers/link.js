import React from 'react'
import { find } from 'lodash'
import { Link } from 'routes'

import ParagraphSerializer from './paragraph'

export default class LinkSerializer extends React.Component {

  renderChild(child, markDefs, _key) {    
    const { marks, text } = child;

    if (!text || text === '') {
      return null
    }

    let finalChild = text;

    for (let index = marks.length - 1; index >= 0; index--) {
      const mark = marks[index]
      const linkedMark = find(markDefs, ['_key', mark])

      // The linked mark is a link, 
      if (linkedMark && linkedMark._type === 'link') {
        const { resolved, href, _key: internalKey } = linkedMark
        if (href) {
          finalChild = <a key={`${_key}-${internalKey}-${index}`} className='external-link' rel='nofollow noopener noreferrer' target='_blank' href={href}>{finalChild}</a>
        } else {
          finalChild = <Link key={`${_key}-${internalKey}-${index}`} route={resolved._type} params={{slug: resolved.slug.current}}>
            <a>{finalChild}</a>
          </Link>
        }
      } else {
        switch(mark) {
          case 'strong':
            finalChild = <strong key={`${_key}-${index}`}>{finalChild}</strong>
            break;
          case 'em':
            finalChild = <em key={`${_key}-${index}`}>{finalChild}</em>
            break;
          case 'uppercase':
            finalChild = <span key={`${_key}-${index}`} className='text-uppercase'>{finalChild}</span>
            break;
          case 'highlight':
            finalChild = <span key={`${_key}-${index}`} className='text-highlight'>{finalChild}</span>
            break;            
        }
      }
    }

    return finalChild
  }

  render () {
    const { node } = this.props
    const { children, markDefs, style, _key } = node

    return (
      <ParagraphSerializer node={{style}}>
        {
          children.map(child => this.renderChild(child, markDefs, _key))
        }
      </ParagraphSerializer>
    )
  }

}
