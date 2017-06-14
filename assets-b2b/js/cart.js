function checkOptionMaxValue() {
    var optionMaxValue = parseInt($('input[name=orderType]:checked').attr('data-max'));
    $('.order-quantity').attr('max', optionMaxValue);
    var optionValue = parseInt($('.order-quantity').val());
    if (optionValue > optionMaxValue) {
        $('.order-quantity').val(optionMaxValue);
    }
}

function getProductInfo(productDom) {
    var max = parseInt(productDom.find('input').prop('max'));
    var number = parseInt(productDom.find('input').val());
    if (number > max) {
        number = max;
        swal({
            title: '提示',
            text: '<p>訂購數量超過庫存量。</p></br></p>可購買數量' + max + '包</p>',
            html: true
        });
    }
    if (!number) number = 0;
    var price = Number(productDom.find('.product-price span').text());
    var quantity = Number(number);
    var tax = Number(productDom.find('.product-tax').text());
    var totalPrice = price * quantity;
    var totalPriceNoTax = Math.round(totalPrice / (1 + Number(tax)));
    tax = totalPrice - totalPriceNoTax;
    var product = {
        id: productDom.data('id'),
        name: productDom.find('> h1').text(),
        price: price,
        quantity: quantity,
        noTaxPrice: totalPriceNoTax,
        taxPrice: tax,
    };
    return product;
}

/**
 * 單層物件比對
 * @param {Object} obj1 - 物件1
 * @param {Object} obj2 - 物件2
 * @return {Boolean} 是否相同
 */
function objCompare(obj1, obj2) {
    var keys = Object.keys(obj1).concat(Object.keys(obj2))
    console.log(keys)
    for (var i in keys)
        if (obj1[keys[i]] !== obj2[keys[i]])
            return false;
    return true;
}

/**
 * 將產品存進購物車(localStorage)
 * @param {Object} product - 產品物件
 * @return {Boolean} 購物車的產品是否有改變
 */
function storeToCart(product) {
    var cart = JSON.parse(localStorage.cart || '[]');
    var replace = false;
    var isChanged = false;
    cart = $(cart).map(function(i, productInCart) {
        if (productInCart.id === product.id && productInCart.optionId === product.optionId) {
            // 如果原本購物車中的產品數量，等於儲存的產品數量，代表沒有改變購物車資料
            isChanged = !(objCompare(product, productInCart));

            replace = true;
            return product;
        } else return productInCart;
    }).toArray();
    if (!replace) {
        cart.push(product);
    }
    cart = $(cart).filter(function(i, productInCart) {
        if (productInCart.quantity == 0) return false;
        else return true;
    }).toArray();
    localStorage.cart = JSON.stringify(cart);

    return isChanged;
}

function removeFromCart(product) {
    var cart = JSON.parse(localStorage.cart || '[]');
    cart = $(cart).filter(function(i, e) {
        if (e.id == product.id && e.optionId === product.optionId) return false;
        else return true;
    }).toArray();
    localStorage.cart = JSON.stringify(cart);
}

function updateCartInput() {
    $('.product .form-group input').val(0);
    $('.b2b-product-detail-content .order-input input').val(1);

    var cart = JSON.parse(localStorage.cart || '[]');
    $(cart).each(function(index, el) {
        var productDom = $('.product[data-id="' + el.id + '"]');
        $('.form-group input', productDom).val(el.quantity);
        if (el.id == $('.b2b-product-detail-content').data('id')) {
            $('.b2b-product-detail-content .order-input input').val(el.quantity)
        }
    });
    if (cart.length > 0) {
        $('li#cart > a').css('color', 'red');
        $('li#cart > a').css('font-size', '18px');
        $('#mobile-cart-icon').css('color', 'red');
        $('#mobile-cart-icon').css('font-size', '18px');
        $('#cart-fixed > i.cart-fixed-icon').css('color', 'red');
        $('li#cart span.badge').css('background-color', '#000');
    } else {
        $('li#cart > a').css('color', '#777');
        $('li#cart > a').css('font-size', '14px');
        $('#mobile-cart-icon').css('color', '#777');
        $('#cart-fixed > i.cart-fixed-icon').css('color', '#777');
    }
}

