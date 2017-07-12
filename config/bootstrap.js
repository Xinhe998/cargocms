/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

import fs from 'fs';
import shortid from 'shortid';
import MailerService from 'sails-service-mailer';
import rc from 'rc';
module.exports.bootstrap = async (cb) => {

  try {
  
    if(!sails.config.appUrl) sails.config.appUrl = "localhost:"+ sails.config.port
    if(sails.config.appUrl.endsWith('/'))
    sails.config.appUrl = sails.config.appUrl.substr(0, sails.config.appUrl.length - 1)
    // 這個已經用 config/urls.js 定義預設值
    //if(!sails.config.urls) sails.config.urls = {afterSignIn: "/"};
    _.extend(sails.hooks.http.app.locals, sails.config.http.locals);
    const {environment} = sails.config;

    sails.services.passport.loadStrategies();

    let {connection} = sails.config.models;

    if (!sails.config.hasOwnProperty('offAuth'))
      sails.config.offAuth = false;

    if(environment == 'production'){
      sails.config.offAuth = false;
      let recipes = await Recipe.findAll({where: {hashId:{$eq: null}}})
      let updateRecipes = recipes.map((recipe) => {
        recipe.hashId = shortid.generate();
        return recipe.save();
      })

      await Promise.all(updateRecipes);

    }

    console.log("=== bootstrap create admin 0===");

    let adminRole = await Role.findOrCreate({
      where: {authority: 'admin'},
      defaults: {authority: 'admin'}
    });
    console.log("=== bootstrap create admin 1===");
    let userRole = await Role.findOrCreate({
      where: {authority: 'user'},
      defaults: {authority: 'user'}
    });

    let adminUser = await User.findOne({
      where: {
        username: 'admin'
      }
    });
    if(adminUser === null) {
      adminUser = await User.create({
        username: 'admin',
        email: 'admin@example.com',
        firstName: '李仁',
        lastName: '管',
        city: '高雄市',
        district: '苓雅區',
        address: '凱達格蘭大道1號',
        address2: '凱達格蘭大道2號',
        phone1: '0123456789',
        phone2: '0987654321',
        postCode: '802',
      });
    }

    await Passport.findOrCreate({
      where: {
        provider: 'local',
        UserId: adminUser.id
      },
      defaults: {
        provider: 'local',
        password: 'admin',
        UserId: adminUser.id
      }
    });
    await adminUser.addRole(adminRole[0]);

    //admin2
    adminUser = await User.findOne({
      where: {
        username: 'admin2'
      }
    });
    if(adminUser === null) {
      adminUser = await User.create({
        username: 'admin2',
        email: 'admin2@example.com',
        firstName: '管理',
        lastName: '員'
      });
    }
    await Passport.findOrCreate({
      where: {
        provider: 'local',
        UserId: adminUser.id
      },
      defaults: {
        provider: 'local',
        password: 'admin',
        UserId: adminUser.id
      }
    });

    await adminUser.addRole(adminRole[0]);

    /*
     * 是否要匯入的判斷必須交給 init 定義的程式負責
     */

    let config = [

      {name: 'mail', path: "orderConfirm.sendBy", value: "", description: ""},
      {name: 'mail', path: "orderConfirm.subject", value: "", description: ""},
      {name: 'mail', path: "orderConfirm.html", value: "", type: "editor", description: ""},

      {name: 'mail', path: "contact.confirm.sendBy", value: "", description: ""},
      {name: 'mail', path: "contact.confirm.subject", value: "", description: ""},
      {name: 'mail', path: "contact.confirm.html", value: "", description: ""},
      {name: 'mail', path: "contact.confirm.to", value: "", description: ""},
      {name: 'mail', path: "contact.confirm.sendMail", value: "", type: "boolean", description: ""},

      {name: 'mail', path: "contact.sendToAdmin.sendBy", value: "", description: ""},
      {name: 'mail', path: "contact.sendToAdmin.subject", value: "", description: ""},
      {name: 'mail', path: "contact.sendToAdmin.html", value: "", description: ""},
      {name: 'mail', path: "contact.sendToAdmin.to", value: "", description: ""},
      {name: 'mail', path: "contact.sendToAdmin.sendMail", value: "", type: "boolean", description: ""},


      {name: 'reCAPTCHA', path: "key", value: "", description: ""},
      {name: 'reCAPTCHA', path: "secret", value: "", description: ""},

      {name: 'facebook', path: "accessToken", value: "", description: ""},
      {name: 'facebook', path: "pageId", value: "", description: ""},

      {name: 'google', path: "analytics.accountid", value: "", description: ""},
      {name: 'google', path: "analytics.send", value: "", description: ""},

      {name: 'website', path: "store.name", value: "", description: ""},
      {name: 'website', path: "admin.login.title", value: "", description: ""},
      {name: 'website', path: "admin.login.footer", value: "", description: ""},
      {name: 'website', path: "admin.dashboard.title", value: "", description: ""},
      {name: 'website', path: "admin.dashboard.footer", value: "", description: ""},
      {name: 'website', path: "admin.dashboard.logo", value: "", type: "file", description: ""},

      {name: 'website', path: "title", value: "", description: ""},
      {name: 'website', path: "meta.author", value: "", description: ""},
      {name: 'website', path: "meta.description", value: "", description: ""},
      {name: 'website', path: "meta.og.site_name", value: "", description: ""},
      {name: 'website', path: "meta.og.locale", value: "", description: ""},
      {name: 'website', path: "meta.og.image", value: "", type: "file", description: ""},
      {name: 'website', path: "meta.og.image.type", value: "", description: ""},
      {name: 'website', path: "meta.og.image.width", value: "", description: ""},
      {name: 'website', path: "meta.og.image.height", value: "", description: ""},
      {name: 'website', path: "meta.og.title", value: "", description: ""},
      {name: 'website', path: "meta.og.description", value: "", description: ""},
      {name: 'website', path: "meta.og.type", value: "", description: ""},
      {name: 'website', path: "favicon", value: "", type: "file", description: ""}

    ]

    if (environment !== 'test') {
      // 自動掃描 init 底下的 module 資料夾後執行資料初始化
      let rcConfig = rc('sails');
      let {modules} = rcConfig.configLoader

      fs.readdir('./config/init/', async function(err, files) {
        for (var file of files) {
          let dirName = file;
          let isDir = fs.statSync('./config/init/' + dirName).isDirectory();
          if (isDir && modules.indexOf(dirName) >= 0) {
            let hasIndexFile = fs.statSync('./config/init/' + dirName + '/index.js').isFile();

            try {
              await require('./init/' + dirName).init();
            }
            catch (e) {
              sails.log.error(e);
            }
          }
        }
      });
    } else {
      // 測試時需要初始化的 module
      try {
        await require(`${__dirname}/init/allpay`).init();
      }
      catch (e) {
        sails.log.error(e);
      }
    }

    /* 檢查Google API Key是否存在 */
    if (sails.config.google===undefined || sails.config.google.key===undefined) {
      throw('google api Key not exist!!');
    }
    //檢查 FB Page & App ID 是否存在
    if (sails.config.facebook === undefined || sails.config.facebook.pageId === '' || sails.config.facebook.appId === ''){
      sails.log.error('Facebook Page ID or App ID not exist!!');
    }

    await ConfigService.sync();
    await ConfigService.load();

    cb();
  } catch (e) {
    sails.log.error(e.stack);
    cb(e);
  }
};
