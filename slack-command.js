const querystring = require('querystring');
const environments = require('./environments');
const database = require('./database');
const slack = require('./slack');
const users = require('./users');

exports.handleSlackMessage = function handleSlackMessage(event) {

  const bodyString = event.body || '';
  if (!bodyString) {
    console.log('No body');
    return { statusCode: 400 };
  }
  const body = querystring.parse(bodyString);
  if (body.token !== 'xHhJBe2oV00bdJ0PZonw1ZcU') {
    console.log('Bad token ' + body.token);
    return { statusCode: 401 };
  }

  console.log(body);
  return { statusCode: 201 };
};

exports.handle = function handle(event) {
  const query = querystring.parse(event.body);
  const command = query && query.text || '';
  const user = users.getCanonicalName(query.user_name);

  const claimMatch = (/^claim (\w+)/i).exec(command);
  if (claimMatch && environments.isValid(claimMatch[1])) {
    const env = claimMatch[1];

    return database.markEnvironment(user, env, new Date())
      .then(() => slack.post(`${user} is using *${env}*`))
      .then(() => ({ statusCode: 200 }));
  }

  const releaseMatch = (/^free (\w+)/i).exec(command);
  if (releaseMatch && environments.isValid(releaseMatch[1])) {
    const env = releaseMatch[1];

    return database.markEnvironment(user, env, null)
      .then(() => slack.post(`${user} is no longer using *${env}*`))
      .then(() => ({ statusCode: 200 }));
  }

  const listMatch = (/^list($|\s)/i).exec(command);
  if (listMatch) {
    function formatTime(time) {
      let hours = time.getHours();
      const amPm = hours < 12 ? 'am' : 'pm';
      if (hours > 12) {
        hours -= 12;
      }
      const minutes = time.getMinutes() < 10 ? ('0' + time.getMinutes()) : time.getMinutes();
      return `${hours}:${minutes}${amPm}`;
    }

    return environments.getActive()
      .then((envs) => ({
        statusCode: 200,
        body: envs.length ?
          `Active environments: ${envs.sort(sortEnvironments).map((env) => `*${env.environment}* (${users.getCanonicalName(env.username)} since ${formatTime(env.time)})`).join('\n')}` :
          'Everything is free, take one!'
      }));
  }

  return Promise.resolve({
    statusCode: 200,
    body: '*How to use:*\n' +
    '`list`: Show active environments\n' +
    '`claim <env>`: Mark environment as _in use_\n' +
    '`free <env>`: Mark environment as no longer used\n' +
    '`help`: Show this help'
  });
};

function sortEnvironments(a, b) {
  return a.environment < b.environment ? -1 : a.environment > b.environment ? 1 : 0;
}
