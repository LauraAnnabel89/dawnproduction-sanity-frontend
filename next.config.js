const withSass = require('@zeit/next-sass')
const withCss = require('@zeit/next-css')
const withTM = require('next-transpile-modules')
const path = require('path')

module.exports = withSass(withCss(withTM({
  transpileModules: ['react-versatile-carousel'],
  cssModules: false,
  sassLoaderOptions: {
    includePaths: ['assets', 'node_modules'],
  },
  publicRuntimeConfig: {
    baseUrl: process.env.BASE_URL,
  },  
  webpack: function (config, { isServer }) {
    config.resolve.alias['TweenLite'] = path.resolve('node_modules', 'gsap/src/minified/TweenLite.min.js')
    config.resolve.alias['TweenMax'] = path.resolve('node_modules', 'gsap/src/minified/TweenMax.min.js')
    config.resolve.alias['TimelineLite'] = path.resolve('node_modules', 'gsap/src/minified/TimelineLite.min.js')
    config.resolve.alias['TimelineMax'] = path.resolve('node_modules', 'gsap/src/minified/TimelineMax.min.js')
    config.resolve.alias['ScrollMagic'] = path.resolve('node_modules', 'scrollmagic/scrollmagic/minified/ScrollMagic.min.js')
    config.resolve.alias['animation.gsap'] = path.resolve('node_modules', 'scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js')
    config.resolve.alias['debug.addIndicators'] = path.resolve('node_modules', 'scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js')

    config.resolve.alias.routes = path.resolve(__dirname, 'routes.js')
    config.resolve.alias.components = path.resolve(__dirname, 'components')
    config.resolve.alias.lib = path.resolve(__dirname, 'lib')

    const originalEntry = config.entry
    config.entry = async () => {
      const entries = await originalEntry()

      if (entries['main.js'] && !entries['main.js'].includes('./client/polyfills.js')) {
        entries['main.js'].unshift('./client/polyfills.js')
      }

      return entries
    }

    return config
  }
})))
