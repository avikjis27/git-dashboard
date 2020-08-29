/*global chrome*/
import React, { Component } from 'react';
import './App.css';
import Owners from './Owners';
import Header from './Header'
import Footer from './Footer'
import Collapsible from 'react-collapsible';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			repositories: null
		};
	}

	componentDidMount() {
		chrome.runtime.sendMessage({ type: 'detailsInit' }, (response) => {
			if (response) {
				this.setState({ repositories: response.repos });
			}
		});
	}
	

	createRepoPanel(){
		const elements = this.state.repositories;
		const panel = [];
		Object.keys(elements).forEach(domain => {
			panel.push(
				<div key={domain}>
				<Collapsible trigger={domain}
					triggerClassName="domain-style-open"
					triggerOpenedClassName="domain-style-closed"
					contentOuterClassName="domain-style-content-outer"
					contentInnerClassName="domain-style-content-inner">
						<Owners domain={domain} owners={elements[domain]}/>
				</Collapsible>
				</div>
			);
		});
		if (panel.length == 0) {
			return (
			<div className="norepo-message">
				<div className="message-header">No repository added</div>
				<div>
					<ul>
						<li>Open a Git repository page</li>
						<li>Press [ Option + Shift + F ] to follow the repository</li>
						<li>Press [ Option + Shift + U ] to unfollow the repository</li>
						<li>Open extension's option page</li>
						<li>Ensure each domain has an Accecc Token</li>
					</ul>
				</div>
			</div>
			)
		}
		return panel;
	}

	render() {
		if (this.state.repositories === null) {
			return (
					<div>
						<img className="centered" src="loading.gif"></img>
					</div>
			);
			}
			else {
				return(
					<div>
						<Header />
					 		{ this.createRepoPanel() }
						<Footer />
					</div>
					
				);
			}
	}
}

export default App;
