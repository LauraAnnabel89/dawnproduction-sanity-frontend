import sanityClient from '@sanity/client'

export default sanityClient({
  projectId: 'qpu2wjya',
  dataset: 'production',
  useCdn: true
})
