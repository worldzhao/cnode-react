import React, { Component } from 'react'
import axios from 'axios'

export default class TestApi extends Component {
  getTopics = () => {
    axios
      .get('/api/topics')
      .then((res) => {
        console.log('====================================')
        console.log(res)
        console.log('====================================')
      }).catch((err) => {
        console.log('====================================')
        console.log(err)
        console.log('====================================')
      })
  }

  login = () => {
    axios
      .post('/api/user/login', { accessToken: '2afa25be-8fc2-413f-993f-a11e008529c0' })
      .then((res) => {
        console.log('====================================')
        console.log(res)
        console.log('====================================')
      }).catch((err) => {
        console.log('====================================')
        console.log(err)
        console.log('====================================')
      })
  }

  markAll = () => {
    axios.post('/api/message/mark_all?needAccessToken=true')
      .then((res) => {
        console.log('====================================')
        console.log(res)
        console.log('====================================')
      }).catch((err) => {
        console.log('====================================')
        console.log(err)
        console.log('====================================')
      })
  }

  render() {
    return (
      <div>
        <button onClick={this.getTopics}>topics</button>
        <button onClick={this.login}>login</button>
        <button onClick={this.markAll}>markALl</button>
      </div>
    )
  }
}
