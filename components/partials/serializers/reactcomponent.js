import React from 'react'
import RizeHeader from 'components/partials/custom/rize-header'
import LocationWeather from 'components/partials/custom/location-weather'
import StorymakersType from 'components/partials/custom/storymakers-type'
import Instagram from 'components/partials/custom/instagram'
import Paginator from 'components/partials/custom/paginator';

export default class ReactComponentSerializer extends React.Component {

  render () {
    const { node } = this.props
    const { name } = node;

    const ComponentMap = {
      RizeHeader,
      LocationWeather,
      StorymakersType,
      Instagram,
      Paginator,
    }

    const MainComponent = ComponentMap[name] || null;

    return (
      <MainComponent />
    )
  }

}
