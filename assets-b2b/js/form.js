$(document).ready(function() {

	var submitData = function(form) {
		var api = $(form).attr('action');
		var method = $(form).attr('method');

		var values = {};
		$.each($(form).serializeArray(), function(i, field) {
			values[field.name] = field.value;
		});;

		var ajaxConfig = {
			url: api,
			method: method,
			dataType: 'json',
			//contentType: 'application/json',
			cache: false,
			data: {
				email: values['email'],
				firstname: values['firstname'],
				lastname: values['lastname'],
				telephone: values['telephone'],
				shippingLastname: values['shippingLastname'],
				shippingFirstname: values['shippingFirstname'],
				shippingEmail: values['shippingEmail'],
				shippingTelephone: values['shippingTelephone'],
				shippingAddress1: values['shippingAddress1'],
				shippingMethod: values['shippingMethod'],
				county: values['county'],
				district: values['district'],
				zipcode: values['zipcode'],
				products: values['products'],
				comment: values['comment'],
				token: values['token']
			}
		};
		var catchDone = function(result) {
      window.location.replace('/orderinfo/' + result.data.item.orderNumber);
		};
		var catchFail = function(result) {
			swal('錯誤', '建立訂單時出現問題，請稍候再試。', 'error');
		};
		$.ajax(ajaxConfig).done(catchDone).fail(catchFail);
	};

	$('#order').on("submit", function(event) {
		event.preventDefault()

		var $form = $(this);

		if (!$('#order').valid()) {
			return false;
		}

		swal({
			title: "確認",
			text: "是否確定訂購？請確認您同意並遵守《訂購須知》。",
			type: "info",
			confirmButtonClass: "btn-info",
			confirmButtonText: "是的",
			cancelButtonText: "先不要",
			showCancelButton: true,
			closeOnConfirm: false,
			showLoaderOnConfirm: true
		}, function(confirm) {
			if (confirm) {
				if ($form.data('submitted') === true) {
					return false;
				} else {
					$form.data('submitted', true);
					localStorage.cart = [];
					submitData($form);
					return true;
				}
			} else {
				return false;
			}
		});
	});

	$('#twzipcode').twzipcode({});
	$('#twzipcode input').addClass('form-control');
	$('#twzipcode select').addClass('form-control');

	$("#userInfo").on('change', function(event) {
		if ($("#userInfo").prop("checked")) {
			$("[name=shippingLastname]").val($("[name=lastname]").val());
			$("[name=shippingFirstname]").val($("[name=firstname]").val());
			$("[name=shippingEmail]").val($("[name=email]").val());
      $("[name=shippingTelephone]").val($("[name=telephone]").val());
		} else {
			$("[name=shippingLastname]").val('');
			$("[name=shippingFirstname]").val('');
			$("[name=shippingEmail]").val('');
			$("[name=shippingTelephone]").val('');
		}
	});

  $("#userAddress").on('change', function(event) {
    if ($("#userAddress").prop("checked")) {
      $("[name=county]").val($("[name=userCity]").val());
      $("[name=county]").change();
      $("[name=district]").val($("[name=userDistrict]").val());
      $("[name=zipcode]").val($("[name=userPostCode]").val());
      $("[name=shippingAddress1]").val($("[name=userAddress]").val());
    } else {
      $("[name=county]").val('');
      $("[name=district]").val('');
      $("[name=zipcode]").val('');
      $("[name=shippingAddress1]").val('');
    }
  });

	$("#order").validate({
		rules: {
			firstname: {
				required: true
			},
			lastname: {
				required: true
			},
			email: {
				required: true,
				email: true
			},
			telephone: {
				required: true
			},
			shippingLastname: {
				required: true
			},
			shippingFirstname: {
				required: true
			},
			shippingEmail: {
				required: true,
				email: true
			},
			shippingTelephone: {
				required: true
			},
			shippingAddress1: {
				required: true
			},
			county: {
				required: true
			},
			district: {
				required: true
			},
			zipcode: {
				required: true
			}
		},
		messages: {
			firstname: {
				required: "請輸入名字"
			},
			lastname: {
				required: "請輸入姓氏"
			},
			email: {
				required: "請輸入電子郵件",
				email: "請輸入正確電子郵件格式"
			},
			telephone: {
				required: "請輸入聯絡電話"
			},
			shippingLastname: {
				required: "請輸入名字"
			},
			shippingFirstname: {
				required: "請輸入姓氏"
			},
			shippingEmail: {
				required: "請輸入電子郵件",
				email: "請輸入正確電子郵件格式"
			},
			shippingTelephone: {
				required: "請輸入聯絡電話"
			},
			shippingAddress1: {
				required: "請輸入地址"
			},
			county: {
				required: "請選擇縣市"
			},
			district: {
				required: "請選擇區域"
			},
			zipcode: {
				required: "請輸入郵遞區號"
			}
		}
	});

	if ($('input[name=products]').val() === '[]') {

		$('button[type=submit]').attr('disabled', true);

		swal({
			type: "error",
			title: "注意",
			text: '此訂單已失效，請重新訂購',
			confirmButtonText: "確定"
		}, function() {
			window.location = "/";
		});
	}
});
