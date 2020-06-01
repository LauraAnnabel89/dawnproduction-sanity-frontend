module.exports = (req, res, next) => {
  if (false) {
    res.status(500)
  } else {
    res.status(200)
  }
  res.json({test: 'test'})

}
