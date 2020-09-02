/*global chrome*/
import React, { Component } from 'react';
import Collapsible from 'react-collapsible';
import './Notifications.css';
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Notifications extends Component {

	

	createPRDetails(prList) {
		let ignorePR = (url) => {
			chrome.runtime.sendMessage({ type: 'ignorePR', url: url }, () => {
				this.props.tasks.openPRRequiredReview.pop();
			});
		}
		let openPR = (url) => {
			chrome.tabs.create({url:url});
		}
		const prBadges = []
		prList.forEach((item, index) => {
			prBadges.push(
				<div className="badge" key={index}>
					<div className="badge-pr" onClick={() => openPR(item.url)}>{item.number}</div>
					<div className="badge-ignore" onClick={() => ignorePR(item.url)}><FontAwesomeIcon  icon={faTimesCircle} /></div>
				</div>
			)
		});
		return (
			<div>
				{prBadges}
			</div>
		)
	}

	rendertasks(tasks) {
		if (!tasks) {
			return
		}
		const reviewRequired = tasks.openPRRequiredReview;
		const needToMerge = tasks.prNeedToMerge;
		const changeRequested = tasks.changeRequested;
		const panel = [];
		let anyTask = false;
		if (reviewRequired.length > 0) {
			anyTask = true;
			panel.push(
				<div key="reviewRequired">
					<Collapsible trigger="Your review required"
						triggerClassName="owner-style-open"
						triggerOpenedClassName="owner-style-closed"
						contentOuterClassName="owner-style-content-outer"
						contentInnerClassName="owner-style-content-inner">
						{this.createPRDetails(reviewRequired)}
					</Collapsible>
				</div>
			);
		}
		if (needToMerge.length > 0) {
			anyTask = true;
			panel.push(
				<div key="needToMerge">
					<Collapsible trigger="Your PR(s) ready to be merged"
						triggerClassName="owner-style-open"
						triggerOpenedClassName="owner-style-closed"
						contentOuterClassName="owner-style-content-outer"
						contentInnerClassName="owner-style-content-inner">
						{this.createPRDetails(needToMerge)}
					</Collapsible>
				</div>
			);
		}
		if (changeRequested.length > 0) {
			anyTask = true;
			panel.push(
				<div key="changeRequested">
					<Collapsible trigger="Change requested on your PR(s)"
						triggerClassName="owner-style-open"
						triggerOpenedClassName="owner-style-closed"
						contentOuterClassName="owner-style-content-outer"
						contentInnerClassName="owner-style-content-inner">
						{this.createPRDetails(changeRequested)}
					</Collapsible>
				</div>
			);
		}
		if (!anyTask){
			return (
				<div className="noTask">
					Great! No pending tasks.
				</div>
			)
		}
		return panel;
	}

	render() {
		return (
			<div className="notification-panel">
				{this.rendertasks(this.props.tasks)}
			</div>
		)
	};
}

export default Notifications;
