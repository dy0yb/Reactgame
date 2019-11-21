import React from 'react';
import './Item.css'

const classNames = require('classnames');

class Item extends React.Component {
	constructor(props) {
	    super(props);
		this.clickLeft = this.clickLeft.bind(this)
		this.clickRight = this.clickRight.bind(this)
	}
	clickLeft(event){
		this.props.changeWhite(this.props.X,this.props.Y)
		event.preventDefault();
	}
	clickRight(event){
		this.props.changeBlack(this.props.X,this.props.Y)
		event.preventDefault();
	}
	render (){
		const tag = this.props.tag
	  return (
		<div className={classNames({
					wrap_gray:true,
					
					wrap_begin:tag&0b100000000,
					wrap_white:tag&0b010000000,
					wrap_black:tag&0b001000000,
					
					border_top:tag&0b000100000,
					border_right:tag&0b000010000,
					border_bottom:tag&0b000001000,
					border_left:tag&0b000000100,
				})} 
				onClick={this.clickLeft}
				onContextMenu={this.clickRight}
				>
			<div className={classNames({
					inner:true,
					
					inner_noborder:tag&0b100000000|| tag&1,
					inner_white_border:tag&0b010000000&& tag&1,
					inner_black_border:tag&0b001000000&& tag&1,
					
					fontstyle:true,
				})
				}>{tag&0b000000010?'!':''}</div>
		</div>
	  );
	}
}

export default Item;