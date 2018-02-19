import middy from 'middy'
import { jsonBodyParser, httpErrorHandler, cors } from 'middy/middlewares'
import fetch from 'isomorphic-fetch'

const allowedHeaders = [
	'Authorization',
	'Debug',
	'Content-Type',
]

function filterHeaders(obj){
	let res = {}
	for(let i in obj){
		if(allowedHeaders.indexOf(i) !== -1){
			res[i] = obj[i]
		}
	}
	return res
}

// Export function with middleware
async function gateway(event, context, callback) {
	console.log('Endpoint hit...')
	let subdomain = 'apis'

	// Get path
	let path = event.path || '/'
	path = path.split('/')
	if (!path[0]) {
		path.shift()
	}
	if (path[0] === 'testing') {
		subdomain = 'apistest'
		path.shift()
	}
	else if (path[0] === 'production') {
		path.shift()
	}

	// Fetch from API
	let url = `https://${subdomain}.escaladesports.com/v1/${path.join('/')}`
	let options = {
		headers: filterHeaders(event.headers),
		body: event.body,
		method: event.httpMethod || 'GET',
		rejectUnauthorized: false,
	}
	console.log(`Fetching ${url}:`, options)

	let res
	let body
	try {
		res = await fetch(url, options)
		body = await res.text()
	}
	catch(err){
		console.error(err)
		return {
			statusCode: 500,
			error: err,
		}
	}
	console.log('Status:', res.status)
	console.log('Body:', body)
	return {
		statusCode: res.status,
		body,
	}
}



module.exports.gateway = middy(gateway)
	.use(cors())
	.use(httpErrorHandler())