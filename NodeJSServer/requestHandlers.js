var querystring=require("querystring");

function start(params,response,postData){
	console.log("Request handler 'start' was called.");
		
	var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" method="post">'+
    '<textarea name="text" rows="20" cols="60"></textarea>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(params,response,postData){
	console.log("Request handler 'upload' was called.");
	response.writeHead(200,{"Content-Type":"text/plain"});
	response.write("You've sent: " +querystring.parse(postData).text);
	response.end();
}

function GetChartData(params,response,postData){
var data = [
			['Date',       'Windows 7', 'Windows 8', 'Windows xp'],  
			['2000',              1916,         100,         1601],
			['2001',              2260,         114,         1936],
			['2002',              2302,          21,          585],
			['2003',              5408,         276,         7399],
			['2004',              4408,         176,         9399],
			['2005',              4408,         176,         9399],
			['2006',              4408,         176,         9399],
			['2007',              4408,         176,         9399],
			['2008',              4408,         176,         9399],
			['2009',              4408,         176,         9399],
			['2010',              1916,         100,         1601],
			['2011',              2260,         114,         1936],
			['2012',              2302,          21,          585],
			['2013',              5408,         276,         7399],
			['2014',              4408,         176,         9399],
			['2015',              4408,         176,         9399],
		  ];
	
	if(params.query){
		console.log(params.query.C);
		if(params.query.C=="date;")
		{
			var data = [
				['Date'    ],  
				['2000'],
				['2001'],
				['2002'],
				['2003'],
				['2004'],
				['2005'],
				['2006'],
				['2007'],
				['2008'],
				['2009'],
				['2010'],
				['2011'],
				['2012'],
				['2013'],
				['2014'],
				['2015'],
			  ];

			response.end(JSON.stringify(data));
		} else {
			var data = [
			['Date',       'Windows 7', 'Windows 8', 'Windows xp'],  
			['2000',              1916,         100,         1601],
			['2001',              2200,         114,         1936],
			['2002',              2302,          21,          585],
			['2003',              5408,         276,         4399],
			['2004',              4408,         176,         5399],
			['2005',              4408,         176,         5399],
			['2006',              4408,         176,         5399],
			['2007',              4408,         176,         5399],
			['2008',              4408,         176,         5399],
			//['2009',              4408,         176,         5399],
			//['2010',              1916,         100,         1601],
			//['2011',              2260,         114,         1936],
			//['2012',              2302,          21,          585],
			//['2013',              5408,         276,         3399],
			//['2014',              4408,         176,         5399],
			//['2015',              4408,         176,         1399],
			//['2016',              2260,         114,         1936],
			//['2017',              2302,          21,          585],
			//['2018',              5408,         276,         3399],
			//['2019',              4408,         176,         5399],
			//['2020',              4408,         176,         1399],
		  ];
		  response.end(JSON.stringify(data));
		}
	}else {
		response.end(JSON.stringify(data));
	}
}

function GetFilters(params,response,postData){
	var data = {"SearchItems":[{"Item":"date","DisplayName":"日期"},
				 	{"Item":"city","DisplayName":"城市"},
				 	{"Item":"Win7","DisplayName":"Windows 7"},
				 	{"Item":"Win8","DisplayName":"Windows 8"},
				 	{"Item":"WinXP","DisplayName":"Windows XP"}]}; 
	
	response.end(JSON.stringify(data));
}

exports.start=start;
exports.upload=upload;
exports.GetChartData=GetChartData;
exports.GetFilters=GetFilters;