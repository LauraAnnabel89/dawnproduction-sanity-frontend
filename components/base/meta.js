import { Component } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { withRouter } from 'next/router'
import { startCase, toLower, concat, flatten } from 'lodash'
import getConfig from 'next/config'
import NextSeo from 'next-seo'

const { publicRuntimeConfig } = getConfig()
const BASE_URL = publicRuntimeConfig && publicRuntimeConfig.baseUrl ? publicRuntimeConfig.baseUrl : 'http://localhost:3000'

class Meta extends Component {

  static propTypes = {
    router: PropTypes.object.isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  }

  static defaultProps = {
    title: []
  }

  render () {
    const { router, title } = this.props
    const { route, asPath } = router

    const _title = concat(['Aesop Agency'], flatten([title]))

    if (route && route !== '' && route !== '/') {
      _title.push(startCase(toLower(asPath.split('/')[1])))
    }

    if (route && route !== '' && route === '/') {
      _title.push('An independent, story-first approach can deliver on the promise of true integration.')
    }

    const seoTitle = _title.join(' - ')
    const description  = 'We use narrative thinking to unlock powerful creative strategies that turn your brand into a commercial success story.'


    return (
      <Head>
        <NextSeo
          config={{
            title: seoTitle,
            description,
            openGraph: {
              type: 'website',
              title: seoTitle,
              description,
              site_name: 'Aesop Agency',
              url: `${BASE_URL}${route}`,
              images: [
                {
                  url: `${BASE_URL}/static/logo-opengraph.png`,
                  width: '1080',
                  height: '1080',
                  alt: `Aesop Agency`,
                },
              ],
            },
            twitter: {
              handle: '@aesopagency',
              site: '@aesopagency',
              cardType: 'summary_large_image',
            },
          }}
        />

        <meta property='fb:app_id' content='2217653378534404' />

        <link rel="apple-touch-icon" sizes="180x180" href={`${BASE_URL}/static/apple-touch-icon.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${BASE_URL}/static/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${BASE_URL}/static/favicon-16x16.png`} />
        <link rel="manifest" href={`${BASE_URL}/static/site.webmanifest`} />
        <link rel="mask-icon" href={`${BASE_URL}/static/safari-pinned-tab.svg`} color="#0000ff" />
        <link rel="shortcut icon" href={`${BASE_URL}/static/favicon.ico`} />
        <meta name="msapplication-TileColor" content="#0000ff" />
        <meta name="msapplication-config" content={`${BASE_URL}/static/browserconfig.xml`} />
        <meta name="theme-color" content="#ffffff" />
      </Head>
    )
  }

}

export default withRouter(Meta)
