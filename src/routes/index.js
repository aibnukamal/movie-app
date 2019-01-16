// @ts-check
const express = require('express')
const routes = express.Router()
const { GetNowPlaying } = require('./../controllers/movieController')


routes.route('/now-playing').get( async (req, res) => {
  const page = req.query.page
  const response = await GetNowPlaying(page)

  res.json(response)
})

module.exports = routes