
const puppeteer = require('puppeteer');




export default async function getTeamScors(req, res) {
	try {
		let url = "https://www.flashscore.co.jp/team/schio/h4Y1lKRQ/";
		// url = req.query.url
		const options = {
			args: ['--no-sandbox'],
			// executablePath: "",
			defaultViewport: null,
			// headless: false, // ヘッドレスをオフに
			// slowMo: 100  // 動作を遅く
		};
		const browser = await puppeteer.launch(options);
		const page = await browser.newPage();
		await page.goto(url);

		setTimeout(async () => {
			const html = await page.content()
			await browser.close()
			return res.json({ html })
		}, 100);


	} catch (error) {
		console.error(error)
		res.json({ msg: 'エラーが発生しました' })
	}
}




async function getText(elem) {
	let result;
	let jsHadnle = await elem.getProperty('textContent');
	result = await jsHadnle.jsonValue();
	return result;
}


//**親要素の中でselector検索を行い、テクストを返す */
async function getTextFromElementArray(parent, selector) {
	try {
		const elems = await parent.$$(selector);
		const elem = elems[0]
		return await getText(elem)
	} catch (error) {
		console.error(error)   //////////
		return 'error'
	}

}
