// @ts-check
const express = require('express')
const routes = express.Router()
const {
  GetNowPlaying,
  GetDetailMovie,
  GetSimiliarMovie,
  GetRecomendationMovie
} = require('./../controllers/movieController')

routes.route('/now-playing').get( async (req, res) => {
  const page = req.query.page
  const response = await GetNowPlaying(page)

  res.json(response)
})

routes.route('/detail/:id').get( async (req, res) => {
  const movieId = req.params.id || 0
  const response = await GetDetailMovie(movieId)

  res.json(response)
})

routes.route('/similiar/:id').get( async (req, res) => {
  const movieId = req.params.id || 0
  const response = await GetSimiliarMovie(movieId)

  res.json(response)
})

routes.route('/recomendation/:id').get( async (req, res) => {
  const movieId = req.params.id || 0
  const response = await GetRecomendationMovie(movieId)

  res.json(response)
})

module.exports = routes