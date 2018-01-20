import React, { Component } from 'react'
import {
  observer,
  inject,
} from 'mobx-react'
import PropTypes from 'prop-types'
import { AppState } from '../../store/app-state'
@inject('appState') @observer
export default class TopicList extends Component {
  componentDidMount() {
    console.log('====================================')
    console.log(1)
    console.log('====================================')
  }

  render() {
    return (
      <div>
        <span>{this.props.appState.name}</span>
      </div>
    )
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState).isRequired,
}

