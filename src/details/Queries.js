import React, { Component } from 'react';
import './Queries.css';

class Queries extends Component {

	constructor(props) {
		super(props);
		this.state = {
			reports: {
				"OPEN_PR": '-',
				"OPEN_ISSUES": '-',
				"OWN_PR_STATUS": '-'
			}
		};
	}

	componentDidMount() {
		this.fetchRequiredReports(this.props.domain, this.props.owner, this.props.repo)
	}

	fetchRequiredReports(domain, owner, repo){
		const reportKey = domain+"/"+owner+"/"+repo;
		chrome.runtime.sendMessage({ type: 'fetchAvailableReports', reportkey:reportKey }, (response) => {
			if (response) {
				chrome.runtime.sendMessage({ type: 'queryGitRepo', domain: domain, owner: owner, repo: repo, reportNames: response.query }, (response) => {
					this.setState({ reports: response });
				});	
			}
		});
	}

	render() {
		return (
			<table>
				<thead>
					<tr>
						<th>Query Name</th>
						<th>Count</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>All Open PR(s)</td>
						<td>{this.state.reports["OPEN_PR"]}</td>
					</tr>
					<tr>
						<td>All Open Issues(s)</td>
						<td>{this.state.reports["OPEN_ISSUES"]}</td>
					</tr>
					<tr>
						<td>Status of your PR(s)</td>
						<td>{this.state.reports["OWN_PR_STATUS"]}</td>
					</tr>
				</tbody>
			</table>
		)
	}
}

export default Queries;