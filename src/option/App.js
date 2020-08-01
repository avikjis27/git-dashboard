/*global chrome*/
import React, { Component } from 'react';
import './App.css';
import Owners from './Owners';
import { faQuestionCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
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
				console.log(response);
				this.setState({ accesstoken: response.tokens });
				this.setState({ repositories: response.repos });
				this.setState({ queries: response.queries });
			}
		});

	}

	createRepoPanel(){
		const elements = this.state.repositories;
		const panel = [];
		console.log("from option page", this.state);
		Object.keys(elements).forEach(domain => {
			panel.push(
				<Collapsible trigger={domain}
					triggerClassName="domain-style-open"
					triggerOpenedClassName="domain-style-closed"
					contentOuterClassName="domain-style-content-outer"
					contentInnerClassName="domain-style-content-inner">
						<div className="access-token"><FontAwesomeIcon icon={faQuestionCircle} /> Git Access Token
									<input type="text" className="access-token-input" value=""/></div>
						<Owners domain={elements[domain]}/>
				</Collapsible>
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
					return(
						<div>
					 		{this.createRepoPanel()}
						</div>
					);
			}
	}
}

export default App;
