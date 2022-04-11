const dashboard = require('@layeredapps/dashboard')

module.exports = {
  after: (req, res) => {
    if (!req.account || !req.account.oauth) {
      return
    }
    res.ended = true
    if (req.urlPath === '/account/change-username' || req.urlPath === '/account/change-password') {
      return dashboard.Response.redirect(req, res, '/account/convert-account?message=conversion-required-change-credential')
    }
    if (req.urlPath === '/account/reset-codes' || req.urlPath === '/account/create-reset-code') {
      return dashboard.Response.redirect(req, res, '/account/convert-account?message=conversion-required-reset-code')
    }
  }
}
