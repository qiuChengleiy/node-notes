//app.js  
// 基本搭建 
const express = require('express');
const static = require('express-static');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');
const multer = require('multer');
const route = require('express-route');
const app = express();


//BODY PARSE
app.use(bodyParser());


//文件上传配置
const multerObj = multer({dest: './static/upload'});
app.use(multerObj.any());


//cookie session 配置
app.use(cookieParser());

~function(){
	//对session 做一些加密
	let keys = [];
	for(let i=0;i<10000;i++) {
		keys[i] = '%&sa_'+Math.random();
	}

	app.use(cookieSession({
		name: 'session_id',
		keys,
		maxAge: 20*60*1000 // 20 min out ...
	}))
}();


//模板配置
app.engine('html', consolidate.ejs);
app.set('views', 'template');
app.set('view engine', 'html');


//静态资源配置
app.use(static('./static/'));


//route 配置
app.use('/home/', require('./route/createRouter')().use());

//初始化数据库
const mongo_db = require('./model/test');

const serverPort = 8003;

app.listen(serverPort,() => {
	console.log(`\nServer is starting on port ${serverPort} ~~ O(∩_∩)O~~\n`);
})

//路由使用
module.exports = function() {
	const express = require('express');
	const router = express.Router();

	return {
		use(){
			router.use((req,res,next) => {
				//判断登录状态
				if(!req.session['admin_id'] && req.url != '/tipLogin' && req.url != '/login' && req.url != '/upload') {
					res.redirect('/home/tipLogin');

					const str = '123456';
					const a = require('../libs/common').md5(str);
					console.log(a);
				}else{
					next();
				}
			})

			router.get('/tipLogin',(req,res,next) => {
				res.render('tip.ejs',{message:'请登录哦~'})
			})
			
			router.get('/home',(req,res,next) => {
				res.render('./home.ejs',{title:'home', content:'express'});
				//res.send('ok home').end();
			});
			router.get('/login',(req,res,next) => {
				res.render('./admin/login.ejs',{res:'ok'})
			});
			router.get('/logins',(req,res,next) => {
				res.send(req.url).end();
			});

			router.post('/upload',(req,res,next) => {
				console.log(req.files);
				res.send(req.body).end();
			})

			return router;
		}
	}
}



// ejs模板基本使用
<!DOCTYPE html>
<html>
<head>
	<title>管理员登录</title>
</head>
<body>

<label for="user"></label>
<input type="text" name="username" id="user" value="" />

<label for="pass"></label>
<input type="password" name="pass" id="pass" value="" />

<label for="file">点击上传</label>
<input type="file" name="file" multiple="multiple" id="file" value="" style="text-indent: 0;opacity: 0" />

<button class="login">登录</button>
<button class="register">注册</button>
<button class="file">上传</button>

<img src="./upload/2f6d4eea7db48b0c6746a44d466e4130" class="up" />


<br/>
<form action="/home/upload" enctype="multipart/form-data" method="post">
	<label for="files">点击上传</label>
	<input type="file" name="touxiang" id="files" value="" style="text-indent: 0;opacity: 0"/>

	 <button type="submit">提交</button>
</form>

<br/>




<script type="text/javascript">

(function() {
	window.onload = ()=> {
		const userInpu = document.querySelector('#user');
		const passInpu = document.querySelector('#pass');
		const fileInpu = document.querySelector('#file');

		const loginbtn = document.querySelector('.login');
		const regbtn = document.querySelector('.register');
		const filebtn = document.querySelector('.file');

		const imgUp = document.querySelector('.up');

		if(window.XMLHttpRequest) {
			var ajaxRequest = new XMLHttpRequest();
		}else{
			var ajaxRequest = new ActiveXObject();
		}


		//登录测试
		loginbtn.addEventListener('click',function() {

			let username = userInpu.value;
			let password = userInpu.value;

			const url = {
				login:`/home/logins?username=${username}&password=${password}`,
			}

			ajaxRequest.open('GET',url.login,true);
			ajaxRequest.send();
			ajaxRequest.onreadystatechange = function() {

				if(ajaxRequest.readyState == 4) {
					
					if(ajaxRequest.status == 200) {
						console.log(ajaxRequest.responseText)
						document.write(ajaxRequest.responseText)
					}
				}
			}
	   },false);



		//文件上传测试
		filebtn.addEventListener('click',function() {

			let path = fileInpu.files[0]; 

			const file_url = {
				file:`/upload`,
			}

			ajaxRequest.open('POST',file_url.file,true);
			ajaxRequest.setRequestHeader("Content-type","multipart/form-data");
			ajaxRequest.send(path);
			ajaxRequest.onreadystatechange = function() {

				if(ajaxRequest.readyState == 4) {
					
					if(ajaxRequest.status == 200) {
						console.log(ajaxRequest.responseText)
						
					}
				}
			}
	   },false);

	}


})()

</script>


</body>
</html>


//数据库使用 mongodb

/**
* 数据库连接文件
*/

const mongoose = require('mongoose');
const db_url = 'mongodb://localhost:27018/test';

mongoose.connect(db_url);

mongoose.connection.on('connected',() => {
	console.log('\nMongoose is successful on port 27018~~~ O(∩_∩)O~~~\n');
})
mongoose.connection.on('error',() => {
	console.log('\nMongoose connection error: ' + err+'\n');
})
mongoose.connection.on('close',() => {
	console.log('\nMongoose connection disconnected ~~ \n')
})

module.exports = mongoose;



