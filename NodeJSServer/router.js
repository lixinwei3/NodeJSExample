var fs = require('fs');
var path = require('path');
var mime = require('./mime').types;
var config = require("./config");
var zlib = require("zlib");

function route(handle,params,response,postData){
	var pathname=params.pathname
	console.log("About to route a request for "+pathname);
	if(typeof handle[pathname]==='function'){
		handle[pathname](params,response,postData);
	} else {
		var realPath = path.join("assets", path.normalize(pathname.replace(/\.\./g, "")));
		fs.stat(realPath, function(err,stats){
			if(err){
				console.log("No request handler found for "+pathname);
				response.writeHead(404,{"Content-Type":"text/plain"});
				response.write("404 Not found");
				response.end();
			} else{
				var lastModified = stats.mtime.toUTCString();
				response.setHeader("Last-Modified", lastModified);
					
				var ext = path.extname(realPath);
				ext = ext ? ext.slice(1) : 'unknown';
				var contentType = mime[ext] || "text/plain";
				
				fs.readFile(realPath,"binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });

                    response.end(err);
                } else {
                    if (ext.match(config.Expires.fileMatch)) {
						var expires = new Date();
						expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
						response.setHeader("Expires", expires.toUTCString());
						response.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
					}
					response.writeHead(200, {
                        'Content-Type': contentType,
						'Connection':'keep-alive',
						'Transfer-Encoding':'chunked'
                    });
			
                    response.write(file, "binary");
                    response.end();
                }
            });
			}
		});
		
	}
}

exports.route=route;