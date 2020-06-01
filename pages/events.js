import Base from './_base'

export default class Events extends Base {

  static query = `
    *[_type == "event"] | order(date desc) {
      _id,
      title,
      subtitle,
      date,
      image
    }
  `

  renderData (data) {
    return (
      <section className='events'>
      </section>
    )
  }

}
