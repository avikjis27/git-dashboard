/*global chrome*/
import React, { Component } from 'react';
import './App.css';
import { faQuestionCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class App extends Component {

	constructor(props) {
    super(props);
		this.state = {
			accesstoken: '',
			repositories: [],
			queries:[]
		};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		const accesstoken = localStorage.getItem('accesstoken') || '';
		const repositories = JSON.parse(localStorage.getItem('repositories') || "[]");
		const queries = JSON.parse(localStorage.getItem('queries'));
		
		this.setState({ "accesstoken": accesstoken });
		this.setState({ "repositories": repositories });
		this.setState({ "queries": queries });
	}
	
	handleChange(event) {
		this.setState({"accesstoken": event.target.value});
		localStorage.setItem('accesstoken', event.target.value);
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
	}
	
	createRepositoryPanel(){
		const panel = []
		const elements = this.state.repositories;
		elements.forEach(value => {
			panel.push(
				<div className="repo-label">
				<FontAwesomeIcon icon={faQuestionCircle} color="cornflowerblue"/> {value} <FontAwesomeIcon icon={faTimesCircle} color="crimson"/>
        </div>
			)
		});
		return panel;
	}

	createQueryPanel(){
		const panel = []
		const elements = this.state.queries;
		elements.forEach(value => {
			panel.push(
				<div className="repo-label">
				<FontAwesomeIcon icon={faQuestionCircle} color="cornflowerblue"/> {value} <input className="checkbox" type="checkbox" />
        </div>
			)
		});
		return panel;
	}

	render() {
		return(
    <div>
      <fieldset>
        <legend>Aceess Token Sttings: </legend>
        <div className="access-label">
				<FontAwesomeIcon icon={faQuestionCircle} color="cornflowerblue"/> Git Access Token
        </div>
        <div className="input">
          <input type="text" value={this.state.accesstoken} onChange={this.handleChange}/><span className="flash">Saved</span>
        </div>
      </fieldset>
      <fieldset>
        <legend>Repository Sttings: </legend>
        {this.createRepositoryPanel()}
      </fieldset>
      <fieldset>
        <legend>Query Sttings: </legend>
        {this.createQueryPanel()}
      </fieldset>
    </div>
		)
  }
}

export default App;
