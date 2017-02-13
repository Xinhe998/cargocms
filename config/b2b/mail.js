
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
    }
  }
}
