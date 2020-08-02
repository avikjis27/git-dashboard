import React, { Component } from 'react';
import './Queries.css';

class Queries extends Component {

	componentDidMount() {
		chrome.runtime.sendMessage({ type: 'fetchQueries' }, (response) => {
			if (response) {
				//TODO
			}
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
						<td><input type="checkbox"></input></td>
					</tr>
					<tr>
						<td>All Open Issues(s)</td>
						<td><input type="checkbox"></input></td>
					</tr>
					<tr>
						<td>Status of your PR(s)</td>
						<td><input type="checkbox"></input></td>
					</tr>
				</tbody>
			</table>
		)
	}
}

export default Queries;