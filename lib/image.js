import sanity from './sanity'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(sanity)

export function imageUrl (src) {
  if (!src) return null
  return builder.image(src)
}
