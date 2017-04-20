const createProduct = async function(obj) {
    // const { category, supplier, rawProduct } = obj;
    const category = {
        name: obj.category || obj.productName,
        engName: obj.categoryEng || 'product'
    };
    const supplier = {
        name: obj.supplierName,
        address: obj.address || '',
        fax: obj.fax || '',
        telephone: obj.tel || '',
        taxId: obj.taxId || 0,
        email: obj.email || 'supplier@supplier.com'
    };
    const rawProduct = {
        name: obj.productName,
        description: obj.description || '',
        weight: obj.weight.split(/\D+/)[0] || 1,
        image: obj.image || '',
        price: obj.price || Math.floor(Math.random() * 90 + 10) * 10,
    };

    // 
    //
    //

    const image = await Image.create({
        filePath: `./data/product/${obj.image}`,
        type: 'image/jpeg',
        storage: 'local'
    });

    let findCategory = await Category.find({
        include: [{
            model: CategoryDescription,
            where: { name: category.name }
        }]
    });
    if (findCategory === null) {
        findCategory = await Category.create({
            image: `./data/product/${obj.image}`,
            top: 1,
            column: 2,
            sortOrder: 1,
            status: 1,
        });

        const initCategoryDesc = await CategoryDescription.create({
            name: `${category.name}專區`,
            description: `各種${category.name}海鮮產品`,
            metaTitle: `${category.name}`,
            metaDescription: `${category.name}`,
            metaKeyword: `${category.name}, ${category.engName}`,
            CategoryId: findCategory.id
        });
    }

    let findSupplier = await Supplier.find({ name: supplier.name });
    if (findSupplier === null) {
        findSupplier = await Supplier.create({
            name: supplier.name,
            email: supplier.email,
            telephone: supplier.telephone,
            fax: supplier.fax,
            address: supplier.address,
            taxId: supplier.taxId
        });
    }

    const productData = {
        model: rawProduct.name,
        sku: "ABC1234",
        upc: "512345678900",
        ean: "0012345678905",
        jan: "4534567890126",
        isbn: "9788175257665",
        mpn: "XYZ876A1B2C3",
        location: "台中市清水區",
        quantity: 200,
        shipping: true,
        price: rawProduct.price,
        points: 200,
        dateAvailable: "2017-01-01",
        weight: rawProduct.weight,
        length: 10,
        width: 10,
        height: 10,
        subtract: true,
        minimum: 1,
        sortOrder: 0,
        publish: true,
        viewed: Math.floor(Math.random() * 90 + 10) * 12,
        ImageId: image.id,
        SupplierId: findSupplier.id,
    };
    const newProduct = await Product.create(productData);

    const productDescription = await ProductDescription.create({
        name: rawProduct.name,
        description: rawProduct.description,
        tag: category.name,
        metaTitle: category.name,
        metaDescription: category.name,
        metaKeyword: `${category.name}, ${category.engName}`,
        ProductId: newProduct.id
    });

    const productImage = await ProductImage.create({
        ProductId: newProduct.id,
        ImageId: image.id,
        image: image.url,
        sortOrder: 1
    });

    const productTag = await ProductTag.create({
        tag: category.name,
        ProductId: newProduct.id
    });

    const option = await Option.create({
        type: 'textarea',
        sortOrder: 5,
    });

    const optionValue = await OptionValue.create({
        image: "catalog/option/option_image.jpg",
        sortOrder: 4,
        OptionId: option.id
    });

    const productOption = await ProductOption.create({
        value: '超低溫冷藏',
        required: true,
        OptionId: option.id,
        ProductId: newProduct.id
    });

    const productOptionValue = await ProductOptionValue.create({
        quantity: 100,
        subtract: true,
        price: 150,
        pricePrefix: "+",
        points: 0,
        pointsPrefix: "+",
        weight: 1.00000,
        weightPrefix: "+",
        OptionId: option.id,
        OptionValueId: optionValue.id,
        ProductId: newProduct.id,
        ProductOptionId: productOption.id
    });

    const optionDescription = await OptionDescription.create({
        name: 'textarea',
        OptionId: option.id
    });

    const optionValueDescription = await OptionValueDescription.create({
        name: 'Large',
        OptionId: option.id,
        OptionValueId: optionValue.id
    });

    console.log('before setCategories=>', newProduct.id, '=>', findCategory.id)
    await newProduct.setCategories(findCategory);

    return newProduct;
};

const createHelper = {
    product: async function(obj) {
        return await createProduct(obj);
    },
};

const importHelper = async(modelName, obj) => {
    try {
        const helper = createHelper[modelName];
        return await helper(obj)
    } catch (e) {
        sails.log.error(e);
    }
};

describe('import data.', () => {
    before(async(done) => {
        try {
            await ImportDataService.create(importHelper);
            done();
        } catch (e) {
            done(e);
        }
    });

    it('check imported data', async(done) => {
        try {
            const images = await Image.findAll();
            const products = await Product.findAll();
            const productDescriptions = await ProductDescription.findAll();
            const suppliers = await Supplier.findAll();
            const array = [images, products, productDescriptions, suppliers];
            for (const list of array) {
                list.length.should.be.gt(0);
            }
            done();
        } catch (e) {
            done(e);
        }

    });

});