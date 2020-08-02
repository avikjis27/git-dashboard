/*global chrome*/
import React, { Component } from 'react';
import './App.css';
import Owners from './Owners';
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapsible from 'react-collapsible';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			accesstoken: null,
			repositories: null,
			queries: null
		};
	}

	componentDidMount() {
		chrome.runtime.sendMessage({ type: 'optionInit' }, (response) => {
			if (response) {
				this.setState({ accesstoken: response.tokens });
				this.setState({ repositories: response.repos });
				this.setState({ queries: response.queries });
			}
		});

	}
	updateAccessToken(event, domain, persist) {
		let objCopy = Object.assign({}, this.state.accesstoken)
		objCopy[domain] = event.target.value
		this.setState({accesstoken: objCopy});
		if (persist){
			chrome.runtime.sendMessage({ type: 'acessTokenUpdated', token: event.target.value, domain: domain }, () => {
				alert('Token updated');
			});	
		}
		
	}
	fetchAccessToken(domain) {
		if(this.state.accesstoken !== null){
			if (domain in this.state.accesstoken){
				return this.state.accesstoken[domain];
			}
		}
		return "";
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
						<div className="access-token"><FontAwesomeIcon icon={faQuestionCircle} /> Git Access Token
									<input type="text" className="access-token-input" value={this.fetchAccessToken(domain)}
									onChange={(e) => this.updateAccessToken( e, domain, false)}
									onBlur={(e) => this.updateAccessToken( e, domain, true)}/></div>
						<Owners domain={domain} owners={elements[domain]}/>
				</Collapsible>
				</div>
			);
		});
		return panel;
	}

	render() {
		if (this.state.repositories === null) {
			return (
					<div>
							<h1>Loading...</h1>
					</div>
			);
			}
			else {
					return this.createRepoPanel();
			}
	}
}

export default App;
