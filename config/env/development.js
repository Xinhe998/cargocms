/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {
  storeName: '',
  appUrl: 'cargo-dev.trunksys.com',
  port: 5001,
  socials: ["facebook", "googleplus", "twitter"],
  models: {
    connection: 'sqlite',
    migrate: 'drop'
  },
  verificationEmail: false,
  log: {
    level: 'verbose'
  },
  passport: {
    local: {
      strategy: require('passport-local').Strategy
    },
    facebook: {
      name: 'Facebook',
      protocol: 'oauth2',
      strategy: require('passport-facebook').Strategy,
      options: {
        clientID: '',
        clientSecret: '',
        callbackURL: "",
        scope: [ 'email', 'public_profile' ],
        profileFields: [
          'id', 'email', 'gender', 'link', 'locale',
          'name', 'timezone', 'updated_time', 'verified',
          'displayName', 'photos'
        ]
      }
    }
  },
  reCAPTCHA: {
    key: '',
    secret: ''
  },
  storage: {
    // locate can be s3 or local
    locate: 'local',
    s3: {
      key: 'Access Key Id',
      secret: 'Secret Access Key',
      // region only can be us-standard
      // other region will get InvalidRequest Error
      region: 'region of bucket',
      bucket: 'bucket name'
    }
  },
  google: {
    name: 'GoogleAPIKey',
    key: 'AIzaSyBSPvypkv-HnFRsC0ZFDvinPMPlEC59Ous'
  },
  
  taxrate : 0.05,

  paymentMethods: {
    origin: [{
      type: 'ATM',
      provider: '國泰世華銀行',
      other: '{"bankId": "013", "bankBranch": "南屯", "bankBranchId": "2402", "account": "808080808080", "accountName": "管李仁"}'  
    }, {
      type: '貨到付款',
      provider: '黑貓宅急便', 
      other: '{}',
    }]
  },
  layoutImages: {
    banner: [{
      url: 'http://i.imgur.com/Z2K6d9T.jpg',
      dimension: '1500x1001',
    }],
  }

};
