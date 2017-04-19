module.exports = {

  create: async function({productNames , supplierName, categoryType, categoryEng}){

    const initCategory = await Category.create({
      image: `catalog/demo/168_seafood_${categoryEng}.jpg`,
      top: 1,
      column: 2,
      sortOrder: 1,
      status: 1,
    });

    const initCategoryDesc = await CategoryDescription.create({
      name: `${categoryType}專區`,
      description: `各種${categoryType}海鮮產品`,
      metaTitle: `${categoryType}`,
      metaDescription: `${categoryType}`,
      metaKeyword: `${categoryType}, ${categoryEng}`,
      CategoryId: initCategory.id
    });

    const supplier = await Supplier.create({
      name: `${supplierName}`,
      email: '168_seafood@gmail.com',
      telephone: '(04)-2201-1688',
      fax: '(04)-2201-1168',
      address: '台中市清水區北提路',
      taxId: '54891351'
    });


    let productData, product, productDescription, productTag,
        productImage, option, optionValue,
        productOption1, productOption2, productOption3,
        productOptionValue1, productOptionValue2, productOptionValue3, 
        optionDescription, optionValueDescription;

    for(let p of productNames){
      let imageNo = Math.floor(Math.random() * 800 ) + 1;
      let image = await Image.create({
        filePath: `https://unsplash.it/400/320/?image=${ imageNo }`,
        type: 'image/jpeg',
        storage: 'url'
      });

      productData = {
        model: `${p}`,
        sku: "ABC1234",
        upc: "512345678900",
        ean: "0012345678905",
        jan: "4534567890126",
        isbn: "9788175257665",
        mpn: "XYZ876A1B2C3",
        location: "台中市清水區",
        origin: "台中市西區",
        quantity: 200,
        image: image.url,
        shipping: true,
        price: Math.floor(Math.random() * 90 + 10 ) * 10,
        points: 200,
        precautions: '慎生食',
        dateAvailable: "2017-01-01",
        weight: 146.4,
        length: 10,
        width: 10,
        height: 10,
        subtract: true,
        minimum: 1,
        sortOrder: 0,
        publish: true,
        viewed: 12321,
        ImageId: image.id,
        SupplierId:  supplier.id,
      };

      product = await Product.create(productData);

      productDescription = await ProductDescription.create({
          name: `${p}`,
          description: `${p}`,
          tag: `${categoryType}`,
          metaTitle: `${categoryType}`,
          metaDescription: `${categoryType}`,
          metaKeyword: `${categoryType}, ${categoryEng}`,
          ProductId: product.id
        });

      productTag = await ProductTag.create({
        tag: `${categoryType}`,
        ProductId: product.id
      });

      // 每個 Product 建立 3 張 ProductImage
      for(let i = 0; i < 3; i++){
        imageNo += i;
        let image = await Image.create({
          filePath: `https://unsplash.it/400/320/?image=${ imageNo }`,
          type: 'image/jpeg',
          storage: 'url'
        });

        productImage = await ProductImage.create({
          ProductId: product.id,
          ImageId: image.id,
          image: image.url,
          sortOrder: i + 1
        });

      }



      option = await Option.create({
        type: 'textarea',
        sortOrder: 5,
      });

      optionValue = await OptionValue.create({
        image:"catalog/option/option_image.jpg",
        sortOrder: 4,
        OptionId: option.id
      });

      optionDescription = await OptionDescription.create({
        name: 'textarea',
        OptionId: option.id
      });

      optionValueDescription = await OptionValueDescription.create({
        name: 'Large',
        OptionId: option.id,
        OptionValueId: optionValue.id
      });

      const productOptionData = {
        value: '3 公斤',
        required: true,
        OptionId: option.id,
        ProductId: product.id
      };
      productOption1 = await ProductOption.create(productOptionData);

      const productOptionValueData = {
        quantity: 3,
        subtract: true,
        price: productData.price * 3,
        pricePrefix: "=",
        points: 0,
        pointsPrefix: "=",
        weight: 0.00000,
        weightPrefix: "=",
        OptionId: option.id,
        OptionValueId: optionValue.id,
        ProductId: product.id,
        ProductOptionId: productOption1.id
      };
      productOptionValue1 = await ProductOptionValue.create(productOptionValueData);

      productOptionData.value = '6 公斤';
      productOption2 = await ProductOption.create(productOptionData);

      productOptionValueData.quantity = 6;
      productOptionValueData.price = productOptionValueData.price * 2;
      productOptionValueData.ProductOptionId = productOption2.id;
      productOptionValue2 = await ProductOptionValue.create(productOptionValueData);

      productOptionData.value = '12公斤';
      productOption3 = await ProductOption.create(productOptionData);

      productOptionValueData.quantity = 12;
      productOptionValueData.price = productOptionValueData.price * 2;
      productOptionValueData.ProductOptionId = productOption3.id;
      productOptionValue3 = await ProductOptionValue.create(productOptionValueData);

      await product.setCategories(initCategory);
      await product.setSuppliers(supplier);
    };

    return product;
  },
}
