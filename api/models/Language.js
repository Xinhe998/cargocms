module.exports={
    attributes:{
        name:{
            type:Sequelize.STRING(32),
            allowNull:false
        },
        code:{
            type:Sequelize.STRING(5),
            allowNull:false
        },
        locale:{
            type:Sequelize.STRING(255),
            allowNull:false
        },
        image:{
            type:Sequelize.STRING(64),
            allowNull:false
        },
        directory:{
            type:Sequelize.STRING(32),
            allowNull:false
        },
        sort_order:{
            type:Sequelize.INTEGER(3),
            allowNull:false,
            defaultValue:0
        },
        status:{
            type:Sequelize.BOOLEAN(),
            allowNull:false
        }
    },
    association:()=>{
        
    },
    options:{
        classMethod:{
            deleteById:async(id)=>{
                try{
                    return await Language.destroy({where:id});
                }catch(e){
                    sails.log.error(e);
                    throw e;
                }
            }
        },
        InstanceMethod:{
            
        },
        hooks:{
            
        }
    }
};