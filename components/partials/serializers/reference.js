import React from 'react'

import ProfileReferenceSerializer from './references/profile'

const SERIALIZERS = {
  profile: ProfileReferenceSerializer
}

export default class ReferenceSerializer extends React.Component {

  render () {
    const { node = {} } = this.props
    const { resolved } = node
    if (!resolved) return null
    const Serializer = SERIALIZERS[resolved._type]
    if (!Serializer) return null
    return <Serializer {...resolved} />
  }

}
