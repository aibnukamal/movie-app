// @ts-check
const express = require('express')
const routes = express.Router()
const { GetNowPlaying } = require('./../controllers/movieController')


routes.route('/now-playing').get( async (req, res) => {
  const response = await GetNowPlaying()

  res.json(response)
})

module.exports = routes