/**
* 数据库操作封装
*/


module.exports = function() {
	//导入数据表
	const User = require("./schema/user");

	return {

		/**
		* @save   数据库 插入方法
		* @obj { Object } '插入的user信息'
		* @schema { String } '选择要操作的表' 
		*/

		save(obj,schema) {
			const tipS = '数据插入成功 ~~~O(∩_∩)O~~~\n';
			switch(schema){
				case 'user' :
					let user = new User({
						username:obj.username,
						password:obj.password,
						userAge:obj.age,
						time:obj.time
					});

					//保存数据
					user.save((err) => {
						if(err) throw err;
						console.log(tipS);
					});
				break;

				default:
					console.log('暂无数据插入~~O(∩_∩)O~~~~\n');
			}
			
		},

		/**
		* @update   数据库 更新方法
		* @where { JSON } '条件字段'
		* @updateStr { JSON } '要更新的数据字段'
		* @schema { String } '选择要操作的表' 
		*/
		update(where,updateStr,schema){
			const tipU = '数据更新成功 ~~~O(∩_∩)O~~~\n';

			//条件函数
			let switchFn = function() {
				return {
					update() {
						switch(schema) {
						case 'user' :
							User.update(where,updateStr,(err) => {
								if (err) throw err;
								console.log(tipU);
							});
						   break;
						default:
							console.log('暂无数据更新~~~O(∩_∩)O~~~~\n');
					  }
				    },
				    updateById() {
				    	switch(schema) {
						case 'user' :
							User.findByIdAndUpdate(where,updateStr,(err) => {
								if (err) throw err;
								console.log(tipU);
							});
						   break;
						default:
							console.log('暂无数据更新~~~O(∩_∩)O~~~~\n');
						}
				    }
				}
				
			}

				return {
					//根据条件字段更新
					update() {	
						switchFn().update();
					  },
					//根据数据ID更新
					updateById(){
					 	switchFn().updateById();
					}
				 }	
			},

			/**
			* @remove   数据库 删除方法
			* @where { JSON } '条件字段'
			* @schema { String } '选择要操作的表' 
			*/
			remove(where,schema) {
				const tipR = '数据删除成功~~~~O(∩_∩)O~~~~\n';
				switch(schema){
					case 'user':
					  User.remove(where,(err) => {
					  	if (err) throw err;
					  	console.log(tipR);
					  });
					  break;
					default:
					 	console.log('暂无数据删除~~~~O(∩_∩)O~~~~~\n');
				}
			},

			/**
			* @find   数据库 查询方法
			* @where { JSON } '条件字段'
			* @schema { String } '选择要操作的表' 
			* @callback { Function } '传一个回调函数'
			*/
			find(where,option,schema,callback) {
				const tipF = '数据查询成功~~~~~O(∩_∩)O~~~~~\n';
				  switch(schema) {
					case 'user' :

						User.find(where,option,(err,result) => {
							if (err) throw err;
							console.log(tipF);		
							callback.apply(this,result);
						});

					break;
				default:
					console.log('暂无数据查询~~~~~~O(∩_∩)O~~~~~\n');
				}
				
			},

			/**
			* @count   数据库 查询数据数目方法
			* @schema { String } '选择要操作的表' 
			* @callback { Function } '传一个回调函数'
			*/
			count(schema,callback) {
				const tipC = '数据总数获取成功~~~~~O(∩_∩)O~~~~~~\n';
				switch(schema) {
					case 'user' :
						User.count({},(err,result) => {
							if(err) throw err;
							console.log(tipC);
							callback.call(this,result);
						})
						break;
					default: 
						console.log('暂无数据查询~~~~~~O(∩_∩)O~~~~~\n');
				}
			},

			/**
			* @findPage   数据库 数据分页方法
			* @queryObj { Object } '分页参数对象'
			* @schema { String } '选择要操作的表' 
			* @callback { Function } '传一个回调函数'
			*/
			findPage(queryObj,schema,callback) {
				const tipP = '数据分页成功~~~~~~O(∩_∩)O~~~~~\n';
				const pageSize = queryObj.pageSize;
				const query = queryObj.query;
				const sort = queryObj.sort;
				let current = queryObj.current;
				let skip = (current-1) * pageSize;

				const sortInfo = (function(){
					let sortName = [];
					for(let name in sort) {
						sortName.push(name); 
						sort[name] == -1 ? sortName.push('降序排列') : sortName.push('升序排列');
					}

					return sortName;
				})()

				console.log(`\n当前页: 第 ${current} 页 \n每页显示: ${pageSize}条 \n按照: ${sortInfo[0]+''+sortInfo[1]}\n已跳数据: ${skip} 条 \n`);
				switch(schema) {
					case 'user':
						User.find(query).skip(skip).limit(pageSize).sort(sort).exec((err,result) => {
							if (err) throw err;
							console.log(tipP);
							callback.call(this,result);
						})
						break;
					default:
						console.log('暂无数据查询~~~~~~O(∩_∩)O~~~~~\n');
				}
			}



	}
}