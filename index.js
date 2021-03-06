const crypto = require('crypto')
const dashboard = require('@layeredapps/dashboard')

module.exports = {
  registerOrSignIn: async (req, identifier, provider) => {
    const registered = await dashboard.Storage.Account.findOne({
      where: {
        usernameHash: `${identifier}@${provider}`,
        appid: req.appid || global.appid
      }
    })
    let accountid, sessionKey, sessionKeyNumber, profileid
    // create their account and nascent profile information
    if (!registered || !registered.dataValues || !registered.dataValues.accountid) {
      const accountInfo = {
        appid: req.appid || global.appid,
        sessionKey: crypto.randomBytes(32).toString('hex'),
        sessionKeyNumber: 1,
        usernameHash: `${identifier}@${provider}`,
        passwordHash: `oauth@${provider}`
      }
      const otherUsersExist = await dashboard.Storage.Account.findOne({
        where: {
          appid: req.appid || global.appid
        }
      })
      if (!otherUsersExist) {
        accountInfo.administratorSince = new Date()
        accountInfo.ownerSince = new Date()
      }
      const account = await dashboard.Storage.Account.create(accountInfo)
      accountid = account.dataValues.accountid
      sessionKey = account.dataValues.sessionKey
      sessionKeyNumber = account.dataValues.sessionKeyNumber
    } else {
      accountid = registered.dataValues.accountid
      sessionKey = registered.dataValues.sessionKey
      sessionKeyNumber = registered.dataValues.sessionKeyNumber
      profileid = registered.dataValues.profileid
    }
    // create session
    let dashboardEncryptionKey = global.dashboardEncryptionKey
    let dashboardSessionKey = global.dashboardSessionKey
    if (req.server) {
      dashboardEncryptionKey = req.server.dashboardEncryptionKey || dashboardEncryptionKey
      dashboardSessionKey = req.server.dashboardSessionKey || dashboardSessionKey
    }
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = await dashboard.Hash.sha512Hash(`${accountid}/${sessionToken}/${sessionKey}/${dashboardSessionKey}`, dashboardEncryptionKey)
    const sessionInfo = {
      appid: req.appid || global.appid,
      accountid,
      tokenHash,
      sessionKeyNumber,
      duration: 99999999999
    }
    const session = await dashboard.Storage.Session.create(sessionInfo)
    await dashboard.Storage.Account.update({
      lastSignedInAt: session.dataValues.createdAt
    }, {
      where: {
        accountid,
        appid: req.appid || global.appid
      }
    })
    return {
      account: {
        accountid,
        profileid,
        oauth: true
      },
      session: {
        sessionid: session.dataValues.sessionid,
        token: sessionToken
      }
    }
  }
}
