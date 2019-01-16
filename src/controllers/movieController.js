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

const GetNowPlaying = async () => {
  const url = `${config.apiHost}/${config.apiVersion}/movie/now_playing?api_key=${config.apiKey}&language=id&page=1&region=id`
  const response = await axios.get(url)
    .then(response => response)
    .catch(e => e.response)

  return Response(response)
}

module.exports = {
  GetNowPlaying
}
