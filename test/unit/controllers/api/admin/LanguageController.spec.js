describe.only('about language api Controller operation.',function () {
    it('create language should success.',async(done)=>{
        const createThisLanguage={
            languageName:'testLanguage',
            languageCode:'tCode',
            languageLocale:'testLocale',
            languageImage:'testImg',
            languageDirectory:'testDirectory',
            languageSortOrder:'1',
            languageStatus:'1'
        };
        try{
            const res = await request(sails.hooks.http.app).post('/api/admin/language');
            res.body.should.be.Object;
            res.body.data.code.should.be.equal(createThisLanguage.languageCode);
            res.body.data.directory.should.be.equal(createThisLanguage.languageDirectory);
            done();
        }catch(e){
            done(e);
        }
    });
    describe('find language',()=>{
        let findThisLanguage;
        before(async(done)=>{
            try{
                findThisLanguage = await Language.create({
                    name:'findTetsLanguage',
                    code:'fCode',
                    locale:'findTetsImg',
                    image:'findTestImg',
                    directory:'findTestDirectory',
                    sortOrder:'1',
                    status:'1'
                });
                done();
            }catch(e){
                done(e);
            }
        });
        it('should success.',async(done)=>{
            try{
                const res = await request(sails.hooks.http.app)
                .get('/api/admin/language/${findThisLanguage,naem}');
                res.body.data.should.be.Object;
                res.body.data.code.should.be.String;
                res.body.data.code.should.be.equal(findThisLanguage.code);
                done();
            }catch(e){
                done(e);
            }
        });
    });
    describe('delete language',()=>{
        let deleteThisLanguage;
        before(async(done)=>{
            try{
                deleteThisLanguage= await Language.create({
                    name:'testLanguage',
                    code:'tCode',
                    locale:'testLocale',
                    image:'testImg',
                    directory:'testDirectory',
                    sortOrder:'1',
                    status:'1',
                });
                done();
            }catch(e){
                done(e);
            }
        });
        it('should success.',async(done)=>{
            try{
                const res = await request(sails.hooks.http.app)
                .delete('/api/admin/language/${deleteThisLanguage.name}');
                res.body.success.should.be.true;
                done();
            }catch(e){
                done(e);
            }
        });
    });
    describe('update language',()=>{
        let updateThisLanguage={
            name:'updateName',code:'uCode',
            locale:'updateLocale',
            image:'updateImage',
            directory:'updatedImage',
            directory:'updateDirectory',
            sortOrder:'1',
            status:'1',
        };
        before(async(done)=>{
            try{
                updateThisLanguage= await Language.create({
                       name:updateThisLanguage.name,
                code:'tCode',
                locale:'UpdateThisLocale',
                image:'updateImg',
                directory:'updateThisDirectory',
                sortOrder:'0',
                status:'0'  
                })
           done();
            }catch(e){
                done(e);
            }
        });
       it('should success.',async(done)=>{
            try{
                const res = await request(sails.hooks.http.app)
                .put('/api/admin/language/${updateThisLanguage.name}').send(updatedLanguage.code);
                res.body.data.code.should.be.equal(updatedLanguage.directory);
                done();
            }catch(e){
                done(e);
            }
        });
    });
});