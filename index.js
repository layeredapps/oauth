const sequelize = require('sequelize')

module.exports = {
  registerOrSignIn: async (req, identifier, provider) => {
    const dashboard = require('@layeredapps/dashboard')
    const registered = await dashboard.Storage.Account.findOne({
      where: {
        usernameHash: `${identifier}@${provider}`
      }
    })
    let accountid, sessionKey, sessionKeyNumber, profileid
    // create their account and nascent profile information
    if (!registered || !registered.dataValues || !registered.dataValues.accountid) {
      const accountInfo = {
        sessionKey: dashboard.UUID.random(64),
        sessionKeyNumber: 1,
        usernameHash: `${identifier}@${provider}`,
        passwordHash: `oauth@${provider}`
      }
      const otherUsersExist = await dashboard.Storage.Account.findOne()
      if (!otherUsersExist) {
        accountInfo.administratorSince = sequelize.literal('CURRENT_TIMESTAMP')
        accountInfo.ownerSince = sequelize.literal('CURRENT_TIMESTAMP')
      }
      const account = await global.apidashboard.Storage.Account.create(accountInfo)
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
    const sessionToken = dashboard.UUID.random(64)
    const tokenHash = await dashboard.Hash.sha512Hash(`${accountid}/${sessionToken}/${sessionKey}/${dashboardSessionKey}`, dashboardEncryptionKey)
    const sessionInfo = {
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
        accountid
      }
    })
    return {
      account: {
        accountid,
        profileid
      },
      session: {
        sessionid: session.dataValues.sessionid,
        token: sessionToken
      }
    }
  }
}
