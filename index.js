const Koa = require('koa');
const path = require('path');
const fs = require('fs');
const cors = require('koa-cors');
const koaStaticCache = require('koa-static-cache');
const open = require('open');
const app = new Koa();
const port = 3434;
const staticUrl = `http://localhost:${port}/public`;
const staticPath = path.resolve(__dirname, 'static');


app.use(cors({
	origin: function() {
		return '*'
	}
}))
app.use(koaStaticCache(__dirname + '/static', { // 3.配置静态资源
    // root:'',
    prefix: '/public', // 例如 localhost:3000/public/index.html
    maxAge: 365 * 24 * 60 * 60,
}))

let body = '';
fs.readdir(staticPath, (err, files) => {
    if (err) {
        console.warn(err)
    } else {
        //遍历读取到的文件列表
        files.forEach((filename) => {
            //获取当前文件的绝对路径
            const fileDir = path.join(staticPath, filename);
            //根据文件路径获取文件信息，返回一个fs.Stats对象
            fs.stat(fileDir, (eror, stats) => {
                if(eror){
                    console.warn('获取文件stats失败');
                }else{
                    var isFile = stats.isFile();//是文件
                    var isDir = stats.isDirectory();//是文件夹
                    if(isFile && filename.includes('.html')){
                        const url = `./public/${filename}`;
                        body += `<div><a href="${url}">${filename}</a></div>`
                    }
                }
            })
        });
    }
});

app.use(async ctx => {
    ctx.body = body;
});

app.listen(port);
console.log('Listening on port ' + port);
open(`http://localhost:${port}`, {app: 'chrome'})
