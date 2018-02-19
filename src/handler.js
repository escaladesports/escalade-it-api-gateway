import middy from 'middy'
import { jsonBodyParser, httpErrorHandler, cors } from 'middy/middlewares'
import fetch from 'isomorphic-fetch'

const headers = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Credentials": true
}

// Export function with middleware
async function gateway(event, context, callback) {
	console.log('ENDPOINT HIT')
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
		//headers: event.headers,
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
	console.log('STATUS:', res.status)
	console.log('BODY:', body)
	return {
		statusCode: res.status,
		body,
	}
}



module.exports.gateway = middy(gateway)
	.use(cors())
	.use(httpErrorHandler())