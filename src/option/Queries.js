import React, { Component } from 'react';
import './Queries.css';

class Queries extends Component {

	constructor(props) {
		super(props);
		this.state = {
			queries: {}
		};
	}

	componentDidMount() {
		const key = this.createKey();
		chrome.runtime.sendMessage({ type: 'fetchAvailableReports', key:key }, (response) => {
			if (response) {
				this.setState({ queries: response.query });
			}
		});
	}
	createKey(){
		return this.props.domain+"/"+this.props.owner+"/"+this.props.repo;
	}

	handleChange(event, queryKey){
		let objCopy = Object.assign({}, this.state.queries);
		objCopy[queryKey] = event.target.checked;
		this.setState({queries: objCopy});
		const key = this.createKey();
		chrome.runtime.sendMessage({ type: 'saveQueries', key: key, object: objCopy }, () => {
		});
	}


	render() {
		return (
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
		)
	}
}

export default Queries;