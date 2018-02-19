import mochaPlugin from 'serverless-mocha-plugin'
const expect = mochaPlugin.chai.expect
const wrapped = mochaPlugin.getWrapper('gateway', '/src/handler', 'gateway')

describe('Result', () => {
	it('should be success', async () => {
		let res = await wrapped.run({
			path: `testing/giftwp/goalrilla-b2415w`
		})
		console.log('RES:', res)
		res = JSON.parse(res.body)
		expect(res.form).to.not.be.empty
	})
})
