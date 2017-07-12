describe('about Language Service Operation',function(){
    it('create Language should succcess.',async(done)=>{
        try{
            const newLanguage={
                LanguageName:'testLanguage',
                languageCode:'tCode',
                languageLocale:'testLocale',
                languageImage:'testImg',
                languageDirectory:'testDirectory',
                languageSortOrder:'1',
                languageStatus:'1',
            };
            const result=await LanguageService.create(newLanguage);
            result.should.be.Object;
            result.name.should.be.equal(new Language.LanguageName);
            done();

        }catch(e){
            done(e);
        }
    });
    it('find Language should success.',async(done)=>{
        try{
            const result=await LanguageService.findLanguageName('testLanguage');
            result.name.should.be.equal('testLanguage');
            done();
        }catch(e){
            done(e);
        }
    });
    it('update Language should success.',async(done)=>{
        try{
            const changeData={
                name:'testLanguage',
                code:changeData.code,
                locale:changeData.image,
                directory:changeData.directory,
                sortOrder:changeData.sortOrder,
                status:changeData.status
            };
            const result=await LanguageService.update({
                name:'testLanguage',
                code:changeData.code,
                locale:changeData.locale,
                image:changeData.image,
                directory:changeData.directory,
                sortOrder:changeData.sortOrder,
                status:changeData.status
            });
            result.code.should.be.eq(changeData.code);
            result.locale.should.be.eq(changeData.locale);
            done();

        }catch(e){
            done(e);
        }
    });
    it('delete Language should success',async(done)=>{
        try{
            const result = await LanguageService.deleteByLanguageName('testLanguage');
            const findlanguage= await Language.findOne({where:{name:'updateLanguage'}});
            (findlanguage===null).should.be.true;
            done();
        }catch(e){
            done(e);
        }
    });
})