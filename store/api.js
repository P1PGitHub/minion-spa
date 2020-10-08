import moment from 'moment'

export const state = function () {
  let baseURL =
    'https://enigmatic-woodland-37685.herokuapp.com/https://minion-api-dev.herokuapp.com'
  if (process.env.NODE_ENV == 'production') {
    baseURL = 'https://minion-api.herokuapp.com'
  }
  return {
    accessToken: null,
    baseURL,
    refreshToken: null,
    accessExpiry: moment().add(5, 'minutes'),
    refreshExpiry: moment().add(1, 'days'),
  }
}

export const mutations = {
  setAccessToken(state, val) {
    state.accessToken = val
  },
  setRefreshToken(state, val) {
    state.refreshToken = val
  },
  updateAccessExpiry(state) {
    state.accessExpiry = moment().add(5, 'minutes')
  },
  updateRefreshExpiry(state) {
    state.refreshExpiry = moment().add(1, 'days')
  },
}

export const actions = {
  // Token Management
  setUpdateAccessToken(context, token) {
    context.commit('setAccessToken', token)
    context.commit('updateAccessExpiry')
  },
  setUpdateRefreshToken(context, token) {
    context.commit('setRefreshToken', token)
    context.commit('updateRefreshExpiry', token)
  },
  async refresh(context) {
    if (context.state.refreshToken) {
      let headers = new Headers()
      headers.append('Content-Type', 'application/json')

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
      let headers = new Headers()
      headers.append('Authorization', 'Bearer ' + context.state.accessToken)

      let requestOptions = {
        method: 'DELETE',
        headers,
        redirect: 'follow',
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
      let headers = new Headers()
      headers.append('Authorization', 'Bearer ' + context.state.accessToken)

      let requestOptions = {
        method: 'GET',
        headers,
        redirect: 'follow',
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
      let headers = new Headers()
      headers.append('Authorization', 'Bearer ' + context.state.accessToken)
      headers.append('Content-Type', 'application/json')

      let requestOptions = {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        redirect: 'follow',
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
      let headers = new Headers()
      headers.append('Authorization', 'Bearer ' + context.state.accessToken)
      headers.append('Content-Type', 'application/json')

      let requestOptions = {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
        redirect: 'follow',
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
      let headers = new Headers()
      headers.append('Authorization', 'Bearer ' + context.state.accessToken)

      let requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
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
      let headers = new Headers()
      headers.append('Authorization', 'Bearer ' + context.state.accessToken)

      let requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
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
      let headers = new Headers()
      headers.append('Authorization', 'Bearer ' + context.state.accessToken)

      let requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
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
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    if (process.env.NODE_ENV == 'production') {
      headers.append(
        'Access-Control-Allow-Origin',
        'https://minion-spa.herokuapp.com'
      )
    }

    let raw = JSON.stringify(credentials)

    let requestOptions = {
      method: 'POST',
      headers: headers,
      body: raw,
      redirect: 'follow',
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
  async sign(context, data) {
    if (context.state.accessToken) {
      if (context.state.accessExpiry < moment()) {
        await context.dispatch('refresh')
      }
      let headers = new Headers()
      headers.append('Authorization', 'Bearer ' + context.state.accessToken)

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
