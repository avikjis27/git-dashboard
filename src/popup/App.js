/*global chrome*/
import React, { Component } from 'react';
import './App.css';
import Notifications from './Notifications'

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
				tasks: null
		};
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

	render() {
		return (
			<div>
				<main className="popup-container">
					<Notifications tasks={this.state.tasks}/>
					<span className="last-update">* Updated: {this.state.tasks ? this.state.tasks.lastUpdated: '-'}</span>
					<section>
						<li onClick={this.openOptionPage}>Options</li>
						<li onClick={this.openDetailsPage}>Details</li>
					</section>
				</main>
			</div>
		);
	};
}

export default App;
