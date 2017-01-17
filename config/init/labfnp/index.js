import allpay from './allpay';
import events from './events';
import facebook from './facebook';
import message from './message';
import post from './post';
import menuItem from './menuItem';
import other from './other';
import quote from './quote';
import fakeusers from './../default/fakeusers';
import user from './../default/user';

module.exports.init = async function(){

  await allpay.init();
  await events.init();
  await facebook.init();
  await post.init();
  await menuItem.init();
  await other.init();
  await fakeusers.init();
  await user.init();
}
