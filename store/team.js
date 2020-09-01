import moment from 'moment'

import * as account from './account.js'

export const state = () => ({
  members: [],
  team: null,
  cwCompanies: null,
})

export const mutations = {
  setMembers(state, val) {
    state.members = val
  },
  setCWCompanies(state, val) {
    state.cwCompanies = val
  },
  setTeam(state, val) {
    state.team = val
  },
}

export const actions = {
  async getMembers(context) {
    if (context.state.team) {
      let members = await context.dispatch('api/getMembers', {}, { root: true })
      members.sort((a, b) => {
        if (a.last_name < b.last_name) {
          return -1
        } else {
          return 1
        }
      })
      context.commit('setMembers', members)
    }
  },
  async getCompanies(context) {
    if (context.state.team && context.rootState.account.account.cw_private) {
      let headers = new Headers()
      let auth = `${context.state.team.cw_company}+${context.rootState.account.account.cw_public}:${context.rootState.account.account.cw_private}`
      headers.append('clientID', '027cc308-7482-441d-9053-a9f8b0c94b4b')
      headers.append('Authorization', `Basic ${btoa(auth)}`)

      let requestOptions = {
        method: 'GET',
        headers,
        redirect: 'follow',
      }

      let companiesResponse = await fetch(
        'https://enigmatic-woodland-37685.herokuapp.com/http://na.myconnectwise.net/v4_6_release/apis/3.0/company/companies/?pagesize=1000',
        requestOptions
      )
      if (companiesResponse.ok) {
        let companies = []
        let rawCompanies = await companiesResponse.json()
        rawCompanies.forEach((company) => {
          if (company.types[0].id == 1) {
            companies.push({
              id: company.id,
              identifier: company.identifier,
              name: company.name,
              address: {
                street1: company.addressLine1,
                city: company.city,
                state: company.state,
                zip: company.zip,
              },
              status: company.status,
              custom: company.customFields,
              contact: company.defaultContact,
              phone: company.phoneNumber,
            })
          }
        })
        companies.sort((a, b) => {
          if (a.name < b.name) {
            return -1
          } else {
            return 1
          }
        })
        context.commit('setCWCompanies', companies)
        return companies
      } else {
        return null
      }
    } else {
      console.log('fail')
      return null
    }
  },
}
