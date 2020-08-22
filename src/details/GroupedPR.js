import React, { Component } from 'react';
import Collapsible from 'react-collapsible';



class GroupedPR extends Component {

	
	createPRDetails(data){
		const tableData = []
		data.forEach((item, index) => {
			tableData.push(
				<tr key={index}>
					<td><a href={item.url}>{item.number}</a></td>
					<td> By:  <b>{item.author}</b></td>
					<td> {item.title}</td>
				</tr>
			)
		});
		return (
			<table>
				<tbody>
					{tableData}
				</tbody>
			</table>
		)
	}
	//TODO: Need to fix the style's name to generic instead of owner
	prepareDetailsFrame(data){
		const collapsibles = []
		const ages = Object.keys(data).sort(function(a, b){return b-a});
		ages.forEach((item, index) => {
			const value = data[item];
			const label = value.length + "PR(s) opened of age " + item
			collapsibles.push(
				<div key={index}>
				<Collapsible trigger={label}
					triggerClassName="owner-style-open"
					triggerOpenedClassName="owner-style-closed"
					contentOuterClassName="owner-style-content-outer"
					contentInnerClassName="owner-style-content-inner">
					{this.createPRDetails(value)}
				</Collapsible>
				</div>
			)
		});
		return collapsibles
	}
 
	render() {
		return this.prepareDetailsFrame(this.props.data)
	}
}

export default GroupedPR;