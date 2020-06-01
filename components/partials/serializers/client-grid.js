import React, { Fragment } from 'react'
import Image from 'components/partials/image'
import { Parallax } from 'lib/parallax'
import { Link } from 'routes'

export default class ClientGridSerializer extends React.Component {

  render () {
    const { node = {} } = this.props
    const { clients = [] } = node

    const wrap = (client, el) => {
      const { caseStudy } = client
      if (caseStudy && caseStudy.slug) return (
          <Link route={caseStudy._type} params={{slug: caseStudy.slug.current}}>
          <a>
            {el}
          </a>
          </Link>
      )
      return (
        <div>
          {el}
        </div>
      )
    }

    return (
      <div className='client-grid'>
        <Parallax enterExitPadding={15}>
          <div className='client-grid__inner'>
            {clients.map((client, i) => {
               const { resolved } = client
               if (!resolved) return null
               const itemStyle = {
                 transitionDelay: `${i * 75}ms`
               }
               const { name, caseStudy, logo, image } = resolved
               return (
                 <div key={i} className='client-grid__client' style={itemStyle}>
                   {wrap(resolved, (
                      <div>
                        {logo && (
                         <div className='client-grid__client-logo'>
                           <Image src={logo} width={795} height={447} />
                         </div>
                         ) || null}
                        {caseStudy && caseStudy.slug && image && (
                         <div className='client-grid__client-image'>
                           <Image src={image} width={640} height={360} />
                         </div>
                         ) || null}
                      </div>
                      ))}
                 </div>
               )
             })}
          </div>
        </Parallax>
      </div>
    )
  }

}
