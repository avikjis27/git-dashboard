/*global chrome*/
import React, { Component } from 'react';
import './App.css';
import Queries from './Queries';
import { faQuestionCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapsible from 'react-collapsible';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			accesstoken: '',
			repositories: [],
			queries: []
		};

		// this.handleChange = this.handleChange.bind(this);
		// this.handleSubmit = this.handleSubmit.bind(this);
	}

	// componentDidMount() {
	// 	chrome.runtime.sendMessage({ type: 'optionInit' }, (response) => {
	// 		if (response) {
	// 			this.setState({ "accesstoken": response.tokens });
	// 			this.setState({ "repositories": response.repos });
	// 			this.setState({ "queries": response.queries });
	// 		}
	// 		console.log(this.state);
	// 	});

	// }

	// handleChange(event) {
	// 	this.setState({"accesstoken": event.target.value});
	// 	localStorage.setItem('accesstoken', event.target.value);
	// }

	// handleSubmit(event) {
	//   alert('A name was submitted: ' + this.state.value);
	//   event.preventDefault();
	// }

	// createRepositoryPanel(){
	// 	const panel = []
	// 	const elements = this.state.repositories;
	// 	console.log(elements);
	// 	if(elements){
	// 		Array.from(elements).forEach(value => {
	// 			panel.push(
	// 				<div className="repo-label">
	// 				<FontAwesomeIcon icon={faQuestionCircle} color="cornflowerblue"/> {value} <FontAwesomeIcon icon={faTimesCircle} color="crimson"/>
	// 				</div>
	// 			)
	// 		});
	// 	}

	//	return panel;
	//}

	// createQueryPanel(){
	// 	const panel = []
	// 	const elements = this.state.queries;
	// 	console.log(elements);
	// 	if(elements){
	// 		Array.from(elements).forEach(value => {
	// 			panel.push(
	// 				<div className="repo-label">
	// 				<FontAwesomeIcon icon={faQuestionCircle} color="cornflowerblue"/> {value} <input className="checkbox" type="checkbox" />
	// 				</div>
	// 			)
	// 		});
	// 	}
	// 	return panel;
	// }

	render() {
		return (
			<div>

				<Collapsible trigger="github.com"
					triggerClassName="domain-style-open"
					triggerOpenedClassName="domain-style-closed"
					contentOuterClassName="domain-style-content-outer"
					contentInnerClassName="domain-style-content-inner">
						<div className="access-token"><FontAwesomeIcon icon={faQuestionCircle} /> Git Access Token
									<input type="text" className="access-token-input" value=""/></div>
					<Collapsible trigger="owner"
						triggerClassName="owner-style-open"
						triggerOpenedClassName="owner-style-closed"
						contentOuterClassName="owner-style-content-outer"
						contentInnerClassName="owner-style-content-inner">
						<div className="repo-details">
							<fieldset>
								<legend>Repo name</legend>
								<Queries/>
							</fieldset>
						</div>
					</Collapsible>
				</Collapsible>
				{/* <fieldset>
        <legend>Aceess Token Sttings: </legend>
        <div className="access-label">
				<FontAwesomeIcon icon={faQuestionCircle} color="cornflowerblue"/> Git Access Token
        </div>
        <div className="input">
          <input type="text" value={this.state.accesstoken} onChange={this.handleChange}/><span className="flash">Saved</span>
        </div>
      </fieldset>
      <fieldset>
        <legend>Repository Sttings: </legend>
        {this.createRepositoryPanel()}
      </fieldset>
      <fieldset>
        <legend>Query Sttings: </legend>
        {this.createQueryPanel()}
      </fieldset> */}
			</div>
		)
	}
}

export default App;
