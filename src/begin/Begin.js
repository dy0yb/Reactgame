import React from 'react';
import './Begin.css';


class Begin extends React.Component {
	constructor(props) {
	    super(props)
		this.handleChange = this.handleChange.bind(this);
		this.DiffChange = this.DiffChange.bind(this);
		this.begin= this.begin.bind(this);
		this.onlyLine= this.onlyLine.bind(this);
	}
	// 受控组件
	handleChange(event){
		this.props.setDeploy(parseInt(event.target.value), undefined, undefined,undefined)
	}
	DiffChange(event){
		this.props.setDeploy(undefined, parseInt(event.target.value), undefined, undefined)
	}
	onlyLine(event){
		let check = event.target.checked;
		this.props.setDeploy(undefined, undefined, check, undefined)
	}
	begin(event){
		this.props.setDeploy(undefined, undefined, undefined, 1)
		event.preventDefault();
	}
	render (){
		return (
		  <div className='outlineBorder'>
			<h1>初始化游戏设置</h1><br />
			<form className="form-horizontal">
				<div className="form-group">
					<label htmlFor="input1" className="col-sm-3 control-label">棋盘规格</label>
					<div className="col-sm-8">
					  <select className="form-control" id="input1" value={this.props.grade} onChange={this.handleChange}>
					  	<option value="2">两行两列</option>
					  	<option value="4">四行四列</option>
					  	<option value="6">六行六列</option>
					  	<option value="8">八行八列</option>
					  </select>
					</div>
				  </div>
				<div className="form-group">
					<label htmlFor="input2" className="col-sm-3 control-label">游戏难度选择</label>
					<div className="col-sm-8">
					  <select className="form-control"  id="input2" value={this.props.diff} onChange={this.DiffChange}>
					  	<option value="1">简单</option>
					  	<option value="2">一般</option>
					  	<option value="3">困难</option>
					  </select>
					</div>
				 </div>
				<div className="form-group">
					<div className="col-sm-offset-2 col-sm-8">
					  <div className="checkbox">
						<label>
						  <input type="checkbox" checked={this.props.onlyline} onChange={this.onlyLine} /> 唯一行列
						</label>
					  </div>
					</div>
				  </div>
				<button className="btn btn-default btn-lg" onClick={this.begin}>开始</button>
			</form>
		  </div>
		);
	}

}
export default Begin;