/**
*  用户信息表
*
*/

const mongoose = require('../../libs/db');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: { type:String,  },
	password: { type:String },
	userAge: { type:Number },
	time: { type: String },
	email: { type: String, index:true, default:'test@163.com' }
});

module.exports = mongoose.model('User', userSchema);

var User = require("./schema/user");
var db_ = require('./operateDB');

/**
 * 插入
 */
 function insert() {
 
    var user0 = new User({
        username : 'Tracy McGrady',                 //用户账号
        password: 'abcd',                            //密码
        userAge: 37,                                //年龄
        time : new Date()                      //最近登录时间
    });

     var user1 = new User({
        username : 'user1',                 //用户账号
        password: 'abcd',                            //密码
        userAge: 37,                                //年龄
        time : new Date()                      //最近登录时间
    });

      var user2 = new User({
        username : 'user12',                 //用户账号
        password: 'abcd',                            //密码
        userAge: 37,                                //年龄
        time : new Date()                      //最近登录时间
    });

       var user3 = new User({
        username : 'user13',                 //用户账号
        password: 'abcd',                            //密码
        userAge: 37,                                //年龄
        time : new Date()                      //最近登录时间
    });

        var user4 = new User({
        username : 'user14',                 //用户账号
        password: 'abcd',                            //密码
        userAge: 37,                                //年龄
        time : new Date()                      //最近登录时间
    });

         var user5 = new User({
        username : 'user15',                 //用户账号
        password: 'abcd',                            //密码
        userAge: 37,                                //年龄
        time : new Date()                      //最近登录时间
    });

    const userArr = [user0,user1,user2,user3,user4,user5]

    //初始化插入表数据
    // for(let i =0;i<userArr.length;i++) {
    //     userArr[i].save((err,result) => {
    //         if (err) {
    //             console.log("Error:" + err);
    //         }
    //         else {
    //             console.log("Res:" + result);
    //         }
    //     })
    // }

    //调用 封装的 插入方法
    let date = new Date();
    let time = date.toLocaleString();
   
    var user7 ={
        username : 'userhaha',                 //用户账号
        password: 'abcdsdada',                            //密码
        age: 47,                               //年龄
        time:time                   //最近登录时间
     };

   // db_().save(user7,'user');

   //更新数据
    // User.update({'username':'user6'}, {'userAge':'20'}, (err,result) => {
    //     if (err) throw err;
    //     console.log(result);
    // })

    // User.findByIdAndUpdate('5b1c761d1856ca022a272f5d',{'username':'user26'}, (err,result) => {
    //     if(err) throw err;
    //     console.log(result);
    // })

    //封装的数据库更新操作
    // db_().update({'username':'user6'}, {'userAge':'28'},'user').update();

    // db_().update('5b1c761d1856ca022a272f5d',{'username':'usertesthahaha89'},'user').updateById();


    // 删除操作
   //db_().remove({'username':'Tracy McGrady'}, 'user');

   //查询操作

   //db_().find({'username':'user6'},{"userAge":"1", "time":"0"},'user');
   // db_().find({'username':'user6'},{"userAge":"1", "time":"0"},'user',(e) => {
   //      console.log(e);// 拿到的数据
   // })


   const query = {
    userAge: {$gte: 10, $lte: 120}, //大于等于10  小于等于120
   // $or:[{'username':'user6'}], //或
    username:{$in:['user6','user13'],$regex:/user13/i}  //在某一个范围内   $regex 正则
   }


   // User.find(query,{},(err,res) => {

   //  console.log(res);
   // })

   // User.count({},(err,res) => {
   //  console.log(res)   // 返回数据的数量
   // })

   // db_().count('user',(e) => {
   //  console.log(e);
   // })


  // 分页查询


  const pageSize = 5;
  let current = 1;
  const sort = {'time':-1};
  //const query = {};
  let skipnum = (current-1)*pageSize;

  // User.find({}).skip(skipnum).limit(pageSize).sort(sort).exec((err,res) => {
  //   console.log(res);
  // })


  let queryObj = {
    current,
    sort,
    skip:skipnum,
    pageSize,
    query:{}
  }

  db_().findPage(queryObj,'user',(e) => {
    console.log(e);
  })

  
   // User.find({'username':'user1'},{"username":"1", "time":"0","_id":"0"},(err,res) => {
   //   console.log(res);
   // })

}



module.exports = insert();


//查询逻辑

// $or　　　　或关系

// 　　$nor　　　 或关系取反

// 　　$gt　　　　大于

// 　　$gte　　　 大于等于

// 　　$lt　　　　 小于

// 　　$lte　　　  小于等于

// 　　$ne            不等于

// 　　$in             在多个值范围内

// 　　$nin           不在多个值范围内

// 　　$all            匹配数组中多个值

// 　　$regex　　正则，用于模糊查询

// 　　$size　　　匹配数组大小

// 　　$maxDistance　　范围查询，距离（基于LBS）

// 　　$mod　　   取模运算

// 　　$near　　　邻域查询，查询附近的位置（基于LBS）

// 　　$exists　　  字段是否存在

// 　　$elemMatch　　匹配内数组内的元素

// 　　$within　　范围查询（基于LBS）

// 　　$box　　　 范围查询，矩形范围（基于LBS）

// 　　$center       范围醒询，圆形范围（基于LBS）

// 　　$centerSphere　　范围查询，球形范围（基于LBS）

// 　　$slice　　　　查询字段集合中的元素（比如从第几个之后，第N到第M个元素）






