$(function() {
    updateCartInput();
    $(window).on('modifyCart', function() {
        updateCartInput();
    });

    $('.product input[type="number"]').bootstrapNumber();
    $('.product .input-group').click(function(e) {
        e.preventDefault();
    });

    $('.product .input-group input').change(function(event) {
        var product = getProductInfo($(this).closest('.product'));
        storeToCart(product);
        $(window).trigger('modifyCart');
    });
    $('.product .input-group button').click(function(event) {
        var product = getProductInfo($(this).closest('.product'));
        storeToCart(product);
        $(window).trigger('modifyCart');
    });
    $('.b2b-product-detail-content .add-to-cart').click(function(event) {
        var options = $('input[name=orderType]');
        var optionId = null;
        var optionValue = null;
        if (options.length > 0) {
            for (var key in options) {
                var option = options[key];
                if (option.checked) {
                    optionId = option.value;
                    optionValue = option.getAttribute('data-option');
                    break;
                }
            }
        }
        var quantity = parseInt($('.b2b-product-detail-content .order-input input').val());

        // 如果加進購物車的數量小於等於零
        if (quantity <= 0)
            return;

        var tax = Number($('.product-tax').text());
        var price = Number($('.b2b-product-detail-content .price span').text());
        var totalPrice = price * quantity;
        var totalPriceNoTax = Math.round(totalPrice / (1 + Number(tax)));
        tax = totalPrice - totalPriceNoTax;
        var product = {
            id: $('.b2b-product-detail-content').data('id'),
            name: $('.b2b-product-detail-content .name').text(),
            price: price,
            quantity: quantity,
            optionId: optionId,
            optionValue: optionValue || '',
            noTaxPrice: totalPriceNoTax,
            taxPrice: tax,
        };
        if (isNaN(product.quantity)) product.quantity = 0;
        var isCartChanged = storeToCart(product);
        $(window).trigger('modifyCart');

        toastr.options = {
            "positionClass": "toast-top-center"
        }
        if (isCartChanged)
            toastr.info('成功將「' + product.name + '」' + product.optionValue + ' ' + product.quantity + ' 份加進購物車');
        else
            toastr.info('「' + product.name + '」' + product.optionValue + ' ' + product.quantity + ' 份已經在購物車中囉');

    });
});

var FixedCart = new Vue({
    el: '#cart-fixed',
    data: {
        carts: JSON.parse(localStorage.cart || '[]'),
    },
    methods: {
        removeProduct: function(index, event) {
            removeFromCart(index);
            $(window).trigger('modifyCart');
            this.carts = JSON.parse(localStorage.cart || '[]');
        },
    },
    created: function() {
        $(window).on('modifyCart', function() {
            this.carts = JSON.parse(localStorage.cart || '[]');
        }.bind(this));
    }
});

var Cart = new Vue({
    el: '#cart',
    data: {
        carts: JSON.parse(localStorage.cart || '[]'),
    },
    methods: {
        removeProduct: function(index, event) {
            removeFromCart(index);
            $(window).trigger('modifyCart');
            this.carts = JSON.parse(localStorage.cart || '[]');
        },
    },
    created: function() {
        $(window).on('modifyCart', function() {
            this.carts = JSON.parse(localStorage.cart || '[]');
        }.bind(this));
    }
});

var MobileCart = new Vue({
    el: '#mobile-cart',
    data: {
        carts: JSON.parse(localStorage.cart || '[]'),
    },
    methods: {
        removeProduct: function(index, event) {
            removeFromCart(index);
            $(window).trigger('modifyCart');
            this.carts = JSON.parse(localStorage.cart || '[]');
        },
    },
    created: function() {
        $(window).on('modifyCart', function() {
            this.carts = JSON.parse(localStorage.cart || '[]');
        }.bind(this));
    }
});

var MobileCartIcon = new Vue({
    el: '#mobile-cart-icon',
    data: {
        carts: JSON.parse(localStorage.cart || '[]'),
    },
    methods: {
        removeProduct: function(index, event) {
            removeFromCart(index);
            $(window).trigger('modifyCart');
            this.carts = JSON.parse(localStorage.cart || '[]');
        },
    },
    created: function() {
        $(window).on('modifyCart', function() {
            this.carts = JSON.parse(localStorage.cart || '[]');
        }.bind(this));
    }
});

var OrderForm = new Vue({
    el: '#orderForm',
    data: {
        carts: JSON.parse(localStorage.cart || '[]'),
    },
    methods: {
        removeProduct: function(index, event) {
            removeFromCart(index);
            $(window).trigger('modifyCart');
            this.carts = JSON.parse(localStorage.cart || '[]');
            var cartsLen = this.carts.length;
            if (cartsLen === 0) {
                swal({
                    title: '提醒',
                    text: '您的購物車內是空的，請回首頁選購商品。',
                    type: 'info',
                }, function() {
                    window.location.href = '/';
                })
            }
        },
    },
    computed: {
        regularTotal: function() {
            var sum = 0;
            $(this.carts).each(function(index, el) {
                sum += el.noTaxPrice;
            });
            return sum;
        },
        regularTax: function() {
            var sum = 0;
            $(this.carts).each(function(index, el) {
                sum += el.taxPrice;
            });
            return sum;
        }
    },
    created: function() {
        $(window).on('modifyCart', function() {
            this.carts = JSON.parse(localStorage.cart || '[]');
        }.bind(this));
    },
    filters: {
        moneyNum: function(n) {
            var moneyFormat = /(\d)(?=(\d{3})+(?!\d))/g;
            return n.toString().replace(moneyFormat, "$1,");
        }
    }

});
