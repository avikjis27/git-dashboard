import { graphql } from "@octokit/graphql"
import {whoami} from "./git-who-am-i"
import moment from 'moment';

const QUERY = 
`query searchPR($q: String!) {
  search(query: $q, type: ISSUE) {
    issueCount
  }
}`;



export async function yourContribution(accessToken, owner, repo, ep) {
	const graphqlWithAuth = graphql.defaults({
		baseUrl: ep,
		headers: {
			authorization: "token " + accessToken,
		},
	});
	
	const result = {"yourReviews":0,"totalPRRaised":0}
	try{
		const pastDate = moment().subtract(7, 'days').format("YYYY-MM-DD")
		console.log("ENDPOINT PASSED: yourContribution",ep)
		let me = await whoami(accessToken, ep);
		let response = await graphqlWithAuth(QUERY, {
			q: "repo:"+owner+"/"+repo+" is:pr created:>"+pastDate+" reviewed-by:"+me
		});
		result.yourReviews = response.search.issueCount
		response = await graphqlWithAuth(QUERY, {
			q: "repo:"+owner+"/"+repo+" is:pr created:>"+pastDate
		});
		result.totalPRRaised = response.search.issueCount
		
	}catch(error){
		console.log("Request failed:", error.request);
		console.log(error.message);
	}
	return result;
}