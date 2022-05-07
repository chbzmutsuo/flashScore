
import axios from "axios";
import { resolve } from "path";
const cheerio = require('cheerio');





export default async function Index(req, res) {
	let items = [];
	let rakuten, amazon, yahoo
	// const searchWord = req.body.searchWord;
	const searchWord = req.query.url;

	const RAKUTEN_URL = `https://search.rakuten.co.jp/search/mall/${encodeURI(searchWord)}/?s=11`

	const AMAZON_URL = `https://www.amazon.co.jp/s?k=${encodeURI(searchWord)}&s=price-asc-rank&__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=206W0TL0OM2N5&qid=1651031081&sprefix=%E7%84%A1%E5%8D%B0%2Caps%2C233&ref=sr_st_price-asc-rank`

	const YAHOO_URL = `https://shopping.yahoo.co.jp/search?p=${encodeURI(searchWord)}&tab_ex=commerce&area=13&X=2&sc_i=shp_pc_search_sort_sortitem`


	amazon = await scrapeAmazon(AMAZON_URL);
	yahoo = await scrapeYahoo(YAHOO_URL);
	rakuten = await scrapeRakuten(RAKUTEN_URL);

	return res.status(200).json({ rakuten, amazon, yahoo },)
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




/**楽天を検索 */
const scrapeRakuten = async (URL) => {
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
const scrapeAmazon = async (URL) => {
	console.log(URL)   //////////
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




