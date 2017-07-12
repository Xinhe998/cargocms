model.exports={
    create:async(req,res)=>{
        const data = req.body;
        try{
            const language = await LanguageService.create(data);
            const chackLanguageResult = language.name===data.languageName;
            if(chackLanguageResult){
                res.ok({
                    message:'create language success.',
                    data:language
                });
            }else{
                throw new Error('Create ${data.languageName} failed.');
            }
        }catch(e){
            res.serverError(e);
        }
    },
    find:async(req,res)=>{
        const{name} = req.params;
        try{
            const language=await LanguageService.findByLanguageName(name);
            res.ok({
                message:'Get language success.'
                data:language
            });
        }catch(e){
            res.serverError(e);
        }
    },
    update:async(req,res)=>{
        const {name} =req.params;
        const data = req.body;
        try{
            const language = await LanguageService.update(data,{
                where:{name},
            });
            res.ok({
                message:'Update language success.',
                data:language,
            })
        }catch(e){
            res.serverError(e);
        }
    },
    destroy:async(req,res)=>{
        const {name} = req.params;
        try{
            const.language = await LanguageService.deleteByLanguageName(name);
            res.ok({
                message:'Delete language success.',
                data:language,
            });
        }catch(e){
            res.serverError(e);
        }
    }

}