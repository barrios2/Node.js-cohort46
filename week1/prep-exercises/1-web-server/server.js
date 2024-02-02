/**
 * Exercise 3: Create an HTTP web server
 */

// imported required modules
const http = require('http');
const fs = require('fs')

// creating HTTP server
let server = http.createServer((req, res) => {
  // handling requests based on the requested URL
  if (req.url === '/') {
    fs.readFile('index.html', 'utf8', (err, data) => {
      if (err) { // if there's an error and the file can't be found then error 404 is set and will end with the error message
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('404. File not found');
        res.end();
      } else {
        // If no error, respond with a 200 status and send the contents of index.html to the client
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data); // Sends response back to the client
        res.end();
      }
    });
  } else if (req.url === '/index.js') {
    fs.readFile('index.js', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('404. File not found');
        res.end();
      } else {
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        res.write(data);
        res.end();
      }
    });
  } else if (req.url === '/style.css') {
    fs.readFile('style.css', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('404. File not found');
        res.end();
      } else {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      }
    })
  } else { // If the requested URL does not match any of the above, then error message is displayed 
    // used H1 for better view and only here to differentiate from the rest
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write('<h1>404 Page not found</h1>');
    res.end();
  }
});

server.listen(3000); // server listens on port 3000

