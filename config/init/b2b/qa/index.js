module.exports.init = async () => {
  try {
    sails.log("init QA!!!!!!!!!!!!!!!!!")
    const isDevMode = sails.config.environment === 'development';
    const isDropMode = sails.config.models.migrate == 'drop';

    // if (isDevMode && isDropMode) {

      const post = await Post.create({
        title: '購物常見問題',
        content: '',
        abstract: '',
        type: 'internal-event'
      });

      await Event.create({
        title: '如何線上訂購？',
        description: `雲端漁場目前僅提供線上訂購的服務，以下說明詳細訂購流程。<br>
<ul>        
<li>未註冊會員：會員註冊→填寫會員資料→註冊完成→挑選品項及數量→結帳→填寫寄送資料→訂購完成</li>
<li>已註冊會員:會員登入→挑選品項及數量→結帳→填寫寄送資料→訂購完成</li>
</ul>`,
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post.id
      });
      await Event.create({
        title: '我已下訂單了，如何取消訂單或更改訂購內容？',
        description: '若您欲取消訂購，麻煩請撥打客服專線0905-732-881請客服人員為您取消訂單喔~ 若您已完成下訂，但想要再改變訂單內容，目前雲端漁場為提供更改訂單內容的服務，因此，麻煩您請先取消原先的訂單再重新下訂。 ',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post.id
      });
      await Event.create({
        title: '目前雲端漁場提供哪些付款方式？',
        description: `目前雲端漁場的付款方式有ATM轉帳及貨到付款兩種。<br>
ATM轉帳帳號資訊如下：<br>
兆豐商業銀行<br>
銀行代號：017（斗六分行）<br>
銀行帳號：063-09-11893-9
        `,
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post.id
      });
      await Event.create({
        title: '若我已匯款，如何確認是否匯款成功？',
        description: '若完成匯款，麻煩請撥打客服專線0905-732-881或加入雲端農場LINE@請客服人員查帳。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post.id
      });
      const host = sails.config.appUrl;
      let imgUri = 'assets/b2b/img/Q&A/01.png';
      await Event.create({
        title: '如何查詢訂單狀態？',
        description: '若您欲查詢訂單狀況，可登入會員查詢訂單狀況。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post.id
      });
      await Event.create({
        title: '為什麼每個品項都要加收運費？',
        description: '由於雲端漁場的魚貨都是產地直送，因此您所訂購的品項皆由各產地分開運送，且為了提供漁民合理的收入，雲端漁場將向消費者酌收魚貨運輸的相關費用。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post.id
      });

      const post2 = await Post.create({
        title: '出貨常見問題',
        content: '',
        abstract: '',
        type: 'internal-event'
      });

      await Event.create({
        title: '目前提供哪些運送方式？',
        description: `目前雲端漁場漁獲的運送方式以低溫宅配為主，漁獲將送達時宅配人員將以電話聯繫您，請保持電話暢通，確保新鮮漁獲順利送達手中。<br>
若您是貨到付款，請您自備零錢，若需退貨請聯繫雲端漁場，宅配人員無法為您辦理退貨程序。`,
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post2.id
      });
      await Event.create({
        title: '目前合作的物流廠商？',
        description: '雲端漁場目前配合的宅配物流廠商是黑貓宅急便，所有漁獲皆以低溫宅配，確保漁獲新鮮美味。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post2.id
      });
      await Event.create({
        title: '下完訂單之後大約幾天後會收到呢？',
        description: '當您下訂單完畢後，雲端漁場將會依出貨時間為您出貨，出貨時會以E-mail通知出貨及宅配單號，預計下訂單後的1~2天會送達。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post2.id
      });
      await Event.create({
        title: '為什麼我訂購的品項分批送達？',
        description: '由於雲端漁場是產地直送，各個漁獲的產地及捕撈時間不一樣，因此各漁獲將會分開計送，故會分批送達。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post2.id
      });
      await Event.create({
        title: '請問運費如何計算？',
        description: '雲端漁場的漁獲皆透過低溫宅配至您的手中，因此運費的計算方式皆遵循黑貓宅急便的收費方式而訂。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post2.id
      });
      await Event.create({
        title: '台灣外島地區可以送嗎？',
        description: '目前雲端漁場的配送範圍以台灣本道為優先，外島地區正在陸續安排中。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post2.id
      });

      const post3 = await Post.create({
        title: '退貨換貨常見問題',
        content: '',
        abstract: '',
        type: 'internal-event'
      });

      await Event.create({
        title: '如何辦理退貨及換貨？',
        description: `雲端漁場只接受退貨，目前尚未提供換貨的服務。<br>
由於漁獲的新鮮程度會受到時間的影響，因此請您開箱魚貨時全程錄影，若有任何瑕疵或錯誤務必收到漁獲兩小時之內通知雲端漁場客服人員協助處理，請宅配公司到場收貨，若超過2天(收到漁獲後兩天)才通知，便會影響自身的退貨權力。`,
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post3.id
      });
      await Event.create({
        title: '我收到的品項有瑕疵該如何處理？',
        description: '請您開箱魚貨時全程錄影，若有任何瑕疵或錯誤務必收到漁獲兩小時之內通知雲端漁場客服人員協助處理，若超過2天(收到漁獲後兩天)才通知，便會影響自身的退貨權力。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post3.id
      });
      await Event.create({
        title: '退款方式及退款時間？',
        description: '若魚貨退貨程序辦理完成後，雲端漁場將於1~7天內將款項退回您的帳戶。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post3.id
      });
      await Event.create({
        title: '什麼情況無法辦理退貨？',
        description: '當您收到漁貨後，請盡快進行冷藏或冷凍，若因自身原因造成漁貨品質損壞或超過三天未通知漁貨之瑕疵或錯誤，雲端漁場將不接受退貨服務，損失將由消費者全權負責。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post3.id
      });

      const post4 = await Post.create({
        title: '發票常見問題',
        content: '',
        abstract: '',
        type: 'internal-event'
      });

      await Event.create({
        title: '發票內容有誤如何處理？',
        description: '若您收到發票時內容有誤，請盡快通知雲端漁場客服人員，並將發票以掛號寄回雲端漁場：雲林縣斗六市大學路3段123號雲端農業服務中心。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post4.id
      });
      await Event.create({
        title: ' 商品收到了但未收到發票該如何處理？',
        description: '若您收到商品，但卻未收到發票請盡快通知雲端漁場客服人員進行確認，雲端漁場將會補寄給您。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post4.id
      });
      await Event.create({
        title: '同一筆訂單，可以開立多張發票嗎？',
        description: '目前雲端漁場發票開立是根據訂單內容，若再發票的開立有特殊需求，麻煩撥打雲端漁場客服專線0905-732-881聯繫客服人員進行詢問。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post4.id
      });
      await Event.create({
        title: '發票可以指定日期嗎？',
        description: '目前雲端漁場發票日期已訂購日期為準，不提供發票只訂日期之服務。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post4.id
      });

    // }

  } catch (e) {
    console.error(e);
  }
};
