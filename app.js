var http=require('http');
var fs=require('fs');
var url=require('url');
var path=require('path');
var app=function(req,res){
	var q=url.parse(req.url,true);
	if(q.pathname==='/'){
		q.pathname='/index.html';
	}
	var fileName='.'+q.pathname;
	var ext=path.extname(fileName);
	var mime={
		'.ico': 'image/x-icon',
		'.html': 'text/html',
		'.js': 'text/javascript',
		'.json': 'application/json',
		'.css': 'text/css',
		'.png': 'image/png',
		'.jpg': 'image/jpeg',
		'.wav': 'audio/wav',
		'.mp3': 'audio/mpeg',
		'.svg': 'image/svg+xml',
		'.pdf': 'application/pdf',
		'.doc': 'application/msword',
		'.eot': 'appliaction/vnd.ms-fontobject',
		'.ttf': 'aplication/font-sfnt'
	};
	fs.readFile(fileName,function(err,data){
		if(err){
			res.writeHead(404,{
				'Content-Type':'text/html'
				}
			);
			return res.end('404 File not found!');
		}
		else{
			res.writeHead(200,{
				'Content-Type':mime[ext]
				}
			);
			res.write(data);
			return res.end();
		}
	});
};
http.createServer(app).listen(8080);
console.log('Server running:http://localhost:8080/');