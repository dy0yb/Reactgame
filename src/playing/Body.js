import React from 'react';
import Item from './Item'
import './Body.css'

class Body extends React.Component {
	constructor(props) {
	    super(props);
		
		const length = this.props.grade;
		const diff =  this.props.diff;
		// 每个难度等级对应固定方格的数目
		const fixed = {
						'21':3,'22':2,'23':1,
						'41':8,'42':5,'43':2,
						'61':12,'62':6,'63':4,
						'81':18,'82':12,'83':6,
						};
		// 定义一个二维数组存储数据
		let arr = new Array(length);
		for(let i=0;i<length;i++){
			arr[i] = new Array(length);
		}
		// 初始化填充
		for(let i=0;i<length;i++){
			for(let j=0;j<length;j++){
				/* 	每一位都对应item中的状态
					1 为显示  0为不显示
					0b100000000
					方格背景默认灰色:第1位,
					背景白色:第2位,
					背景黑色:第3位,
					
					红色边框顶部:第4位,
					右部:第5位,
					下部:第6位,
					左部:第7位,
					是否显示！叹号:第8位
					是否为系统固定:第9位
					
				*/
			    // 默认为灰色
				arr[i][j] = 0b100000000
			}
		}
		
	
		// 回溯法求一个可能解   保证系统固定一些方格后不会导致无解的情况。
		let stack = [];
		for(let i=0;i<arr.length;i++){
			for(let j=0;j<arr.length;j++){
				arr[i][j] = 0b010000000;
				stack.push({i:i,j:j,v:0b010000000})
				const feature = this.Features(arr)
				// 验证个数是否相等，是否连续
				const samecontentX = this.SameContent(feature.row[i].split(','))
				const samecontentY = this.SameContent(feature.col[j].split(','))
				const redframeX = this.RedFrame(feature.row[i].split(','))
				const redframeY = this.RedFrame(feature.col[j].split(','))
				let linerepeatx = true;
				let linerepeaty = true;
				if(this.props.onlyline){
					linerepeatx = this.LineRepeat(feature.row)
					linerepeaty = this.LineRepeat(feature.col)
				}
				// 通过 下一个
				if(samecontentX && samecontentY && redframeX && redframeY && linerepeatx && linerepeaty){
					 // console.log(feature)
				}else{// 不通过 回溯
					while(stack.length){
						let obj = stack.pop();
						while(obj.v===0b001000000){
							obj = stack.pop();
							arr[obj.i][obj.j] = 0b100000000;
							if(!stack.length){
								break;
							}
						}
						arr[obj.i][obj.j] = 0b001000000;
						stack.push({i:obj.i,j:obj.j,v:0b001000000})
						const feature = this.Features(arr)
						const samecontentX = this.SameContent(feature.row[i].split(','))
						const samecontentY = this.SameContent(feature.col[j].split(','))
						const redframeX = this.RedFrame(feature.row[i].split(','))
						const redframeY = this.RedFrame(feature.col[j].split(','))
						let linerepeatx = true;
						let linerepeaty = true;
						if(this.props.onlyline){
							linerepeatx = this.LineRepeat(feature.row)
							linerepeaty = this.LineRepeat(feature.col)
						}
						if(samecontentX && samecontentY && redframeX && redframeY && linerepeatx && linerepeaty){
							i=obj.i;
							j=obj.j;
							
							 break
						}else{
							arr[obj.i][obj.j] = 0b100000000;
						}
					}
				}
			}
		}
		
		//  将解打印到控制台，方便验证
		arr.forEach((item)=>{
			let content = item
			console.log(content.toString().replace(/128/g,'白').replace(/64/g,'黑'));
		})
		
		//随机固定不能修改，其他还原为初始状态
		const num = fixed[''+length+diff]
		for(let i=0;i<num;i++){
			const x = parseInt(length*Math.random())
			const y = parseInt(length*Math.random())
			if(arr[x][y]&1){ // 如果已经为固定的  再次随机生成
				i--;
			}else{
				arr[x][y] = arr[x][y]|1
			}
		}
		for(let i=0;i<length;i++){
			for(let j=0;j<length;j++){
				if(~arr[i][j]&1){
					arr[i][j] = 0b100000000
				}
			}
		}
		
		
		this.state = {
			arr: arr,
			over: false, //表示游戏是否完成 结束
		};
		
		this.changeWhite = this.changeWhite.bind(this);
		this.changeBlack = this.changeBlack.bind(this);
		this.Features = this.Features.bind(this);
		this.SameContent = this.SameContent.bind(this);
		this.ContinuousSame = this.ContinuousSame.bind(this);
		this.RedFrame = this.RedFrame.bind(this);
		this.Droptip = this.Droptip.bind(this);
		this.rbegin = this.rbegin.bind(this);
		this.LineRepeat = this.LineRepeat.bind(this);
	}
	
	
	
