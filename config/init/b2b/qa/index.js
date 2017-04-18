module.exports.init = async () => {
  try {
    sails.log("init QA!!!!!!!!!!!!!!!!!")
    const isDevMode = sails.config.environment === 'development';
    const isDropMode = sails.config.models.migrate == 'drop';

    if (isDevMode && isDropMode) {

      await Post.create({
        title: 'Q1. Test',
        content: '我們可以這樣形容，當你手中捧到一束花時，可以聞到花束中的各種花材（ex:玫瑰、康乃馨..等)所組成的『這束花的味道』，接著抽出其中的一朵康乃馨',
        abstract: '我們可以這樣形容，當你手中捧到一束花時，可以聞到花束中的各種花材',
        type: 'internal-event'
      });

      await Event.create({
        title: 'test',
        description: 'test',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00'
      });

      done();

    }

  } catch (e) {
    console.error(e);
  }
};
