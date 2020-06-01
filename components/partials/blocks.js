import React from 'react'
import PropTypes from 'prop-types'
import BlockContent from '@sanity/block-content-to-react'
import { mapValues, mapKeys } from 'lodash'

// Types/Styles
import ParagraphSerializer from './serializers/paragraph'
import ListSerializer from './serializers/list'
import ListItemSerializer from './serializers/listItem'
// import BlockquoteSerializer from './serializers/blockquote'

// Types/Block components
import ReferenceSerializer from './serializers/reference'
import SeparatorSerializer from './serializers/separator'
import MapSerializer from './serializers/map'
import ClientGridSerializer from './serializers/client-grid'
import ImageSerializer from './serializers/image'
import GallerySerializer from './serializers/gallery'
import ImageGridSerializer from './serializers/image-grid'
import ImageSetSerializer from './serializers/image-set'
import ChartSerializer from './serializers/chart'
import ReactComponentSerializer from './serializers/reactcomponent'
import VideoSerializer from './serializers/video'
import HeadingSerializer from './serializers/heading'
import ImageLinkSerializer from './serializers/image-link'
import VideoLinkSerializer from './serializers/video-link'

// Marks/Text Decorators
import UppercaseSerializer from './serializers/uppercase'
import HighlightSerializer from './serializers/highlight'
import SmallSerializer from './serializers/small'
import LinkSerializer from './serializers/link'

const SERIALIZERS = {
  types: {
    // block: ParagraphSerializer,
    // blockquote: BlockquoteSerializer
    reference: ReferenceSerializer,
    separator: SeparatorSerializer,
    map: MapSerializer,
    clientGrid: ClientGridSerializer,
    image: ImageSerializer,
    gallery: GallerySerializer,
    imageGrid: ImageGridSerializer,
    imageSet: ImageSetSerializer,
    chart: ChartSerializer,
    reactComponent: ReactComponentSerializer,
    video: VideoSerializer,
    heading: HeadingSerializer,
    imageLink: ImageLinkSerializer,
    videoLink: VideoLinkSerializer,
  },
  marks: {
    small: SmallSerializer,
    uppercase: UppercaseSerializer,
    highlight: HighlightSerializer,
  },
  list: ListSerializer,
  listItem: ListItemSerializer,
}

export default class Blocks extends React.Component {

  static propTypes = {
    content: PropTypes.any,
  }

  static defaultProps = {
    content: {},
  }

  render () {
    const { content } = this.props

    if (content.style) {
      switch(content.style) {
        case 'bigger':
        case 'clients':
          SERIALIZERS.types.block = ParagraphSerializer
          break;
        default:
          delete SERIALIZERS.types.block
          break;
      }
    }
    
    if (content.markDefs && content.markDefs.length > 0 && content.markDefs[0]._type === 'link') {
      SERIALIZERS.types.block = LinkSerializer
    }

    return (
      <BlockContent className='blocks__multiple' blocks={content} serializers={SERIALIZERS} />
    )
  }

}
