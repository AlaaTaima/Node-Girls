const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const router = (request, response) => {
  const endpoint = request.url;
  if (endpoint === '/') {
    console.log(endpoint);
    const filePAthe = path.join(__dirname, '..', 'public', 'index.html');
    fs.readFile(filePAthe, (error, data) => {
      if (error) {
        console.log(error);
        return;
      } else {
        response.writeHead(404, { 'Content-Type': 'Text/html' });
        response.end(data);
      }
    });
  } else if (endpoint.includes('/public')) {
    const path1 = endpoint.split('/');
    console.log(path1);
    const filePath = path.join(__dirname, '..', ...path1);
    const ext = endpoint.split('.')[1];
    const obj = {
      html: 'text/html',
      css: 'text/css',
      js: 'application/javascript',
      png: 'image/png',
      jpg: 'image/jpg'
    };
    fs.readFile(filePath, (error, file) => {
      if (error) {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end('error');
      } else {
        response.writeHead(200, { 'Content-Type': obj[ext] });
        response.end(file);
      }
    });
  } else if (endpoint === '/create-post') {
    let allTheData = '';
    request.on('data', chunkOfData => {
      allTheData += chunkOfData;
    });
    request.on('end', () => {
      const data = querystring.parse(allTheData);
      const filePath = path.join(__dirname, 'posts.json');
      fs.readFile(filePath, (error, file) => {
        if (error) {
          response.writeHead(500, { 'Content-Type': 'application/javascript' });
          response.end();
        } else {
          const posts = JSON.parse(file);
          posts[Date.now()] = data.post;
          fs.writeFile(filePath, JSON.stringify(posts), err =>
            console.log(err)
          );
        }
      });
    });
    response.writeHead(302, { Location: '/' });
    response.end();
  } else if (endpoint === '/posts') {
    const filePAthe = path.join(__dirname, 'posts.json');
    fs.readFile(filePAthe, (error, file) => {
      if (error) {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end('error');
      } else {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(file);
      }
    });
  }
};

module.exports = router;