	// 提取特行列征值，传入一个二维数组, 数组行列个数相等，
	// 返回一个对象保存两个特征数组行，列特征值  也可用来判断两行或者两列的黑白格子排列相同
	Features(arr){
		let feature = {row:[],col:[]};
		const len = arr.length;
		for(let i=0;i<len;i++){
			feature.row[i]='';
			feature.col[i]='';
		}
		for(let i=0;i<len;i++){
			for(let j=0;j<len;j++){
				if(i!==0){
					feature.row[j] = feature.row[j]+","+(arr[j][i]&0b111000000)
					feature.col[j] = feature.col[j]+","+(arr[i][j]&0b111000000)
				}else{
					feature.row[j] = feature.row[j]+(arr[j][i]&0b111000000)
					feature.col[j] = feature.col[j]+(arr[i][j]&0b111000000)
				}
			}
		}
	return feature
	}

	// 判断数组中黑白数目是否相等。
	SameContent(arr){
		let whiteNum = 0;
		let blackNum = 0;
		for(let i=0;i<arr.length;i++){
			const num = parseInt(arr[i])
			if(num!==256){
				if(num===128){
					whiteNum++;
				}else{
					blackNum++;
				}
			}else{
				// 有空余没填充 可以继续填充
				return true;
			}
		}
		if(whiteNum!==0 && whiteNum === blackNum){
			return true;
		}else{
			return false
		}
	}
	
	// 判断数组中有无连续相同的元素超过两个的, 返回起始位置和结束位置下标【1,3] 不包括3, 放入一个数组中, 没有返回空数组
	ContinuousSame(arr){
		let arrlist = [];
		let content;
		for(let i=0;i<arr.length;i++){
			let num = parseInt(arr[i]);
			if(~num&0b100000000){
				content = num;
				for(let j=i+1;j<arr.length;j++){
					let num2 = parseInt(arr[j]);
					if(num2 === content){
						if(j===arr.length-1){
							if((j-i)>=2){
								arrlist[arrlist.length] = [i,j+1];
								i = j;
							}
						}
					}else{
						if((j-i)>2){
							arrlist[arrlist.length] = [i,j];
							i = j-1;
							break;
						}else{
							i = j-1
							break;
						}
					}
				}
			}
		}
		return arrlist
	}
	
	// 判断是否有无连续相同的元素超过两个
	RedFrame(arr){
		const arr2 = this.ContinuousSame(arr);
		if(arr2.length===0){
			return true;
		}else{
			return false;
		}
	}
	// 判断有无相同的行列，去出含有默认状态的行列, 再判断
	LineRepeat(arr){
		arr = arr.filter((item)=>{return !~item.indexOf("256")})
		const len = arr.length;
		const len2 = new Set(arr).size
		
		return (len === len2)
	}
	
