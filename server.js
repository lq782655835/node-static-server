var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var zlib = require("zlib");
var querystring = require('querystring');

var mime = {

  "css": "text/css",

  "gif": "image/gif",

  "html": "text/html",

  "ico": "image/x-icon",

  "jpeg": "image/jpeg",

  "jpg": "image/jpeg",

  "js": "text/javascript",

  "json": "application/json",

  "pdf": "application/pdf",

  "png": "image/png",

  "svg": "image/svg+xml",

  "swf": "application/x-shockwave-flash",

  "tiff": "image/tiff",

  "txt": "text/plain",

  "wav": "audio/x-wav",

  "wma": "audio/x-ms-wma",

  "wmv": "video/x-ms-wmv",

  "xml": "text/xml"

};

var config = {
    Expires : {

        fileMatch: /^(gif|png|jpg|js|css)$/ig,

        maxAge: 60*60*24*365
        
    },
    Compress : {
        match: /css|js|html/ig
    }

};

var server = http.createServer(function(request, response) {

    var pathname = url.parse(querystring.unescape(request.url)).pathname;

    var realPath = path.join("static", pathname);

    fs.exists(realPath, function (exists) {

        console.log( realPath + ' %d', exists ? 200 : 404 );

        if (!exists) {

            response.writeHead(404, "Not Found", {'Content-Type': 'text/plain'});

            response.write("This request URL " + pathname + " was not found on this server.");

            response.end();

        } else {

            var ext = path.extname(realPath);

            ext = ext ? ext.slice(1) : 'unknown';

            var contentType = mime[ext] || "text/plain";

            response.setHeader("Content-Type", contentType);



            fs.stat(realPath, function (err, stat) {

                var lastModified = stat.mtime.toUTCString();

                var ifModifiedSince = "If-Modified-Since".toLowerCase();

                response.setHeader("Last-Modified", lastModified);



                if (ext.match(config.Expires.fileMatch)) {

                    var expires = new Date();

                    expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);

                    response.setHeader("Expires", expires.toUTCString());

                    response.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);

                }



                if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {

                    response.writeHead(304, "Not Modified");

                    response.end();

                } else {

                    var raw = fs.createReadStream(realPath);

                    var acceptEncoding = request.headers['accept-encoding'] || "";

                    var matched = ext.match(config.Compress.match);



                    if (matched && acceptEncoding.match(/\bgzip\b/)) {

                        response.writeHead(200, "Ok", {'Content-Encoding': 'gzip'});

                        raw.pipe(zlib.createGzip()).pipe(response);

                    } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {

                        response.writeHead(200, "Ok", {'Content-Encoding': 'deflate'});

                        raw.pipe(zlib.createDeflate()).pipe(response);

                    } else {

                        response.writeHead(200, "Ok");

                        raw.pipe(response);

                    }

                }

            });

        }

    });

});

var port = 8000;
// server层面监听
// server.on('connection', e => console.log(e, 111)) // 每次请求连接时
server.on('close', e => console.log(e, 111))
server.on('error', err => { // 遇到server启动错误时触发，比如端口重名
    switch (err.code) {
        case 'EADDRINUSE':
            console.error('\033[33mWARN:\033[90m Port \033[33m%d\033[90m is already in use.', err.port);
            server.listen(err.port + 1, console.log('server listen on port %d', err.port + 1));
            break;
        default:
            throw err;
    }
})

// 当没有process没有监听uncaughtException事件时，默认遇到错误会直接退出nodejs程序
// 如果注册了，手动权在开发者手上，不会自动退出process
process.on('uncaughtException', err => { // 处理错误
    console.error('There was an uncaught error', err, 1)
    // process.exit(1) // 手动退出
})

server.listen(port, () => console.log('server listen on port %d', port));



