
module.exports = {
  templete:{
    event: {
      productShipped: {
        sendBy: 'email',
        subject: '訂單 %(orderNumber)s 產品出貨',
        html: `<html><body>
        <br />Hi %(username)s:

        <br />親愛的顧客，您所訂購的產品
        <br />
        <br />%(productName)s
        <br />
        <br />已出貨
        <br />
        <br />訂單編號為： %(orderNumber)s
        <br />聯繫姓名： %(shippingName)s
        <br />聯繫電話： %(phone)s
        <br />聯繫地址： %(address)s
        <br />
        <br />
        <br />From %(storeName)s
        </body></html>`
      },
      orderCreated: {
        sendBy: 'email',
        subject: '訂單 %(orderSerialNumber)s 建立完成',
        html: `<html><body>
        <br />Hi %(username)s:

        <br />感謝你的訂購，你所訂購的產品
        <br />
        <br />%(productName)s
        <br />
        <br />已訂購完成
        <br />
        <br />訂單編號為： %(orderSerialNumber)s
        <br />收件者為： %(shipmentUsername)s
        <br />收件者電話： %(phone)s
        <br />收件地址為： %(shipmentAddress)s
        <br />備註： %(note)s
        <br />
        <br />
        <br />From %(storeName)s
        </body></html>`
      },
      orderConfirm: {
        sendBy: 'email',
        subject: '訂單 %(orderSerialNumber)s 已確認',
        html: `<html><body>
        <br />Hi %(username)s:

        <br />感謝你的訂購，你所訂購的產品
        <br />
        <br />%(productName)s
        <br />
        <br />訂單已完成確認
        <br />
        <br />訂單編號為： %(orderSerialNumber)s
        <br />收件者姓名： %(shipmentUsername)s
        <br />收件者電話： %(phone)s
        <br />收件者地址： %(shipmentAddress)s
        <br />備註： %(note)s
        <br />
        <br />廠商將會盡快為您安排出貨
        <br />
        <br />
        <br />From %(storeName)s
        </body></html>`
      },
      orderConfirmToSupplier: {
        sendBy: 'email',
        subject: '出貨單 %(orderSerialNumber)s 已建立',
        html: `<html><body>
        <br />Hi %(supplier)s:
        <br />
        <br />出貨單 %(orderSerialNumber)s 已建立
        <br />
        <br />出貨單內產品
        <br />%(productName)s
        <br />
        <br />收件者姓名： %(shipmentUsername)s
        <br />收件者郵件： %(shipmentEmail)s
        <br />收件者電話： %(phone)s
        <br />收件者地址： %(shipmentAddress)s
        <br />
        </body></html>`
      }
    }
  }
}
