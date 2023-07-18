// Create a web server that can respond to requests for comments
// and can save new comments to a file

// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url);
  var parsedQuery = querystring.parse(parsedUrl.query);
  var pathname = parsedUrl.pathname;

  if (pathname === '/comments' && request.method === 'GET') {
    response.writeHead(200, {"Content-Type": "text/plain"});
    fs.readFile('./comments.json', function (err, data) {
      if (err) throw err;
      response.end(data);
    });
  } else if (pathname === '/comments' && request.method === 'POST') {
    var requestBody = '';
    request.on('data', function(data) {
      requestBody += data;
    });
    request.on('end', function() {
      var comment = querystring.parse(requestBody);
      fs.readFile('./comments.json', function (err, data) {
        if (err) throw err;
        var comments = JSON.parse(data);
        comments.push(comment);
        fs.writeFile('./comments.json', JSON.stringify(comments), function (err) {
          if (err) throw err;
          console.log('It\'s saved!');
          response.end();
        });
      });
    });
  } else {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.end('Not found');
  }
});

// Listen on port 8000, IP defaults to