import { graphql } from "@octokit/graphql"

const ME =
	`query {
  viewer {
    login
  }
}`

export async function whoami(accessToken, ep) {
	console.log("ENDPOINT PASSED",ep)
	const graphqlWithAuth = graphql.defaults({
		baseUrl: ep,
		headers: {
			authorization: "token " + accessToken,
		},
	});
	let whoami
	try {
		whoami = await graphqlWithAuth(ME);
	} catch (error) {
		console.log("Request failed:", error.request);
		console.log(error.message);
	}
	return whoami.viewer.login;
}
