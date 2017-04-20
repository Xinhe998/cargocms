module.exports = {

    import: {
        tables: [{
            "targetModel": "Product",
            "jsonfile": "../../import/b2b/product.json",
            "mapping": [
                { "from": "name", "to": "productName" },
                { "from": "source", "to": "supplierName" },
                { "from": "spec", "to": "weight" },
                // { "from": "categoryEng", "to": "categoryEng" },
                { "from": "category", "to": "category" },
                { "from": "image", "to": "image" },
                { "from": "desc", "to": "description" },
                { "from": "source-tel", "to": "tel" },
                { "from": "source-fax", "to": "fax" },
                { "from": "source-addr", "to": "address" }
            ]
        }],
    }

};