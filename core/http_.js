/**
 *  http 网络编程
 *  两种使用方式:    1. 服务端  2.客户端  
 */

 const http = require('http')

 // 创建http服务器
 // HTTP请求本质上是一个数据流，由请求头（headers）和请求体（body）组成
// http模块在接受到请求头后 会调用回调函数
{
    const app = http.createServer((req,res) => {
       // console.log(req.headers)
        // 完整的请求头
        // { host: 'localhost:8001',
        // connection: 'keep-alive',
        // 'cache-control': 'max-age=0',
        // 'upgrade-insecure-requests': '1',
        // 'user-agent':
        // 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
        // accept:
        // 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        // 'accept-encoding': 'gzip, deflate, br',
        // 'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        // cookie: 'Hm_lvt_080836300300be57b7f34f4b3e97d911=1529056422' }
        
        const headers = {
            'Content-Type': 'text-plain'
        }

        // let body = [];
        // req.on('data', (chunk) => {
        //     chunk.toString()
        //     body.push(chunk)
        // })

        // req.on('end', () => {
        //     body = Buffer.concat(body)
        //     console.log(body.toString())
        // })
        
        res.writeHead(200,headers)
        res.end(process.argv[2])
        
    })

    // app.listen(8000)
}

// client    ---- https 解析
const https = require('https')
const fs = require('fs')

{
    // https.get('https://www.bilibili.com',(res) => {
    //     console.log(res.headers)
    //     let data = ''
    //     res.on('data', (chunk) => {
    //         data+=chunk.toString()
    //     })

    //     res.on('end',() => {
    //         console.log(data)   //  返回html 字符串
    //     })
    // })

    // 测试视频下载
    const url = 'https://www.bilibili.com/video/av50839659/'
    const ws = fs.createWriteStream('./test.mp4')

    let receivedBytes = 0;
    let totalBytes = 0;
    
    https.get(url,(res) => {
        res.pipe(ws)

        res.on('response', (data) => {
            // 更新总文件字节大小
            totalBytes = parseInt(data.headers['content-length'], 10);
        });

        res.on('data', (chunk) => {
            // 更新下载的文件块字节大小
            receivedBytes += chunk.length;
        })

        ws.on('finish',() => {
            console.log('写入完成')
        })

        res.on('end',() => {
            console.log(receivedBytes)
            console.log('写入完毕')   //  返回html 字符串
        })
    })

}









