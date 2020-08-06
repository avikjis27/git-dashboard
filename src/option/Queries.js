import React, { Component } from 'react';
import './Queries.css';
import { faHeart, faHeartBroken, faLink, faSadTear, faStar, faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Queries extends Component {

	constructor(props) {
		super(props);
		this.state = {
			queries: {
				OPEN_PR: false,
				OPEN_ISSUES: false,
				OWN_PR_STATUS: false

			},
			repo: this.props.repo
		};
	}

	componentDidMount() {
		const key = this.createKey();
		chrome.runtime.sendMessage({ type: 'fetchAvailableReports', reportkey:key }, (response) => {
			if (response) {
				this.setState({ queries: response.query });
			}
		});
	}
	createKey(){
		return this.props.domain+"/"+this.props.owner+"/"+this.props.repo.name;
	}

	handleChange(event, queryKey){
		let objCopy = Object.assign({}, this.state.queries);
		objCopy[queryKey] = event.target.checked;
		this.setState({queries: objCopy});
		const key = this.createKey();
		chrome.runtime.sendMessage({ type: 'saveQueries', key: key, object: objCopy }, () => {
		});
	}

	toggleFavouriteRepo(repo){
		let currentState = Object.assign({}, repo);
		currentState.favourite = !currentState.favourite;
		chrome.runtime.sendMessage({ type: 'toggleFavourite', repo: {
			domain:this.props.domain,
			owner:this.props.owner,
			repo:repo.name
		} });
		this.setState({repo: currentState});
	}

	renderFavButton(repo){
		if (repo.favourite){
			return (
			<div className="repo-controls" onClick={() => this.toggleFavouriteRepo(repo)}>
				<FontAwesomeIcon icon={faHeart} />
			</div>
		)
		} else{
			return (
			<div className="repo-controls" onClick={() => this.toggleFavouriteRepo(repo)}>
				<FontAwesomeIcon icon={faHeartBroken} />
			</div>
		)
		}
	}


	render() {
		return (
			<div>
				{this.renderFavButton(this.state.repo)}
			
			<table>
				<thead>
					<tr>
						<th>Query Name</th>
						<th>Required</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>All Open PR(s)</td>
						<td><input type="checkbox" checked={this.state.queries["OPEN_PR"]} onChange={e => this.handleChange(e, "OPEN_PR")}></input></td>
					</tr>
					<tr>
						<td>All Open Issues(s)</td>
						<td><input type="checkbox" checked={this.state.queries["OPEN_ISSUES"]} onChange={e => this.handleChange(e, "OPEN_ISSUES")}></input></td>
					</tr>
					<tr>
						<td>Status of your PR(s)</td>
						<td><input type="checkbox" checked={this.state.queries["OWN_PR_STATUS"]} onChange={e => this.handleChange(e, "OWN_PR_STATUS")}></input></td>
					</tr>
				</tbody>
			</table>
			</div>
		)
	}
}

export default Queries;