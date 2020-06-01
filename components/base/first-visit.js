import React, { Component } from 'react'
import Heading from 'components/partials/heading';

export default class FirstVisit extends Component {
  state = {
    firstVisit: true,
    currentVisit: false,
    city: null,
    weather: null,
    text: '',
    open: true,
  }

  getWeatherInfo = async () => {
    const ip = await fetch('https://api.ipify.org?format=json')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        return data.ip
      })
      .catch(() => {
        throw new Error("Bad response from server")
      })

    const city = await fetch(`http://ip-api.com/json/${ip}`)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        return data.city
      })
      .catch(() => {
        throw new Error("Bad response from server")
      })

    const weather = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=98ed4b6c65f2bc2d1595c4063c7ab588`)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        return data.weather[0]
      })
      .catch(() => {
        throw new Error("Bad response from server")
      })

      return {city, weather}
  }
  

  async componentDidMount() {
    const { localStorage, sessionStorage } = window
    const user = {
      currentVisit: sessionStorage.getItem('currentVisit'),
    }

    // Don't disturb the user anymore if it's in the same session
    if (user.currentVisit === 'true') {
      this.setState((state) => ({ ...state, currentVisit: true, open: false  }))
      return
    }
    
    const store = [
      'visits',
      'firstVisitDone'
    ]

    store.forEach((item) => {
      user[ item ] = localStorage.getItem(item)
    })


    if (!user.city || !user.weather) {
      try {
        const data = await this.getWeatherInfo()
        user.city = data.city
        user.weather = data.weather.main
        this.setState((state) => ({ ...state, city: data.city, weather: data.weather.main }))          
      } catch(err) {
        user.city = null
        user.weather = null
      }
    } 

    if ( !user.firstVisitDone ) {
      this.setState((state) => ({ ...state, isFirstVisit: true }))
    } else {
      this.setState((state) => ({ ...state, isFirstVisit: false }))
    }

    // User is in the same session
    sessionStorage.setItem('currentVisit', 'true')

    const greeting = this.rand(!user.firstVisitDone ? [
      'Hey',
      'Hello',
      'Hello there',
      'Whats up',
    ] : [
      'Welcome back',
      'Glad to see you again',
      'Hello again you',
    ])

    const compliment = this.rand([
      'gorgeous',
      'beautiful',
      'handsome',
      'lovely',
      'pretty',
      'irresistible',
    ])

    if (user.city && user.weather) {
      const weather = {
        Thunderstorm: `there's a thunderstorm in ${user.city}`,
        Drizzle: `a bit of drizzle in ${user.city}`,
        Rain: `looks like it's raining in ${user.city}, keep yourself warm and dry!`,
        Snow: `freezing cold today in ${user.city}, isn't it? Keep warm!`,
        Atmosphere: `looks like it's foggy today in ${user.city}`,
        Clear: `hope you are enjoying this sunny day in ${user.city}`,
        Clouds: `it's a bit cloudy in ${user.city} but it will still be a gorgeous day`,
      }
  
      const text = `${greeting} ${compliment}, ${weather[user.weather] || 'hope everything\'s alright today!'}`    
      this.setState((state) => ({ ...state, text }))  
    } else {
      const text = `${greeting} ${compliment}, hope everything's alright today!`    
      this.setState((state) => ({ ...state, text }))
    }

    user.firstVisitDone = true
    store.forEach((item) => {
      localStorage.setItem(item, user[ item ])
    })

    setTimeout(() => {
      this.setState((state) => ({ ...state, open: false }))
    }, 3500)
  }

  rand = (items) => items[Math.floor(Math.random()*items.length)]

  render () {
    const { firstVisit, currentVisit, open, text } = this.state

    if (firstVisit || !currentVisit) {
      return (
        <section className={`first-visit--container page-row__theme-yellow-blue container-fluid ${open ? 'first-visit--show' : 'first-visit--hide'}`}>
          <div className="row middle-xs center-xs" style={{height: '100vh'}}>
            <div className="col-xs">
              {text ? <Heading text={text} lettering="enabled" weight="bold" /> : null}
            </div>
          </div>
        </section>
      )
    }

    return null

  }
}