	// 改变颜色
	changeWhite(X,Y){
		let arr = this.state.arr;
		if(this.state.over){
		}else if(arr[X][Y]&1){
			
		}else if(~arr[X][Y]&0b010000000){
			arr[X][Y] = arr[X][Y]^0b010000000
			arr[X][Y] = arr[X][Y]&0b010000000
			this.Droptip(arr);
		}
	}
	changeBlack(X,Y){
		let arr = this.state.arr;
		if(this.state.over){
		}else if(arr[X][Y]&1){
			
		}else if(~arr[X][Y]&0b001000000){
			arr[X][Y] = arr[X][Y]^0b001000000
			arr[X][Y] = arr[X][Y]&0b001000000
			this.Droptip(arr);
		}
	}
	// 绘制提示框及判断游戏是否结束
	Droptip(arr){
		let over = true;
		const feature = this.Features(arr)
		for(let i=0;i<arr.length;i++){
			for(let j=0;j<arr.length;j++){
				if(arr[i][j]&0b100000000){
					over = false;
				}
				arr[i][j] = arr[i][j] & 0b111000001
			}
		}
		for(let i=0;i<feature.row.length;i++){
			const continuoussameX = this.ContinuousSame(feature.row[i].split(','))
			const continuoussameY = this.ContinuousSame(feature.col[i].split(','))
			// 多个连续绘制圈框
			if(continuoussameX.length!==0){
				over = false;
				continuoussameX.forEach(item=>{
					arr[i][item[0]] = arr[i][item[0]] | 0b000000100
					arr[i][item[1]-1] = arr[i][item[1]-1] | 0b000010000
					for(let j=item[0];j<item[1];j++){
						arr[i][j] = arr[i][j] | 0b000101000
					}
				})
			}
			if(continuoussameY.length!==0){
				over = false;
				continuoussameY.forEach(item=>{
					arr[item[0]][i] = arr[item[0]][i] | 0b000100000
					arr[item[1]-1][i] = arr[item[1]-1][i] | 0b000001000
					for(let j=item[0];j<item[1];j++){
						arr[j][i] = arr[j][i] | 0b000010100
					}
				})
			}
			//黑白个数不相等 显示！
			const redframeX = this.SameContent(feature.row[i].split(','))
			const redframeY = this.SameContent(feature.col[i].split(','))
			if(!redframeX){
				over = false;
				for(let j=0;j<arr.length;j++){
					arr[i][j] = arr[i][j] | 0b000000010
				}
			}
			if(!redframeY){
				over = false;
				for(let j=0;j<arr.length;j++){
					arr[j][i] = arr[j][i] | 0b000000010
				}
			}
		}
		// 高级选项 判断两个或者两列不能有相同的
		let linerepeatx = true;
		let linerepeaty = true;
		if(this.props.onlyline){
			linerepeatx = this.LineRepeat(feature.row)
			linerepeaty = this.LineRepeat(feature.col)
		}
		if(!linerepeatx){
			 over = false;
			 for(let j=0;j<arr.length;j++){
				 if(!~feature.row[j].indexOf('256')){
					 const p = feature.row[j];
					 for(let i=j+1;i<arr.length;i++){
						 if(!~feature.row[i].indexOf('256')){
							if(p === feature.row[i]){
								arr[i][0] = arr[i][0] | 0b000000100
								arr[i][arr.length-1] = arr[i][arr.length-1] | 0b000010000
								for(let k=0;k<arr.length;k++){
									arr[i][k] = arr[i][k] | 0b000101000
								}
								arr[j][0] = arr[j][0] | 0b000000100
								arr[j][arr.length-1] = arr[j][arr.length-1] | 0b000010000
								for(let k=0;k<arr.length;k++){
									arr[j][k] = arr[j][k] | 0b000101000
								}
							}
						}
					 }
				 }
			 }
		}
		if(!linerepeaty){
			over = false;
			for(let j=0;j<arr.length;j++){
				 if(!~feature.col[j].indexOf('256')){
					 const p = feature.col[j];
					 for(let i=j+1;i<arr.length;i++){
						 if(!~feature.col[i].indexOf('256')){
							if(p === feature.col[i]){
								arr[0][i] = arr[0][i] | 0b000100000
								arr[arr.length-1][i] = arr[arr.length-1][i] | 0b000001000
								for(let k=0;k<arr.length;k++){
									arr[k][i] = arr[k][i] | 0b000010100
								}
								arr[0][j] = arr[0][j] | 0b000100000
								arr[arr.length-1][j] = arr[arr.length-1][j] | 0b000001000
								for(let k=0;k<arr.length;k++){
									arr[k][j] = arr[k][j] | 0b000010100
								}
							}
						}
					 }
				 }
			}
		}
		this.setState({over: over,arr: arr});
	}
	
	rbegin(){
		this.props.setDeploy(undefined, undefined, undefined, 0);
	}
	render (){
		const grade = this.props.grade;
		const width = grade * 100 + 'px';
		const wrapstyle = {width:width}
		let group= [];
		let over;
		for(let i=0;i<grade;i++){
			for(let j=0;j<grade;j++){
				// 添加渲染条件
				group.push(<div className="item" key={i.toString()+j.toString()}>
								<Item X={i} Y={j}  tag={this.state.arr[i][j]} 
								changeWhite={this.changeWhite}
								changeBlack={this.changeBlack}/>
							</div>)
			}
		}
		if(this.state.over){
			over = <div>
						<h2>游戏结束, 请重新开始游戏</h2>
					</div>
		}
		
		return (
				<div>
					{over}
					<button className="btn btn-default btn-lg" onClick={this.rbegin}>重新开始</button>
					<div className="wrap" style={wrapstyle}>
						{group}
					</div>
				</div>
		);
	}
}

export default Body;
