import fs from 'fs';
import rc from 'rc';
import _ from 'lodash';
export default (configName) => {
  let rcConfig = rc('sails');
  let {modules} = rcConfig.configLoader

  var result = {}
  var files = fs.readdirSync('./config')
  for (var dirName of files) {
    let isDir = fs.statSync('./config/' + dirName).isDirectory();
    if (isDir && modules.indexOf(dirName) >= 0) {
      let customRouteConfigFile = __dirname+"/../" + dirName + '/'+configName;

      let hasCustomRouteConfigFile = fs.existsSync(customRouteConfigFile);
      if (hasCustomRouteConfigFile) {
        console.log("load module", dirName, configName);
        var customConfig = require(__dirname+"/../" + dirName + '/'+configName);

        // result = {
        //   ...result,
        //   ...customConfig
        // }
        result = _.merge(result, customConfig);
      }
    }
  }

  return result;
};
