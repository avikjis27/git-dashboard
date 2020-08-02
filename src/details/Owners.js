import React, { Component } from 'react';
import Repos from './Repos';
import Collapsible from 'react-collapsible';

class Owners extends Component {

	queryData(domain, owner){
		console.log("Fetching data for", domain, owner);
		chrome.runtime.sendMessage({ type: 'queryGitRepo', domain: domain, owner: owner }, (response) => {
			alert('Token updated');
		});	
	}

	createOwnerPanel(owners){
		const panel = [];
		Object.keys(owners).forEach(owner => {
			panel.push(
				<div key={owner}>
				<Collapsible trigger={owner}
				triggerClassName="owner-style-open"
				triggerOpenedClassName="owner-style-closed"
				contentOuterClassName="owner-style-content-outer"
				contentInnerClassName="owner-style-content-inner"
				onOpening={() => this.queryData(this.props.domain, owner)}>
				<Repos domain={this.props.domain} owner={owner} repos={owners[owner]}/>
			</Collapsible>
			</div>
			);
		});
		return panel;
	}

	render() {
		return (
			this.createOwnerPanel(this.props.owners)
		)
	}
}

export default Owners;