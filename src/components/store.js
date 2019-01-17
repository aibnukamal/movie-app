import Vue from 'vue'
import Vuex from 'vuex'
import { slugify } from 'transliteration'

Vue.use(Vuex)

export const currencyFormating = (currency, value) => {
  return `${currency} ${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
}

export default new Vuex.Store({
  state: {
    balance: 100000,
    myMovie: [],
    filter: {
      country: 'id'
    }
  },
  mutations: {
    creditBalance (state, credit) {
      if (state.balance > credit) {
        state.balance = state.balance - credit
      }
    },
    setMyMovie (state, id) {
      state.myMovie.push(id)
    },
    setCountry (state, code) {
      state.filter.country = code
    }
  },
  getters: {
    pricing: () => (rating = 0, format = true) => {
      const price = rating === 0 ? 0 : (rating > 0 && rating <= 3 ? 3500 : (rating > 3 && rating <= 6 ? 8250 : (rating > 6 && rating <= 8 ? 16350 : 21250)))

      return format ? (price === 0 ? '-' : currencyFormating('IDR', price)) : (price === 0 ? 0 : price)
    },
    getParameterByName: () => (name, url = null) => {
      if (!url) url = window.location.href

      name = name.replace(/[\]]/g, '\\$&')
      const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
      const results = regex.exec(url)
      if (!results) return null
      if (!results[2]) return ''

      return decodeURIComponent(results[2].replace(/\+/g, ' '))
    },
    limitText: () => (text, count) => text.slice(0, count) + (text.length > count ? '...' : ''),
    slug: () => (string) => slugify(string),
    image: () => (item) => item.poster_path.length > 0 ? `https://image.tmdb.org/t/p/w300_and_h450_bestv2${item.poster_path}` : 'https://cdn11.bigcommerce.com/s-dvcn50z25u/stencil/b2bdfd40-d9f0-0135-1a4d-525400970412/e/4011d150-d9f6-0135-1a51-525400970412/images/no-image.svg',
    isMyMovie: (state) => (movie) => state.myMovie.indexOf(movie.id) === -1
  }
})
