import allpay from './allpay';
import events from './events';
import facebook from './facebook';
import message from './message';
import post from './post';
import menuItem from './menuItem';
import other from './other';
import quote from './quote';

module.exports.init = async function(initDefault){
  console.log("=== hook labfnp bootstrap ===");
  await allpay.init();
  await events.init();
  await facebook.init();
  await post.init();
  await menuItem.init();
  await other.init();
  await initDefault.fakeusers.init();
  await initDefault.user.init();
}
