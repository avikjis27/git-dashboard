import React, { Component } from 'react';
import { Chart } from 'react-charts'
import { ResizableBox } from 'react-resizable'



class BarChart extends Component {

	convertToChartData(data) {
		console.log("convertToChartData",data)
		const graphData = []
		Object.entries(data).map(([key, value]) => graphData.push({"primary": key, "secondary": value}))
		
		return [
			{
				label: 'PR Ages',
				data: graphData
			}
		]
	}
 
	render() {
		
		const axes = [
		{ primary: true, type: 'ordinal', position: 'bottom' },
		{ type: 'linear', position: 'left' },
		];

		return (
			<ResizableBox width={400} height={600}>
			<Chart data={this.convertToChartData(this.props.data)} axes={axes}/>
		</ResizableBox>
		)
	}
}

export default BarChart;