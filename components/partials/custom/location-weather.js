import React, { Component } from 'react'
import fetch from 'isomorphic-fetch'
import Heading from '../heading'


export default class LocationWeather extends Component {
  constructor(props) {
    super(props)
    this.city = null
    this.weather = null
  }
  
  getWeatherInfo = async () => {
    const ip = await fetch('https://api.ipify.org?format=json')
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("Bad response from server")
        }
        return response.json()
      })
      .then((data) => {
        return data.ip
      })

    const city = await fetch(`http://ip-api.com/json/${ip}`)
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("Bad response from server")
        }
        return response.json()
      })
      .then((data) => {
        return data.city
      })

    const weather = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=98ed4b6c65f2bc2d1595c4063c7ab588`)
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("Bad response from server")
        }
        return response.json()
      })
      .then((data) => {
        return data.weather[0]
      })

    const data = {
      city,
      weather
    };

    this.buildText(data)
  }
  
  buildText(data) {
    const { city, weather } = data

    const greeting = this.rand([
      'Hey',
      'Hello',
      'Hello there',
      'Whats up',
    ])

    const compliment = this.rand([
      'gorgeous',
      'beautiful',
      'handsome',
      'lovely',
      'pretty',
      'irresistible',
    ])

    this.text = `${greeting} ${compliment}, enjoying some ${weather.main} in ${city}?`

  }
  componentDidMount() { 
    this.getWeatherInfo()
  }

  rand = (items) => items[Math.floor(Math.random()*items.length)]

  render() {
    return (
      <>
        {this.text ? <Heading text={this.text} lettering='enabled' /> : null}
      </>
    )
  }
}


	