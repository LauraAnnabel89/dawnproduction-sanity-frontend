const express = require('express')
const next = require('next')
const routes = require('./routes')

const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handler = routes.getRequestHandler(app)

const bodyParser = require('body-parser')

const PORT = dev ? 3000 : 80

app.prepare()
  .then(() => {
    const server = express()

    server.get('/api/details/', require('./api/details'))
    server.post('/api/contact/post/', bodyParser.json(), require('./api/contact'))

    server.use(handler)
    server.listen(PORT, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${PORT}`)
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
