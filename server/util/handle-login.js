const router = require('express').Router()
const axios = require('axios')

const baseUrl = 'http://cnodejs.org/api/v1'

router.post('/login', function (req, res, next) {
  // accesstoken正确性验证
  axios
    .post(`${baseUrl}/accesstoken`, {
      accesstoken: req.body.accessToken
    })
    .then(resp => {
      if (resp.status === 200 && resp.data.success) {
        // 存储在session中
        req.session.user = {
          accessToken: req.body.accessToken,
          loginName: resp.data.loginname,
          id: resp.data.id,
          avatarUrl: resp.data.avatar_url
        }
        res.json({
          success: true,
          data: resp.data
        })
      }
    })
    .catch(err => {
      if (err.response) {
        res.json({
          success: false,
          // 避免层级太深无法json出去
          data: err.response.data
        })
      } else {
        next(err)
      }
    })
})

module.exports = router
