import React, { Component, Fragment } from 'react'
import { buildUrl } from 'react-instafeed'
 
import fetch from 'isomorphic-fetch'
import Image from 'components/partials/image'
 
const OPTS = {
  accessToken: '6536562159.f8a352d.78830edd71b146588974f32a87e0fd4e',
  clientId: 'f8a352d43a8a44fc9b8fb265207d927f',
  get: 'user',
  resolution: 'standard_resolution',
  sortBy: 'most-recent',
  tagName: null,
  userId: '6536562159',
}

export default class Instagram extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      error: false,
      json: false,
    }
  }

  componentDidMount() {
    const url = 'https://instagram.com/aesop.agency/?__a=1' //buildUrl(OPTS)

    fetch(url)
      .then(res => res.json())
      .then(json => {
        this.setState((state) => ({ ...state, loading: false, json }))
      })
      .catch(error => {
        this.setState((state) => ({ ...state, loading: false, error }))
      })
  }

  render() {
    const { loading, error, json } = this.state
    const { data } = json
    // const { images } = data[0]

    return (
      <Fragment>
        {loading && <p>Loading</p> || null}
        {data && <img src={data[1].images.standard_resolution.url} /> || null}
      </Fragment>
    )
  }
}
