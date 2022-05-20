

const puppeteer = require('puppeteer');




export default async function dynamicHtmlScarping(req, res) {
	try {
		let url = req.body.url
		const options = {
			args: ['--no-sandbox', '-disable-setuid-sandbox'],
			// executablePath: "",
			// defaultViewport: null,
			// defaultViewport: { width: 1980, height: 1080 },
			// headless: false, // ヘッドレスをオフに
			// slowMo: 200  // 動作を遅く
		};

		const browser = await puppeteer.launch(options);
		const page = await browser.newPage();
		await page.goto(url);




		// 非同期処理をおこなう関数を宣言
		const getHrefAll = async () => {
			return new Promise(async (resolve, reject) => {
				let hrefs = await page.$$eval("a", (list) => list.map((elm) => elm.href));
				hrefs = hrefs.filter(href => href !== '')
				resolve(hrefs);
			})
		};

		getHrefAll().then(async result => {
			await browser.close();
			return await res.json({ result })
		});





		// const matches = await page.$$('div.event__match');
		// try {

		// 	let data = [];
		// 	for (let i = 0; i < matches.length; i++) {
		// 		const home = await getTextFromElementArray(matches[i], 'div.event__participant--home')
		// 		const away = await getTextFromElementArray(matches[i], 'div.event__participant--away')
		// 		const eventTime = await getTextFromElementArray(matches[i], 'div.event__time')


		// 		const wld = await getTextFromElementArray(matches[i], 'span.wld')

		// 		const homeScore = await getTextFromElementArray(matches[i], 'div.event__score--home')
		// 		const awatScore = await getTextFromElementArray(matches[i], 'div.event__score--away')
		// 		data.push({ home, away, eventTime, wld, homeScore, awatScore, })

		// 		if (i === matches.length - 1) {
		// 			await browser.close()
		// 			return res.json({ data })
		// 		}
		// 	}
		// } catch (error) {
		// 	console.error(error)
		// 	await browser.close()
		// 	return res.json({ msg: 'errorが起きました' })

		// }






	} catch (error) {
		console.error(error)
		res.json({ msg: 'エラーが発生しました' })
	}

}




async function getAttr(elem, attribute) {
	let result;
	let jsHadnle = await elem.getProperty(attribute);
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
