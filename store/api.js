import { app } from 'firebase'
import moment from 'moment'

const getDefaultState = () => {
  // let baseURL =
  //   'https://enigmatic-woodland-37685.herokuapp.com/https://minion-api-dev.herokuapp.com'
  let baseURL = 'http://localhost:8000'
  if (process.env.NODE_ENV == 'production') {
    baseURL = 'https://minion-api.herokuapp.com'
  }
  return {
    accessToken: null,
    baseURL,
    refreshToken: null,
    accessExpiry: moment().add(1, 'days'),
    refreshExpiry: moment().add(7, 'days'),
    isLoggingIn: false,
  }
}

export const state = () => getDefaultState()

export const mutations = {
  setLoggingIn(state, val) {
    state.isLoggingIn = val
  },
  setAccessToken(state, val) {
    state.accessToken = val
  },
  setRefreshToken(state, val) {
    state.refreshToken = val
  },
  updateAccessExpiry(state) {
    state.accessExpiry = moment().add(1, 'days')
  },
  updateRefreshExpiry(state) {
    state.refreshExpiry = moment().add(7, 'days')
  },
  reset(state) {
    Object.assign(state, getDefaultState())
  },
}

export const actions = {
  // Token Management
  setUpdateAccessToken(context, token) {
    context.commit('setAccessToken', token)
    context.commit('updateAccessExpiry')
    this.$cookies.set('accessToken', JSON.stringify(token), {
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: true,
    })
  },
  setUpdateRefreshToken(context, token) {
    context.commit('setRefreshToken', token)
    context.commit('updateRefreshExpiry', token)
    this.$cookies.set('refreshToken', JSON.stringify(token), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: true,
    })
  },
  async refresh(context) {
    if (context.state.refreshToken) {
      let headers = {
        Authorization: 'Bearer ' + context.state.accessToken,
        'Content-Type': 'application/json',
      }

      let body = JSON.stringify({
        refresh: context.state.refreshToken,
      })
      let requestOptions = {
        method: 'POST',
        headers,
        body,
        redirect: 'follow',
      }

      try {
        let refreshResponse = await fetch(
          `${context.state.baseURL}/api/token/refresh/`,
          requestOptions
        )
        if (refreshResponse.ok) {
          let refreshObj = await refreshResponse.json()
          context.dispatch('setUpdateAccessToken', refreshObj.access)
          context.dispatch('setUpdateRefreshToken', refreshObj.refresh)
          return refreshObj.access
        } else {
          return null
        }
      } catch (err) {
        console.log(err)
        return null
      }
    } else {
      return null
    }
  },
  // General API Calls
  async delete(context, url) {
    if (context.state.accessToken) {
      if (context.state.accessExpiry < moment()) {
        await context.dispatch('refresh')
      }
      let headers = {
        Authorization: 'Bearer ' + context.state.accessToken,
      }

      let requestOptions = {
        method: 'DELETE',
        headers,
        redirect: 'follow',
      }
      if (process.env.NODE_ENV == 'production') {
        requestOptions.credentials = 'include'
      }

      let response = await fetch(context.state.baseURL + url, requestOptions)

      if (response.ok) {
        return await response
      } else {
        return null
      }
    } else {
      return null
    }
  },
  async get(context, url) {
    if (context.state.accessToken) {
      if (context.state.accessExpiry < moment()) {
        await context.dispatch('refresh')
      }
      let headers = {
        Authorization: 'Bearer ' + context.state.accessToken,
      }

      let requestOptions = {
        method: 'GET',
        headers,
        redirect: 'follow',
      }
      if (process.env.NODE_ENV == 'production') {
        requestOptions.credentials = 'include'
      }

      let response = await fetch(context.state.baseURL + url, requestOptions)

      if (response.ok) {
        return await response.json()
      } else {
        return null
      }
    } else {
      return null
    }
  },
  async post(context, { url, data }) {
    if (context.state.accessToken) {
      if (context.state.accessExpiry < moment()) {
        await context.dispatch('refresh')
      }
      let headers = {
        Authorization: 'Bearer ' + context.state.accessToken,
        'Content-Type': 'application/json',
      }

      let requestOptions = {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        redirect: 'follow',
      }
      if (process.env.NODE_ENV == 'production') {
        requestOptions.credentials = 'include'
      }

      let response = await fetch(context.state.baseURL + url, requestOptions)

      if (response.ok) {
        return await response.json()
      } else {
        return await response.json()
      }
    } else {
      return null
    }
  },
  async put(context, { url, data }) {
    if (context.state.accessToken) {
      if (context.state.accessExpiry < moment()) {
        await context.dispatch('refresh')
      }
      let headers = {
        Authorization: 'Bearer ' + context.state.accessToken,
        'Content-Type': 'application/json',
      }

      let requestOptions = {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
        redirect: 'follow',
      }
      if (process.env.NODE_ENV == 'production') {
        requestOptions.credentials = 'include'
      }

      let response = await fetch(context.state.baseURL + url, requestOptions)

      if (response.ok) {
        return await response.json()
      } else {
        return null
      }
    } else {
      return null
    }
  },
  // API Auth Calls
  async getAccount(context) {
    if (context.state.accessToken) {
      if (context.state.accessExpiry < moment()) {
        await context.dispatch('refresh')
      }
      let headers = {
        Authorization: 'Bearer ' + context.state.accessToken,
      }

      let requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
      }
      if (process.env.NODE_ENV == 'production') {
        requestOptions.credentials = 'include'
      }

      let accountResponse = await fetch(
        `${context.state.baseURL}/accounts/`,
        requestOptions
      )
      if (accountResponse.ok) {
        return await accountResponse.json()
      } else {
        return null
      }
    } else {
      return null
    }
  },
  async getMembers(context) {
    if (context.state.accessToken) {
      if (context.state.accessExpiry < moment()) {
        await context.dispatch('refresh')
      }
      let headers = {
        Authorization: 'Bearer ' + context.state.accessToken,
      }

      let requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
      }
      if (process.env.NODE_ENV == 'production') {
        requestOptions.credentials = 'include'
      }

      let membersResponse = await fetch(
        `${context.state.baseURL}/teams/members/`,
        requestOptions
      )
      if (membersResponse.ok) {
        return await membersResponse.json()
      } else {
        return null
      }
    } else {
      return null
    }
  },
  async getTeam(context) {
    if (context.state.accessToken) {
      if (context.state.accessExpiry < moment()) {
        await context.dispatch('refresh')
      }
      let headers = {
        Authorization: 'Bearer ' + context.state.accessToken,
      }

      let requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
      }
      if (process.env.NODE_ENV == 'production') {
        requestOptions.credentials = 'include'
      }

      let teamResponse = await fetch(
        `${context.state.baseURL}/teams/`,
        requestOptions
      )
      if (teamResponse.ok) {
        return await teamResponse.json()
      } else {
        return null
      }
    } else {
      return null
    }
  },
  async login(context, credentials) {
    let headers = {
      'Content-Type': 'application/json',
    }

    let raw = JSON.stringify(credentials)

    let requestOptions = {
      method: 'POST',
      headers: headers,
      body: raw,
      redirect: 'follow',
    }
    if (process.env.NODE_ENV == 'production') {
      requestOptions.credentials = 'include'
    }

    try {
      let tokenResponse = await fetch(
        `${context.state.baseURL}/api/token/`,
        requestOptions
      )
      if (tokenResponse.ok) {
        let tokens = await tokenResponse.json()
        context.dispatch('setUpdateAccessToken', tokens.access)
        context.dispatch('setUpdateRefreshToken', tokens.refresh)
        return tokens
      } else {
        return null
      }
    } catch (err) {
      console.log(err)
      return null
    }
  },
  logout() {
    this.$cookies.remove('refreshToken', { path: '/' })
    this.$cookies.remove('accessToken', { path: '/' })
  },
  async loginFromCookies(context) {
    context.commit('startLoading', {}, { root: true })
    if (!this.$cookies.get('refreshToken')) {
      return false
    }
    console.log(this.$cookies)
    try {
      context.dispatch(
        'setUpdateRefreshToken',
        this.$cookies.get('refreshToken')
      )
      await context.dispatch('refresh')
      let account = await context.dispatch('getAccount')
      let team = await context.dispatch('getTeam')
      context.commit('account/setAccount', account, { root: true })
      context.commit('team/setTeam', team, { root: true })
      await Promise.all([
        context.dispatch('project/getProjectStatusChoices', {}, { root: true }),
        context.dispatch('project/getUpdateStatusChoices', {}, { root: true }),
        context.dispatch('team/getMembers', {}, { root: true }),
        context.dispatch('team/getCompanies', {}, { root: true }),
      ])
      context.commit('stopLoading', {}, { root: true })
      console.log('woohoo')
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },
  async sign(context, data) {
    if (context.state.accessToken) {
      if (context.state.accessExpiry < moment()) {
        await context.dispatch('refresh')
      }
      let headers = {
        Authorization: 'Bearer ' + context.state.accessToken,
      }

      let formdata = new FormData()
      formdata.append('file', data.file, 'test.png')
      formdata.append('company', data.company)
      formdata.append('client', data.client)

      let requestOptions = {
        method: 'POST',
        headers: headers,
        body: formdata,
        redirect: 'follow',
      }
      if (process.env.NODE_ENV == 'production') {
        requestOptions.credentials = 'include'
      }

      let signResponse = await fetch(
        `${context.state.baseURL}/reports/sign/`,
        requestOptions
      )
      if (signResponse.ok) {
        return await signResponse.json()
      } else {
        return null
      }
    }
  },
}
