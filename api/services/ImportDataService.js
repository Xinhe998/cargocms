module.exports = {

    create: async function(importHelper) {
        try {
            const importData = sails.config.import;
            for (const table of importData.tables) {
                const json = require(table.jsonfile);
                const modelName = table.targetModel.toLowerCase();
                const mapping = table.mapping;
                const obj = {};
                for (const data of json) {
                    for (const map of mapping) {
                        obj[map.to] = data[map.from];
                    }
                    const newData = await importHelper(modelName, obj);
                }
            }
        } catch (e) {
            sails.log.error(e);
            throw new Error(e);
        }
    }

}