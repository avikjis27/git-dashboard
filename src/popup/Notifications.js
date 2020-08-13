/*global chrome*/
import React, { Component } from 'react';
import './Notifications.css';

class Notifications extends Component {

	renderNotification(notifications){
		console.log('renderNotification', notifications);
		const list = [];
		notifications.forEach(element => {
			if (element.severity === 1){
				list.push(<div className="severe">{element.message}</div>)
			}
			if (element.severity === 2){
				list.push(<div className="high">{element.message}</div>)
			}
		});
		return list;
	}

	render() {
		return (
			<div className="notification-panel">
				{this.renderNotification(this.props.notifications)}
			</div>
		)		
	};
}

export default Notifications;
