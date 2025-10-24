import { SvelteSet } from 'svelte/reactivity';

export const mainQueueMembersSet = new SvelteSet()
export const addonQueueMembersSet = new SvelteSet()
export const supportersSet = new SvelteSet()

export const themeData = $state({
  current: 'system',
  available: ['system', 'light', 'dark'],
})


class EpochDataInfo {
  _data = $state({})

  get data() { return this._data }
  set data(dat) {
    let toDelete = (new Set(Object.keys(this._data)))
      .difference(new Set(Object.keys(dat)))
    // Object.assign(this._data, dat) // cannot use assign on proxies
    Object.keys(dat).forEach(key => this._data[key] = dat[key])
    toDelete.forEach(key => delete this._data[key])
  }
}
export const epochDataInfo = new EpochDataInfo()

class MemberInfo {
  _data = $state({})

  get active() { return this._data.active }
  set active(a) { this._data.active = a }
  get top() { return this._data.top }
  set top(t) { this._data.top = t }
}
export const memberInfo = new MemberInfo()


class ConnectedWallet {
  _data = $state({})
  _api = undefined
  _wallet = undefined
  
  get user() { return this._data.user }
  set user(u) { this._data.user = u }
  get name() { return this._data.name }
  set name(n) {
    this._data.name  = n
    if (n !== undefined && n !== '') {
      window.localStorage.connectedWalletName = n 
    } else {
      window.localStorage.connectedWalletName = undefined
    }
  }
  get address() { return this._data.address }
  set address(a) { this._data.address = a }
  get stakeAddr() { return this._data.stakeAddr }
  set stakeAddr(sa) { this._data.stakeAddr = sa }
  get stakeKey() { return this._data.stakeKey }
  set stakeKey(sk) { this._data.stakeKey = sk }
  
  get data() { return this._data }
  set data(dat) {
    let toDelete = (new Set(Object.keys(this._data)))
      .difference(new Set(Object.keys(dat)))
    // Object.assign(this._data, dat)
    Object.keys(dat).forEach(key => this._data[key] = dat[key])
    toDelete.forEach(key => delete this._data[key])
  }

  reset() {
    this.data = {}
    this._api = undefined
    this._wallet = undefined
  }

  get api() { return this._api }
  get wallet() { return this._wallet }

  async setApiFromWallet(wallet) {
    this._api = await wallet.unwrapApi()
    this._wallet = wallet
  }

  getApi(cardano) { return (cardano||window.cardano||{})[this.name]}
  getIcon(cardano) { return this.getApi()?.icon }

}

export const connectedWallet = new ConnectedWallet()
