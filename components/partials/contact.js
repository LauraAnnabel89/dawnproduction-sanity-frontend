import React from 'react'
import Expandable from 'components/partials/expandable'
import Textarea from 'react-textarea-autosize'
import axios from 'axios'
import { get } from 'lodash'

export default class Contact extends React.Component {

  state = {
    open: false,
    submitting: false,
    submitted: false,
    data: {},
    validation: {}
  }

  // componentWillUnmount () {
  //   if (this.timeout) clearTimeout(this.timeout)
  // }

  onButtonClick = () => {
    this.setState(state => ({...state, open: !this.state.open}))
  }

  onPostSuccess = res => {
    const newState = { submitting: false, submitted: true, data: {}, validation: {} }
    this.setState(state => ({...state, ...newState}))
  }

  onPostError = err => {
    const res = _.get(err, 'response.data', {})
    const errName = _.get(res, 'err.name')
    const data = _.get(res, 'result.data')
    const validation = _.get(res, 'result.validation')

    const newState = { submitting: false }

    if (data) newState.data = data
    if (validation) newState.validation = validation

    this.setState(state => ({...state, ...newState}))
  }

  onSubmit = e => {
    e.preventDefault()
    const { data } = this.state
    this.setState(state => {
      axios.post('/api/contact/post/', data)
        .then(this.onPostSuccess)
        .catch(this.onPostError)
      return {...state, submitting: true}
    })
  }

  onChange = e => {
    const { name, value } = e.target
    const { data, validation } = this.state
    const newData = { ...data }
    // const newValidation = { ...validation }
    // delete newValidation[name]
    newData[name] = value
    this.setState(state => ({...state, data: newData })) // validation: newValidation
  }

  renderField = (name, render) => {
    const { submitting, data, validation } = this.state
    const props = {
      name,
      disabled: submitting,
      value: data[name] || '',
      onChange: this.onChange
    }
    const fieldValidation = validation[name]
    const classes = ['contact-form__form-field']
    if (fieldValidation) classes.push('contact-form__form-field--error')
    return (
      <div className={classes.join(' ')}>
        <div className='contact-form__form-field-wrapper'>
          {render(props)}
        </div>
        {fieldValidation && (
         <div className='contact-form__form-field-validation'>
           {fieldValidation}
         </div>
         ) || null}
      </div>
    )
  }

  render () {
    const { open, submitting, submitted } = this.state

    return (
      <div className='contact-form'>
        <a className={open ? 'button' : 'button button--filled'} onClick={this.onButtonClick}>Let's start a story</a>
        <Expandable expanded={open}>
          {submitted && (
           <p className='contact-form__message'>
             Thanks! We'll get back to you shortly.
           </p>
           ) || (
           <form className='contact-form__form' onSubmit={this.onSubmit} autoComplete='off'>
             {this.renderField('name', props => (
                <input
                  ref={ref => this.firstInput = ref}
                  type='text'
                  placeholder='Name'
                  required={false}
                  {...props} />
              ))}
             {this.renderField('email', props => (
                <input
                  type='email'
                  placeholder='Email'
                  required={false}
                  {...props}/>
              ))}
             {this.renderField('phone', props => (
                <input
                  type='text'
                  placeholder='Phone'
                  required={false}
                  {...props}/>
              ))}
             {this.renderField('body', props => (
                <Textarea placeholder='Talk to me' required={false} {...props} />
              ))}
             <div className='contact-form__form-field'>
               <input
                 className='button button--filled'
                 type='submit'
                 name='submit'
                 placeholder='Submit'
                 disabled={submitting} />
             </div>
           </form>
           )}
        </Expandable>
      </div>
    )
  }

}
