import middy from 'middy'
import { jsonBodyParser, httpErrorHandler, cors } from 'middy/middlewares'

// Export function with middleware
module.exports.hello = middy((event, context, callback) => {
		console.log(context)
		callback(null, {
			body: JSON.stringify({
				result: 'success'
			})
		})
	})
	.use(cors())
	.use(jsonBodyParser())
	.use(httpErrorHandler())