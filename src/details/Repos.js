import React, { Component } from 'react';
import Queries from './Queries';

class Repos extends Component {

	createRepoPanel(repos){
		const panel = [];
		repos.forEach(repo => {
			panel.push(
				<div className="repo-details" key={repo.name}>
					<fieldset>
						<legend>{repo.name}</legend>
						<Queries repo={repo.name} owner={this.props.owner} domain={this.props.domain}/>
					</fieldset>
				</div>
			);
		});
		return panel;
	}

	render() {
		return (
			this.createRepoPanel(this.props.repos)
			
		)
	}
}

export default Repos;