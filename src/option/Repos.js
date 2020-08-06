import React, { Component } from 'react';
import Queries from './Queries';

class Repos extends Component {

	constructor(props) {
		super(props);
		this.state = {
			repos: props.repos
		};
	}
	

	createRepoPanel(repos){
		const panel = [];
		repos.forEach(repo => {
			panel.push(
				<div className="repo-details" key={repo.name}>
					<fieldset>
						<legend>{repo.name}</legend>
						<Queries repo={repo} owner={this.props.owner} domain={this.props.domain}/>
					</fieldset>
				</div>
			);
		});
		return panel;
	}

	render() {
		return (
			this.createRepoPanel(this.state.repos)
			
		)
	}
}

export default Repos;