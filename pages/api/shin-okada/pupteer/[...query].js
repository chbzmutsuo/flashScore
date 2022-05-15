
import axios from "axios";
import { resolve } from "path";
const cheerio = require('cheerio');




export default async function Index(req, res) {
	let items = [];
	let data;
	const shopName = req.query.query[0]
	const searchWord = req.query.query[1]



	// const puppeteer = require('puppeteer');
	// const options = {
	// 	args: ['--no-sandbox', '-disable-setuid-sandbox'],
	// };
	// const browser = await puppeteer.launch(options);
	// const page = await browser.newPage();

	//データの取得
	// const URL = `https://www.amazon.co.jp/s?k=${encodeURI(searchWord)}&s=price-asc-rank&crid=206W0TL0OM2N5&qid=1651031081&ref=sr_st_price-asc-rank`
	// await page.goto(URL);

	// setTimeout(async () => {
	// 	const saiyasuneItemWrappers = await page.$$('div')



	// 	for (let i = 0; i < saiyasuneItemWrappers.length; i++) {
	// 		const item = saiyasuneItemWrappers[i]
	// 		const json = await item.getProperty('textContent')
	// 		// console.log(await json.jsonValue())   //////////
	// 	}

	// 	return res.json({ shopName, searchWord, items, URL })
	// }, 1000)






	//shop名と接続先URLを受け取り、shop名で条件分岐して、データを返す


	try {
		switch (shopName) {
			case 'amazon':
				data = await scrapeAmazon(searchWord);
				return res.json({ data, shopName, searchWord, query })
				break;
			case 'rakuten':
				data = await scrapeRakuten(searchWord);
				return res.json({ data, shopName, searchWord, query })
				break;
			case 'saiyasune':

				data = await scrapeSaiyasune(searchWord);
				return res.json({ data, shopName, searchWord, query })
				break;


			case 'yamada':
				data = await scrapeYamada(searchWord);
				return res.json({ data, shopName, searchWord, query })
				break;

			default:
				return res.json({ msg: 'shopName parameter unset ' })
				break;

			// default: break;
		}
	} catch (e) {
		console.log(e)
		return res.status(500).json({ e, msg: 'errorが発生' })
	}







	const YAHOO_URL = `https://shopping.yahoo.co.jp/search?p=${encodeURI(searchWord)}&tab_ex=commerce&area=13&X=2&sc_i=shp_pc_search_sort_sortitem`

	const SAIYASUNE_URL = `https://www.saiyasune.com/I1W${encodeURI(searchWord)}.html`




	// saiyasune = await scrapeSaiyasune(AMAZON_URL);

	// yahoo = await scrapeYahoo(YAHOO_URL);
	// rakuten = await scrapeRakuten(RAKUTEN_URL);


}


function sortByPrice(items) {
	return items.sort(
		function (a, b) {
			if (a.price < b.price) return -1;
			if (a.price > b.price) return 1;
			return 0;
		}
	)
}

function removeNoPriceItem(items) {
	return items.filter(item => { return item.price > 0 })
}




/**最安値ドットコム */
const scrapeSaiyasune = async (searchWord) => {
	const URL = `https://www.saiyasune.com/I1W${encodeURI(searchWord)}.html`
	let items = [];
	return await axios.get(URL).then(response => {
		const htmlParaser = response.data;
		const $ = cheerio.load(htmlParaser)
		console.log(htmlParaser)
		//繰り返し
		$('div', htmlParaser).each(function () {
			let title, href, price, imageUrl;
			title = $(this).find('.title').text()
			price = $(this).find('.important').text();
			price = Number(price.replace(',', "").replace('円', ""))
			href = $(this).find('a', '.title').attr('href')
			imageUrl = $(this).find('img', '.imageUrl_verticallyaligned').attr('src')
			items.push({ title, price, href, imageUrl })
		})

		let removeNoPrice = removeNoPriceItem(items)
		return sortByPrice(removeNoPrice)
	})
		.catch(error => { console.error(error); return { msg: error } })
}
/**山田 */
const scrapeYamada = async (searchWord) => {
	const URL = `https://www.yamada-denkiweb.com/search/${encodeURI(searchWord)}/?category=all&searchbox=1`

	let items = [];
	return await axios.get(URL).then(response => {
		const htmlParaser = response.data;
		const $ = cheerio.load(htmlParaser)
		//繰り返し
		$('.tiles.tiles--row', htmlParaser).each(function () {
			let title, href, price, imageUrl;
			const yamaadItem = $(this);
			title = yamaadItem.find('a.links-product').text();
			price = yamaadItem.find('p.price').text();
			price = price.replace("¥", '').replace(",", '')
			href = yamaadItem.find('a.links-product').attr('href');
			href = `https://www.yamada-denkiweb.com${href}`
			items.push({ title, price, href })
		});

		let removeNoPrice = removeNoPriceItem(items)
		return sortByPrice(removeNoPrice)
	})
		.catch(error => { console.error(error); return { msg: 'error' } })
}

