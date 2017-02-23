module.exports = {

    import: {
        tables: [{
            "targetModel": "Product",
            "jsonfile": "../../import/b2b/product/output.json",
            "mapping": [
                { "from": "name", "to": "productName" },
                { "from": "source", "to": "supplierName" },
                { "from": "spec", "to": "weight" },
                { "from": "typeEng", "to": "categoryEng" },
                { "from": "type", "to": "category" },
                { "from": "image", "to": "image" },
                { "from": "desc", "to": "description" },
                { "from": "tel", "to": "tel" },
                { "from": "fax", "to": "fax" },
                { "from": "address", "to": "address" }
            ]
        }],
    }

};