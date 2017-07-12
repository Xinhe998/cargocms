module.exports = {
    create: async ({ laguageName, languageCode, languageLocale, languageDirectory, languageSortOrder, languageStatus })=> {
        try {
            /*sails.log.info({ languageName, languageCode, languageLocale, languageImage, languageDirectory, languageSortOrder, languageStatus
    });*/

            const findExistLanguage = await Language.find({
                where: { name: languageName }
            });
            if (findExistLanguage) {
                throw new Error(`user ${findExistLanguage.languageName} exist!`);
            }

            const language = await Language.create({
                name: languageName,
                code: languageCode, locale: languageLocale, image: languageImage,
                directory: languageDirectory, sortOrder: languageSortOrder, status: languageStatus
            });

            return language;
        } catch (e) {

        }
    },
    findByLanguageName: async (languageName) => {
        try {
            return await Language.find({ where: { name: languageName } });
        } catch (e) {
            throw e;
        }
    },

    update: async (language = { name, code, locale, image, directory, sortOrder, status }) => {
        try {
            // sails.log.info('update language service=>', language) 
            let updatedLanguage = await Language.findOne({
                where: {
                    name: language.name
                }
            });

            if (updatedLanguage) {
                updatedLanguage.name = language.name; 
                updatedLanguage.code = language.code; 
                updatedLanguage.locale = language.locale; 
                updatedLanguage.image = language.image;
                updatedLanguage.directory = language.directory; 
                updatedLanguage.sortOrder = language.sortOrder; 
                updatedLanguage.status = language.status;
            } else {
                sails.log.warn(`${language.name} can't find!`);
            }

            updatedLanguage = await updatedLanguage.save();
            return updatedLanguage;
        } catch (e) {
            throw e;
        }
    },

    deleteByLanguageName: async (languageName) => {
        try {

            const deletedLanguage = await Language.destroy({
                where: {
                    name: languageName
                }
            });
        } catch (e) {
            throw e;
        }
    }
}