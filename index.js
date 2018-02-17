'use strict';

exports.jira = (request, response) => {
  console.log(request.body);
  response.status(200).send('Hello World!');
}
