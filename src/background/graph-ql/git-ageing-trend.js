import { graphql } from "@octokit/graphql"

const QUERY_PR_AGEING_TREND = `query prAgingTrend($owner: String!, $repo: String!){
	repository(owner: $owner, name: $repo) {
		pullRequests(states: MERGED, orderBy: {field: CREATED_AT, direction: DESC}, first:100){
			edges{
        node{
          createdAt
          mergedAt
          number
        }
      }
		}
	}
}`;

export async function prAgeingTrend(accessToken, owner, repo, ep) {
	const graphqlWithAuth = graphql.defaults({
		baseUrl: ep,
		headers: {
			authorization: "token " + accessToken,
		},
	});
	const age = []
	const label = []
	const result = {}
	try{
		const response = await graphqlWithAuth(QUERY_PR_AGEING_TREND, {
			repo: repo,
			owner: owner
		});
		response.repository.pullRequests.edges.forEach(item => {
			const number = item.node.number;
			const createdAt = Date.parse(item.node.createdAt);
			const mergedAt = Date.parse(item.node.mergedAt);
			const diffDays = parseInt((mergedAt - createdAt) / (1000 * 60 * 60), 10);
			age.push(diffDays);
			label.push(number)
		});
		result["data"] = age
		result["label"] = label
	}catch(error){
		console.log("Request failed:", error.request);
		console.error(error.message);
	}
	return result;
}
