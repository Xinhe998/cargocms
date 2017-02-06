import _ from 'lodash';
module.exports = {

  sync: () => {

  },

  load: () => {

  },

  init: () => {

  },

  jsonTOPath: (data) => {
    try {
      sails.log.debug(data);
      let result = [];
      for (const key of Object.keys(data)) {
        if(_.isArray(data[key])){
          result.push({
            name: key,
            value: JSON.stringify(data[key]),
            type: 'array'
          });
        } else if (_.isObject(data[key])) {
          let formatObject = ConfigService.getPath(data[key], '', []);
          formatObject = formatObject.map((data) => {
            return {
              name: key,
              ...data,
            }
          });
          result = result.concat(formatObject);
        } else {
          result.push({
            name: key,
            value: data[key],
            type: 'text'
          });
        }
      }
      return result;
    } catch (e) {
      throw e;
    }
  },

  pathTOJSON: (data) => {
    try {
      const result = {};
      data.forEach((info) => {
        const name = info.name;
        result[name] = result[name] || {};
        console.log(info);
        if(info.type === 'array') {
          result[name] = JSON.parse(info.value);
        } else {
          if (info.path) {
            let pathArray = info.path.split('.');
            if (pathArray.length > 1) {
              result[name] = ConfigService.arrayTOObject(result[name], pathArray, info.value);
            } else {
              result[name] = info.value;
            }
          } else {
            result[name] = info.value;
          }
        }
      })
      sails.log.info("info!!!!!!!!", result);
    } catch (e) {
      throw e;
    }
  },


  getPath: (data, path, result) => {
    try {
      if(_.isEmpty(data)) {
        return result;
      } else {
        for (const key of Object.keys(data)) {
          if(_.isArray(data[key])){
            const value = data[key];
            result.push({
              path: `${path}${path ? '.': ''}${key}`,
              value: JSON.stringify(value),
              type: 'array'
            });
            delete data[key];
            return ConfigService.getPath(data, path, result);
          } else if (_.isObject(data[key])) {
            return ConfigService.getPath(data[key], `${path}${path ? '.': ''}${key}`, result)
          } else {
            const value = data[key];
            result.push({
              path: `${path}${path ? '.': ''}${key}`,
              value,
              type: 'text'
            });
            delete data[key];
            return ConfigService.getPath(data, path, result);
          }
        }
      }
    } catch (e) {
      throw e;
    }
  },

  arrayTOObject: (target, array, value) => {
    try {
      console.log("!!!!!!!", target, array, value);
      // let result = {};
      array.forEach((data, index) => {
        if (index === array.length -1) {
          target[data] = value;
        } else {
          target[data] = target[data] || {}
        }
      });
      sails.log.debug(target);
      return target
    } catch (e) {
      throw e;
    }
  }

}
