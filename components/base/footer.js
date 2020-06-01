import React from 'react'
import PropTypes from 'prop-types'
import Logo from 'components/partials/logo'
import Link from 'next/link'
import Menu from 'components/shared/menu'
import Contact from 'components/partials/contact'
import IPA from 'components/shared/ipa'

export default class Footer extends React.Component {

  static propTypes = {
    social: PropTypes.array
  }

  static defaultProps = {
    social: []
  }

  // remember to have a fallback of careers@aesop.co.uk if there are no career postings

  render () {
    const { social } = this.props
    return (
      <div className='footer__wrapper'>
        <footer className='footer'>
          <div className='container-fluid'>
            {/* <Contact /> */}

            <div className='row'>
              <div className='col-xs-12'>
                <div className='footer__logo'>
                  <Logo />
                </div>
              </div>
            </div>
            
            <div className='row'>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-4'>
                <ul className='footer__info'>
                  <li>7th Floor, One Oliver’s Yard</li>
                  <li>55-71 City Road</li>
                  <li>London EC1Y 1DT<br/></li>
                  <li><a href='tel:00442074405550'>+44 (0)20 7440 5550</a></li>
                  <li><a href='mailto:tortoise@thestorymakers.com'>tortoise@thestorymakers.com</a></li>
                </ul>
              </div>

              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-8'>
                <Menu className='footer__social-links' items={social} />
              </div>
            </div>

            <div className='row'>            
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-4'>
                <p className='footer__small'>
                  <strong className='footer__copyright'>©2019 Aesop Agency</strong>
                  <Link href='/terms-and-conditions'>
                    <a className='footer__terms'>T&Cs</a>
                  </Link>
                </p>
              </div>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-4'>
                <IPA />
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}
