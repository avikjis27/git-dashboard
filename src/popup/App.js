/*global chrome*/
import React, { Component } from 'react';
import './App.css';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
				openPRCount: "-"
		};
	}

	openOptionPage() {
		chrome.runtime.openOptionsPage();
	}

	componentDidMount() {
		chrome.runtime.sendMessage({ type: 'popupInit' }, (response) => {
			if (response) {
				this.setState({
					openPRCount: response
				});
			}
		});
	}

	render() {
		return (
			<div>
				<main className="popup-container">
					<section className="refresh">
						<img src="refresh16.png"></img>
					</section>
					<section className="summary-table">
						<fieldset>
							<legend><b>Team's dashboard:</b></legend>
							<table>
								<tbody>
								<tr>
									<td>Total Open</td>
									<td>{this.state.openPRCount}</td>
								</tr>
								<tr>
									<td>Asked your review</td>
									<td>6</td>
								</tr>
								</tbody>
							</table>
						</fieldset>
						<fieldset>
							<legend><b>Personal dashboard:</b></legend>
							<table>
								<tbody>
								<tr>
									<td>Open</td>
									<td>12</td>
								</tr>
								<tr>
									<td>Ready for merge</td>
									<td>6</td>
								</tr>
								<tr>
									<td>Change Requested</td>
									<td>6</td>
								</tr>
								</tbody>
							</table>
						</fieldset>
					</section>
					<span className="last-update">* Updated: 18th July, 2020 23.30</span>
					<section>
						<li onClick={this.openOptionPage}>Options</li>
						<li>Details</li>
					</section>
				</main>
			</div>
		);
	};
}

export default App;