/**楽天を検索 */
const scrapeRakuten = async (searchWord) => {

	const URL = `https://search.rakuten.co.jp/search/mall/${encodeURI(searchWord)}/?s=11`

	let items = [];
	return await axios.get(URL).then(response => {
		const htmlParaser = response.data;

		const $ = cheerio.load(htmlParaser)
		//繰り返し
		$('.searchresultitem', htmlParaser).each(function () {
			let title, href, price, imageUrl;
			title = $(this).find('.title').text()
			price = $(this).find('.important').text();
			price = Number(price.replace(',', "").replace('円', ""))
			href = $(this).find('a', '.title').attr('href')
			imageUrl = $(this).find('img', '.imageUrl_verticallyaligned').attr('src')
			items.push({ title, price, href, imageUrl })
		})

		let removeNoPrice = removeNoPriceItem(items)
		return sortByPrice(removeNoPrice)
	})
		.catch(error => { console.error(error); return { msg: error } })
}

/**Amazonを検索 */
const scrapeAmazon = async (searchWord) => {
	const URL = `https://www.amazon.co.jp/s?k=${encodeURI(searchWord)}&s=price-asc-rank&__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=206W0TL0OM2N5&qid=1651031081&sprefix=%E7%84%A1%E5%8D%B0%2Caps%2C233&ref=sr_st_price-asc-rank`

	let items = [];
	return await axios.get(URL).then(response => {
		const htmlParaser = response.data;
		const $ = cheerio.load(htmlParaser)
		//繰り返し
		$('.a-section.a-spacing-base', htmlParaser).each(function () {
			let title, href, price = 'no price set', imageUrl;
			title = $(this).find('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal').text();

			href = $(this).find('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal').attr('href');
			href = `https://www.amazon.co.jp/${href}`

			price = $(this).find('span.a-price-whole').text()
			price = Number(price.replace('￥', "").replace(',', ""))
			imageUrl = $(this).find('img', '.s-img').attr('src')

			items.push({ title, price, href, imageUrl })


		})
		let removeNoPrice = removeNoPriceItem(items)
		return sortByPrice(removeNoPrice)
	}).catch(error => { console.error(error); return { msg: error } })
}


/**yahooを検索 */
const scrapeYahoo = async (URL) => {
	let items = [];
	return await axios.get(URL).then(response => {
		const htmlParaser = response.data;
		const $ = cheerio.load(htmlParaser)
		//繰り返し
		$('.LoopList__item', htmlParaser).each(function () {
			let title, href, price = 'no price set', imageUrl;
			title = $(this).find('a._2EW-04-9Eayr').text();
			href = $(this).find('a._2EW-04-9Eayr').attr('href');
			price = $(this).find('._3-CgJZLU91dR').text()
			price = Number(price.replace('円', "").replace(',', ""))
			imageUrl = $(this).find('img', '._2Qs-G7hnS2-2').attr('src')
			items.push({ title, price, href, imageUrl })
		})

		let removeNoPrice = removeNoPriceItem(items)
		return sortByPrice(removeNoPrice)
	}).catch(error => { console.error(error); return { msg: error } })
}




