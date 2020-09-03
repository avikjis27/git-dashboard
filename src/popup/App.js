/*global chrome*/
import React, { Component } from 'react';
import './App.css';
import Notifications from './Notifications'
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SpinnerComponent } from 'react-element-spinner';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
				tasks: null,
				loading: false
		};
		this.syncTask = this.syncTask.bind(this);
	}

	openOptionPage() {
		chrome.runtime.openOptionsPage();
	}
	openDetailsPage() {
		chrome.tabs.create({url: chrome.extension.getURL('details.html')});
	}

	componentDidMount() {
		chrome.runtime.sendMessage({ type: 'popupInit' }, (response) => {
			if (response) {
				this.setState({
					tasks: response
				});
			}
		});
	}
	syncTask() {
		this.setState({
			loading: true
		});
		chrome.runtime.sendMessage({ type: 'syncTask' }, (response) => {
			if (response) {
				this.setState({
					tasks: response,
					loading: false
				});
			}
		});
	}

	render() {
		return (
				<div>
					<SpinnerComponent loading={this.state.loading} position="global" color="#ff9800" message='Loading your tasks...'/>
					<main className="popup-container">
						<div className="popup-menu">
							<FontAwesomeIcon onClick={()=>this.syncTask()} icon={faSync} />
						</div>
						<Notifications tasks={this.state.tasks} syncTask={this.syncTask}/>
						<div className="last-update">* Updated: {this.state.tasks ? this.state.tasks.lastUpdated : '-'}</div>
						<div className="buttons" >
							<li onClick={()=>this.openOptionPage()}>Options</li>
							<li onClick={()=>this.openDetailsPage()}>Details</li>
						</div>
					</main>
				</div>
		);
	};
}

export default App;
