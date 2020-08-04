import React, { Component } from 'react';
import Queries from './Queries';
import { faHeart, faHeartBroken, faLink, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Repos extends Component {

	createRepoPanel(repos){
		const panel = [];
		repos.forEach(repo => {
			panel.push(
				<div className="repo-details" key={repo}>
					<fieldset>
						<legend>{repo}</legend>
						<div>
							<div className="repo-controls"><FontAwesomeIcon icon={faStar} /><span> Favourite</span></div>
							<div className="repo-controls"><FontAwesomeIcon icon={faHeartBroken} /><span> Unfollow</span></div>
							<div className="repo-controls"><FontAwesomeIcon icon={faLink} /><span> Go to Repo</span></div>
						</div>
						<Queries repo={repo} owner={this.props.owner} domain={this.props.domain}/>
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