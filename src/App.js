import React from 'react';
import './App.css';
import Begin from './begin/Begin'
import Body from './playing/Body'
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			grade: 6, // 行列数
			difficulty: 2, // 难度等级
			onlyline:false, // 唯一行列
			tag: 0,	//游戏状态
		};
		this.setDeploy = this.setDeploy.bind(this);
	}
	setDeploy(grade=this.state.grade, difficulty=this.state.difficulty, onlyline=this.state.onlyline, tag=this.state.tag){
		this.setState({grade: grade, difficulty:difficulty, onlyline:onlyline, tag:tag});
	}
	render (){
		let model;
		if(this.state.tag === 0){
			model = <Begin setDeploy={this.setDeploy} grade={this.state.grade} diff={this.state.difficulty} onlyline={this.state.onlyline}/>
		}else if(this.state.tag === 1){
			model = <Body setDeploy={this.setDeploy} onlyline={this.state.onlyline} grade={this.state.grade} diff={this.state.difficulty}/>
		}
		return (
		  <div className="App">
			{model}
		  </div>
		);
	}

}
export default App;
