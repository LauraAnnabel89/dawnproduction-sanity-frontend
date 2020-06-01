import React from 'react'
import PropTypes from 'prop-types'
import { default as NextLink } from 'next/link'
import { withRouter } from 'next/router'
import routes, { Link } from 'routes'

class Menu extends React.Component {

  static propTypes = {
    items: PropTypes.array,
    onClick: PropTypes.func
  }

  static defaultProps = {
    items: []
  }

  onClick = () => {
    const { onClick } = this.props
    onClick && onClick()
  }

  render () {
    const { router, items, onClick, ...props } = this.props
    const matchedRoute = routes.match(router.asPath)
    return (
      <ul {...props}>
        {items.map((item, i) => {

           if (item._type === 'reference') {
             const { resolved } = item
             if (!resolved || !resolved.slug || !resolved.slug.current) return null
             let { _type } = resolved
             if (resolved.slug.current === 'about') {
               _type = 'about'
             }
             let className
             const route = routes.findAndGetUrls(_type, {slug: resolved.slug.current})
             if (route.route) {
               if (route.route.toPath({slug: resolved.slug.current}) === router.asPath) className = 'menu__item--current'
             }

             if (_type === 'about') {
              return (
                <li key={i} className={className}>
                  <Link route={_type} href='/about'>
                  <a onClick={onClick}>
                    {resolved.title || resolved.name}
                  </a>
                  </Link>
                </li>
              ) 
             }

             return (
               <li key={i} className={className}>
                 <Link route={_type} params={{slug: resolved.slug.current}}>
                 <a onClick={onClick}>
                   {resolved.title || resolved.name}
                 </a>
                 </Link>
               </li>
             )
           }

           if (!item.url) return null

           if (item.url.indexOf('http') === 0) {
             return (
               <li key={i}>
                 <a target='_blank' href={item.url} onClick={onClick}>
                   {item.name || item.url}
                 </a>
               </li>
             )
           }

           let className
           if (item.url === router.asPath || router.asPath.indexOf(item.url) === 0) className = 'menu__item--current'

           return (
             <li key={i} className={className}>
               <NextLink href={item.url}>
                 <a onClick={onClick}>
                   {item.name || item.url}
                 </a>
               </NextLink>
             </li>
           )
         })}
      </ul>
    )
  }

}

export default withRouter(Menu)
