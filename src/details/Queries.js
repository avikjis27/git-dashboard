import React, { Component } from 'react';
import GroupedPR from './GroupedPR';
import Popup from "reactjs-popup";
import './Queries.css';

class Queries extends Component {

	constructor(props) {
		super(props);
		this.state = {
			reports: {
				"OPEN_PR": '-',
				"OPEN_ISSUES": '-',
				"OWN_PR_STATUS": {},
				"AGED_PRS": {},
				"YOUR_CONTRIBUTION": '-'
			},
			openPRLink: "",
			openIssuesLink: "",
			yourOpenPRLink: "",
		};
	}

	componentDidMount() {
		this.fetchRequiredReports(this.props.domain, this.props.owner, this.props.repo);
		this.setState({openPRLink: "https://"+this.props.domain+"/"+this.props.owner+"/"+this.props.repo+"/"+"pulls"});
		this.setState({openIssuesLink: "https://"+this.props.domain+"/"+this.props.owner+"/"+this.props.repo+"/"+"issues"});
		this.setState({yourOpenPRLink: "https://"+this.props.domain+"/"+this.props.owner+"/"+this.props.repo+"/"+"pulls"+"/"+"@me"});
	}

	fetchRequiredReports(domain, owner, repo) {
		const reportKey = domain + "/" + owner + "/" + repo;
		chrome.runtime.sendMessage({ type: 'fetchAvailableReports', reportkey: reportKey }, (response) => {
			if (response) {
				chrome.runtime.sendMessage({ type: 'queryGitRepo', domain: domain, owner: owner, repo: repo, reportNames: response.query }, (response) => {
					this.setState({ reports: response });
				});
			}
		});
	}


	renderOwnPRStatus(ownPRStatus) {
		if (ownPRStatus) {
			const reviewRequired = ownPRStatus["REVIEW_REQUIRED"] ? ownPRStatus["REVIEW_REQUIRED"].length : '-';
			const approved = ownPRStatus["APPROVED"] ? ownPRStatus["APPROVED"].length : '-';
			const changesRequested = ownPRStatus["CHANGES_REQUESTED"] ? ownPRStatus["CHANGES_REQUESTED"].length : '-';
			return (
				<div>
					<span>Review Required:</span> {reviewRequired} <span className="approved">Approved:</span> {approved} <span className="change-required">Change Requested:</span> {changesRequested}
				</div>
			)
		} else {
			return (
				<div>
					-
				</div>
			)
		}
	}
	renderYourContribution(yourContribution){
		if(yourContribution){
			return (
				<div>
					You reviewed {yourContribution.yourReviews} PR(s) out of {yourContribution.totalPRRaised} raised in last 7 days.
				</div>
			)
		} else {
			return (
				<div>
					-
				</div>
			)
		}
		
	}

	renderAgedOpenPRs(agedPRs) {
		if (this.state.reports["AGED_PRS"] && Object.keys(this.state.reports["AGED_PRS"]).length > 0) {
			return (
				<div>
					<Popup trigger={ <a href="#">Details</a> } position="right center" modal closeOnDocumentClick>
						<div className="details-scroll-pane"><GroupedPR data={agedPRs} /></div>
  				</Popup>
				</div>
			)
		} else {
			return (
				<div>
					-
				</div>
			)
		}
	}

	render() {
		return (
			<table>
				{/* <thead>
					<tr>
						<th>Query Name</th>
						<th>Result</th>
					</tr>
				</thead> */}
				<tbody>
					<tr>
						<td><a href={this.state.openPRLink}>All Open PR(s)</a></td>
						<td>{this.state.reports["OPEN_PR"]? this.state.reports["OPEN_PR"]: '-'}</td>
					</tr>
					<tr>
						<td><a href={this.state.openIssuesLink}>All Open Issues(s)</a></td>
						<td>{this.state.reports["OPEN_ISSUES"]? this.state.reports["OPEN_ISSUES"]:'-'}</td>
					</tr>
					<tr>
						<td><a href={this.state.yourOpenPRLink}>Status of your PR(s)</a></td>
						<td>{this.renderOwnPRStatus(this.state.reports["OWN_PR_STATUS"])}</td>
					</tr>
					<tr>
						<td>Age of open PR(s)</td>
						<td>{this.renderAgedOpenPRs(this.state.reports["AGED_PRS"])}</td>
					</tr>
					<tr>
						<td>Your Contribution</td>
						<td>{this.renderYourContribution(this.state.reports["YOUR_CONTRIBUTION"])}</td>
					</tr>
				</tbody>
			</table>
		)
	}
}

export default Queries;