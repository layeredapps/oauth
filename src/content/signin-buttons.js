module.exports = {
  page: async (req, res, pageDoc) => {
    if (req.urlPath !== '/account/signin') {
      return
    }
    const form = document.getElementById('submit-form')
    const buttonContainer = document.createElement('div')
    buttonContainer.attr = {
      id: 'oauth-buttons',
      class: 'oauth-buttons'
    }
    form.child[form.child.length] = form.child[form.child.length - 1]
    form.child[form.child.length - 1] = buttonContainer
  }
}