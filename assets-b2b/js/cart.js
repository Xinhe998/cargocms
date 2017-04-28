function getProductInfo(productDom) {
  var max = parseInt(productDom.find('input').prop('max'));
  var number = parseInt(productDom.find('input').val());
  if (number > max ){
    number = max;
    swal({
      title:'提示',
      text: `<p>訂購數量超過庫存量。</p></br></p>可購買數量 ${max} 包</p>`,
      html: true
    })
  }
  if(!number) number = 0;
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

function storeToCart(product) {
  var cart = JSON.parse(localStorage.cart || '[]');
  var replace = false;
  cart = $(cart).map(function (i, e) {
    if (e.id === product.id && e.optionId === product.optionId) {
      replace = true;
      return product;
    } else return e;
  }).toArray();
  if (!replace) {
    cart.push(product);
  }
  cart = $(cart).filter(function (i, e) {
    if(e.quantity == 0) return false;
    else return true;
  }).toArray();
  localStorage.cart = JSON.stringify(cart);
}

function removeFromCart(product) {
  var cart = JSON.parse(localStorage.cart || '[]');
  cart = $(cart).filter(function (i, e) {
    if(e.id == product.id && e.optionId === product.optionId) return false;
    else return true;
  }).toArray();
  localStorage.cart = JSON.stringify(cart);
}

function updateCartInput() {
  $('.product .form-group input').val(0);
  $('.b2b-product-detail-content .order-input input').val(0);

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
    $('li#cart span.badge').css('background-color', '#000');
  } else {
    $('li#cart > a').css('color', '#777');
    $('li#cart > a').css('font-size', '14px');
    $('li#cart span.badge').css('background-color', '#777');
  }
}

$(function () {
  updateCartInput();
  $(window).on('modifyCart', function () {
    updateCartInput();
  });

  $('.product input[type="number"]').bootstrapNumber();
  $('.product .input-group').click(function (e) {
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
    var tax = Number($('.product-tax').text());
    var price = Number($('.b2b-product-detail-content .price span').text());
    var quantity = parseInt($('.b2b-product-detail-content .order-input input').val());
    var totalPrice = price * quantity;
    var totalPriceNoTax = Math.round(totalPrice / (1 + Number(tax)));
    tax = totalPrice - totalPriceNoTax;
    var product = {
      id: $('.b2b-product-detail-content').data('id'),
      name: $('.b2b-product-detail-content .name').text(),
      price: price,
      quantity: quantity,
      optionId: optionId,
      optionValue: optionValue,
      noTaxPrice: totalPriceNoTax,
      taxPrice: tax,
    };
    if (isNaN(product.quantity)) product.quantity = 0;
    storeToCart(product);
    $(window).trigger('modifyCart');
  });
});

var Cart = new Vue({
  el: '#cart',
  data: {
    carts: JSON.parse(localStorage.cart || '[]'),
  },
  methods: {
    removeProduct: function (index, event) {
      removeFromCart(index);
      $(window).trigger('modifyCart');
      this.carts = JSON.parse(localStorage.cart || '[]');
    },
  },
  created: function () {
    $(window).on('modifyCart', function () {
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
    removeProduct: function (index, event) {
      removeFromCart(index);
      $(window).trigger('modifyCart');
      this.carts = JSON.parse(localStorage.cart || '[]');
    },
  },
  computed: {
    priceSum: function () {
      var sum = 0;
      $(this.carts).each(function(index, el) {
        sum += el.noTaxPrice;
      });
      return sum;
    },
    taxPrice: function () {
      var sum = 0;
      $(this.carts).each(function(index, el) {
        sum += el.taxPrice;
      });
      return sum;
    }
  },
  created: function () {
    $(window).on('modifyCart', function () {
      this.carts = JSON.parse(localStorage.cart || '[]');
    }.bind(this));
  },

  filters: {
    moneyNum: function( n ){
      var moneyFormat = /(\d)(?=(\d{3})+(?!\d))/g;
      return n.toString().replace( moneyFormat , "$1,");
    }
  }

});
