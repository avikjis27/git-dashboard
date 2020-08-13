/*global chrome*/
import React, { Component } from 'react';
import './App.css';
import Notifications from './Notifications'

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
				notifications: []
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
				console.log('popupInit', response);
				this.setState({
					notifications: response.docs
				});
			}
		});
	}

	render() {
		return (
			<div>
				<main className="popup-container">
					{/* <section className="refresh">
						<img src="refresh16.png"></img>
					</section> */}
					<Notifications notifications={this.state.notifications}/>
					<span className="last-update">* Updated: 18th July, 2020 23.30</span>
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
