/**
 * Created by jaumard on 28/03/2015.
 */
import bootstrap from './config/bootstrap'
import path from 'path'

module.exports = function (sails) {
    console.log("=== load hook labfnp ===");
    var loader = require('sails-util-mvcsloader')(sails);

    loader.configure({
        policies: __dirname + '/api/policies', // Path to your hook's policies
        config: __dirname + '/config' // Path to your hook's config
    });

    return {
        initialize: function (next) {
            // Load controllers, models & services from default directories
            // loader.adapt(function (err) {
            //     return next(err);
            // });


                loader.adapt({
                    controllers: __dirname + '/api/controllers', // Path to your hook's controllers
                    models: __dirname + '/api/models', // Path to your hook's models
                    services: __dirname + '/api/services' // Path to your hook's services
                }, function (err) {
                    return next(err);
                });

        },
        customMiddleware: function (express, app, multipleViews, sails) {
          try {
            var maxAge = sails.config.http.cache;
            app.use('/assets/labfnp', express.static(`${__dirname}/assets` , {maxAge}));

            console.log("=== path ===", path.join(__dirname, 'views'));
            multipleViews(app, path.join(__dirname, 'views'));

          } catch (e) {
            console.error("run hook customMiddleware error", e);
            throw e;
          }
        },
        bootstrap: async function (initDefault) {
          try {
            await bootstrap.init(initDefault);
          } catch (e) {
            console.error("run hook bootstrap error", e);
            throw e;
          }
        }
    };
};
