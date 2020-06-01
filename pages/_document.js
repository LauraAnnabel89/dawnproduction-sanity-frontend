import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {

  render () {
    return (
      <html>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
        <link rel='icon' type='image/x-icon' href='/static/favicon.ico' />
        <meta name='description' content='We use narrative thinking to unlock powerful creative strategies that turn your brand into a commercial success story.' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
      </html>
    )
  }

}
