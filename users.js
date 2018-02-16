// github -> slack
const USER_NAMES = {
  'stefda': 'david',
  'jak': 'jak',
  'paullessing': 'paul',
  'alastairstuart': 'al'
};

exports.getCanonicalName = function getCanonicalName(user) {
  return USER_NAMES[user] || user;
};
