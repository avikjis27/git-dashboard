import React, { Component } from 'react';
import Repos from './Repos';
import Collapsible from 'react-collapsible';

class Owners extends Component {

	createOwnerPanel(domain){
		const panel = [];
		Object.keys(domain).forEach(owner => {
			panel.push(
				<div key={owner}>
				<Collapsible trigger={owner}
				triggerClassName="owner-style-open"
				triggerOpenedClassName="owner-style-closed"
				contentOuterClassName="owner-style-content-outer"
				contentInnerClassName="owner-style-content-inner">
				<Repos repos={domain[owner]}/>
			</Collapsible>
			</div>
			);
		});
		return panel;
	}

	render() {
		return (
			this.createOwnerPanel(this.props.domain)
		)
	}
}

export default Owners;