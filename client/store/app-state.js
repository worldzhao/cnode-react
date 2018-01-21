import {
  observable,
  computed,
  action,
} from 'mobx'

export class AppState {
  @observable count =0
  @observable name = 'worldzhao'
  @computed get msg() {
    return `${this.name} say conut is ${this.count}`
  }
  @action add() {
    this.count += 1
  }
  @action changeName(name) {
    this.name = name
  }
}

const appState = new AppState()

export default appState
