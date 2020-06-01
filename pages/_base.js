import React from 'react'
import sanity from 'lib/sanity'
import { isFunction, isObject, mapValues } from 'lodash'

const formatQuery = query => {
  let _query = query

  _query = _query.replace(/image\(\s?([^\s]+)\s?\)(?:\s?\{(.*?)\})?/sg, (str, key, extra) => {
    const fields = [
      '"asset": asset->',
      'crop',
      'hotspot'
    ]
    if (extra) fields.push(extra.replace(/\s+/gs, ' ').trim())
    return `${key} { ${fields.join(', ')} }`
  })

  _query = _query.replace(/imageset\(\s?([^\s]+)\s?\)(?:\s?\{(.*?)\})?/sg, (str, key, extra) => {
    const fields = [
      '"asset": asset->',
      'crop',
      'hotspot'
    ]
    if (extra) fields.push(extra.replace(/\s+/gs, ' ').trim())
    return `${key} { images[] { ${fields.join(', ')} }, duration }`
  })

  return _query
}

async function fetchQuery (query, params) {
  return sanity.fetch(formatQuery(query), params)
}

async function fetchQueries (queries, params) {
  const data = {}
  return Promise.all(Object.keys(queries).map(async (key) => {
    const qData = await fetchQuery(queries[key], params)
    data[key] = qData
  })).then(() => data)
}

export default class Base extends React.Component {

  static query = ''
  static queryParams = req => req.query

  static async getInitialProps (req) {
    const { queryParams, query } = this
    const params = isFunction(queryParams) ? queryParams(req) : queryParams
    if (isObject(query)) {
      return {
        data: await fetchQueries(query, params)
      }
    } else {
      return {
        data: await fetchQuery(query, params)
      }
    }
  }

  renderData (data) {}

  render () {
    return this.renderData(this.props.data)
  }

}
