export function getEP(domain) {
	if (domain === "github.com"){
		return "https://api.github.com"
	}else{
		return "https://"+ domain + "/" + "api"
	}
}