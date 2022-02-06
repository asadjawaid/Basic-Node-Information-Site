const http = require('http');
const fs = require('fs');
const path = require('path');

// create the server
const server = http.createServer((req, res) => {
  // build the file path:
  // recall req.url includes everything after hostname and /
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

  // get the extension of the current file
  let ext = path.extname(filePath);
  let contentType = 'text/html'; // default value

  // check the extension type.
  switch(ext) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
  }

  // if the content type is text/html but no extension then append .html to the file path
  // for example user enters: localhost:8000/fssdf
  if(contentType === 'text/html' && ext === "") {
    // append .html to the file
    filePath += '.html'; // e.g. fssdf.html (does not exists)
  }

  // read in the file path
  fs.readFile(filePath, (err, data) => {
    if(err) {
      // check if the error code is not found (ENONET)
      if(err.code === "ENOENT") {
        // display the 404 html file
        fs.readFile(path.join(__dirname, 'public', '404.html'), (error, content) => {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(content, 'utf-8'); // send the 404.html file to the client
        })
      }
      // if the error code is not a 404 or not found
      else {
        // server error
        res.writeHead(500);
        res.end(`Server error! Error code: ${err.code}`);
      }
    }
    // sucessfully finding the file in public directory
    else {
      res.writeHead(200, {'Content-Type': contentType});
      res.end(data, 'utf-8'); // send data to the client and it must be in utf-8
    }
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
