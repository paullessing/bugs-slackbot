const database = require('./database');

exports.isValid = function isValid(name) {
  return [
    'amstel',
    'budvar',
    'corona',
    'doombar',
    'estrella',
    'fosters'
  ].indexOf((name || '').toLowerCase()) >= 0;
};

exports.getActive = function getActive() {
  return Promise.resolve()
    .then(() => database.getAllEnvironments())
    .then((envs) => envs
      .filter((env) => !!env.time)
      .map((env) => Object.assign({}, env, { time: new Date(env.time) }))
      .filter((env) => {
        const time = env.time.getTime();
        const now = new Date().getTime();
        return now - time < 8 * 3600 * 1000; // More than 8 hours since deploy
      })
    );
}
