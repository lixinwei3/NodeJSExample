var http = require('http');
var url = require('url');

http.createServer(function (req,res){
	var pathname=url.parse(req.url).pathname;
	console.log('Request for '+pathname+' received.');
	
	var postData = '';
	
	//设置接收数据编码格式为 UTF-8
	req.setEncoding('utf8');
	
	// 接收数据块并将其赋值给 postData
	req.on('data', function(postDataChunk){
		postData+=postDataChunk;
	});
	
	req.on('end', function(){
		console.log(postData);
	});
	res.writeHead(200,{'Content-Type': 'text/plain'});
	res.end('Hello world\n');
}).listen(1336);

console.log('Server running at http://127.0.0.1:1336/');