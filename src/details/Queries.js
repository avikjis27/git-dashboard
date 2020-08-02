import React, { Component } from 'react';
import './Queries.css';

class Queries extends Component {

	constructor(props) {
		super(props);
		this.state = {
			queries: {
				OPEN_PR: 0,
				OPEN_ISSUES: 0,
				OWN_PR_STATUS: 0
			}
		};
	}

	componentDidMount() {
		
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
						<td>{this.state.queries["OPEN_PR"]}</td>
					</tr>
					<tr>
						<td>All Open Issues(s)</td>
						<td>{this.state.queries["OPEN_ISSUES"]}</td>
					</tr>
					<tr>
						<td>Status of your PR(s)</td>
						<td>{this.state.queries["OWN_PR_STATUS"]}</td>
					</tr>
				</tbody>
			</table>
		)
	}
}

export default Queries;