var http = require('http');
var url = require('url');

function start(route, handle){
	function onRequest(request, response) {
		var postData="";
		var params = url.parse(request.url,true);
		
		console.log(params);
		
		request.setEncoding("utf8");
		
		request.on("data",function(postDataChunk){
			postData+=postDataChunk;
			console.log("Received POST data chunk '"+ postDataChunk + "'.");
		});		
		
		request.on("end",function(){
			route(handle, params, response, postData);
		});
	}

	http.createServer(onRequest).listen(8080);
	console.log("Server has started");
}

exports.start=start;