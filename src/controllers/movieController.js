// @ts-check
const { default: axios } = require('axios')
const { config } = require('./../config/index')

const Response = (response) => {
  const status = 200 === response.status

  return {
    status: status,
    code: status ? 0 : response.data.status_code,
    message: status ? "OK" : response.data.status_message,
    data: status ? response.data : ""
  }
}

const GetNowPlaying = async (page = 1) => {
  const url = `${config.apiHost}/${config.apiVersion}/movie/now_playing?api_key=${config.apiKey}&language=id&page=${page}`
  const response = await axios.get(url)
    .then(response => response)
    .catch(e => e.response)

  return Response(response)
}

const GetSimiliarMovie = async (id) => {
  const url = `${config.apiHost}/${config.apiVersion}/movie/${id}/similar?api_key=${config.apiKey}&language=en-US&page=1`
  const response = await axios.get(url)
    .then(response => response)
    .catch(e => e.response)

  return Response(response)
}

const GetRecomendationMovie = async (id) => {
  const url = `${config.apiHost}/${config.apiVersion}/movie/${id}/recommendations?api_key=${config.apiKey}&language=en-US&page=1`
  const response = await axios.get(url)
    .then(response => response)
    .catch(e => e.response)

  return Response(response)
}

const GetDetailMovie = async (id) => {
  if (!id) return Response({ status: 404, message: "Movie id cannot be null" })

  const detailUrl = `${config.apiHost}/${config.apiVersion}/movie/${id}?api_key=${config.apiKey}&language=en-US`
  const castUrl = `${config.apiHost}/${config.apiVersion}/movie/${id}/credits?api_key=${config.apiKey}`

  const response = await axios.all([
    axios.get(detailUrl), 
    axios.get(castUrl)
  ])
  .then(axios.spread((detailRes, castRes) => { 
    const detail = detailRes.data
    const cast = castRes.data

    return { status: 200, data: { detail, cast } }
  })).catch(() => Object.assign({}, { status: 500, message: "Internal server error" }))

  return Response(response)
}

module.exports = {
  GetNowPlaying,
  GetDetailMovie,
  GetSimiliarMovie,
  GetRecomendationMovie
}
