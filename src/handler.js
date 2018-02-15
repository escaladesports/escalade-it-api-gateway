import middy from 'middy'
import { jsonBodyParser, httpErrorHandler, cors } from 'middy/middlewares'
import fetch from 'fetch-retry'


async function passThrough(event, context) {

	let subdomain = 'apis'

	// Get path
	let path = event.path || '/'
	path = path.split('/')
	if(!path[0]){
		path.shift()
	}
	if(path[0] === 'testing'){
		subdomain = 'apistest'
		path.shift()
	}
	else if(path[0] === 'production'){
		path.shift()
	}


	let res = await fetch(`https://${subdomain}.escaladesports.com/v1/${path.join('/')}`, {
		headers: event.headers,
		body: event.body,
		method: event.httpMethod,
	})
	let body = await res.text()
	let status = res.status

	return {
		status,
		body,
	}
}

// Export function with middleware
module.exports.gateway = middy(passThrough)
	.use(cors())
	.use(httpErrorHandler())

/*
module.exports.gateway = middy((event, context, callback) => {
		console.log(event)
		callback(null, {
			body: JSON.stringify({
				method: event.method,
				path: event.path,
				headers: event.headers,
				result: 'success',
			})
		})
	})
	.use(cors())
	.use(httpErrorHandler())
*/