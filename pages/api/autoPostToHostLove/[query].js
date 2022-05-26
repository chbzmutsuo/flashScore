

const puppeteer = require('puppeteer');




export default async function autoPostToHostLove(req, res) {
	let results = false


	try {
		let url = req.body.url
		url = "https://kanto.hostlove.com/"
		const options = {
			args: ['--no-sandbox', '-disable-setuid-sandbox'],
			// executablePath: "",
			defaultViewport: {
				width: 1920,
				height: 1080,
			},

			headless: false, // ヘッドレスをオフに
			slowMo: 200  // 動作を遅く
		};
		const browser = await puppeteer.launch(options);
		const page = await browser.newPage();
		await page.goto(url);


		const pickedBoardHref = await selectTargetBoardHref(url, page)
		console.log(`${pickedBoardHref}に飛びました。記事の抽出を行います。`)   //////////

		const pickedThreadHref = await selectThreadToPost(pickedBoardHref, page)
		console.log(`${pickedThreadHref}のスレッドが選ばれました`)   //////////

		const post = await postComment(pickedThreadHref, page, "commentを行います")
		console.log({ post })   //////////




		browser.close()


		return res.json(results)
	} catch (error) {
		console.error(error)
		res.json({ msg: 'エラーが発生しました' })
	}
}


async function postComment(pickedThreadHref, page, comment) {
	await page.goto(pickedThreadHref)
	const post = await page.type('textarea#comment2', comment)
	console.log(post)   //////////
	return post
}

/**ポストする掲示板を見つける */
async function selectThreadToPost(pickedBoardHref, page) {
	//hrefを特定

	await page.goto(pickedBoardHref)
	const TARGET_THREAD_LIST = await page.$('ul.link_list');
	let hrefs = await TARGET_THREAD_LIST.$$eval('a', (list) => list.map(elem => elem.href))
	const pickedThreadHref = hrefs[ranNum(hrefs.length)]
	return pickedThreadHref

}

/**掲示板を限定する */
async function selectTargetBoardHref(url, page) {
	await page.goto(url);
	const section = await page.$('div#open_menu')
	const aTags = await section.$$('a')
	let hrefs = await section.$$eval('a', (list) => list.map(elem => elem.href))
	console.log(hrefs.length)
	const pickedBoardHref = hrefs[ranNum(hrefs.length)]
	return pickedBoardHref
}

function ranNum(max) {
	return Math.floor(Math.random() * max);
}


async function getProperty(elem, property) {
	let result;
	let jsHadnle = await elem.getProperty(property);
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
