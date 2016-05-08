# aliez-match

aliez路由规则匹配

## 用法

```
var aliez = require('aliez'), http = require('http');
var aliez_match = require('aliez-match');

var app = aliez(function(req, res){
	// 纯字符串匹配
	req.match('/', function(req, res){
		res.end('hello world');
	});
	
	// 使用正则表达式
	req.match(/^\/image\/([a-zA-Z0-9]*)/, function(req, res){
		// 匹配结果
		res.end('image:' + req.REQUEST[0]);
	});
	
	// 使用字符串模板
	req.match('/tag/$tag/page/$page', function(req, res){
		// 匹配结果
		res.end('tag:' + req.REQUEST.tag + ' page:' + req.REQUEST.page);
	});
});

app.use(aliez_match);

http.createServer(app).listen(8080);
```