module.exports = {
  page: async (req, res, pageDoc) => {
    if (req.urlPath !== '/account/register') {
      return
    }
    const link = pageDoc.createElement('link')
    link.attr = {
      rel: 'stylesheet',
      href: '/public/oauth.css'
    }
    const head = pageDoc.getElementsByTagName('head')[0]
    head.child.push(link)
    const form = pageDoc.getElementById('submit-form')
    const buttonContainer = pageDoc.createElement('div')
    buttonContainer.attr = {
      id: 'oauth-buttons',
      class: 'oauth-buttons'
    }
    form.child[form.child.length] = form.child[form.child.length - 1]
    form.child[form.child.length - 2] = buttonContainer
  }
}
