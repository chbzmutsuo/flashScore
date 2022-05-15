
import axios from "axios";
import { resolve } from "path";
const cheerio = require('cheerio');







export default async function Index(req, res) {
	let items = [];
	let data;
	const query = req.query.query
	const shopName = req.query.query[0]
	const searchWord = req.query.query[1]


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

			//最安値はiframのため入手不可能
			// case 'saiyasune':
			// 	data = await scrapeSaiyasune(searchWord);
			// 	return res.json({ data, shopName, searchWord, query })
			// 	break;


			case 'yahoo':
				data = await scrapeYahoo(searchWord);
				return res.json({ data, shopName, searchWord, query })
				break;
			case 'hobbyStock':
				data = await scrapehobbyStock(searchWord);
				return res.json({ data, shopName, searchWord, query })
				break;

			case 'hobbySearch':
				data = await scrapehobbySearch(searchWord);
				return res.json({ data, shopName, searchWord, query })
				break;
			case 'yamada':
				data = await scrapeYamada(searchWord);
				return res.json({ data, shopName, searchWord, query })
				break;

			default:
				return res.json({ msg: 'shopName parameter unset ' })
				break;
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
	const iframeSrc = "https://www.saiyasune-if3.com/index.php?sai_price=&ik_kw=4549980493106&jancode=&ik_pr1=&ik_pr2=&ik_st=2&rcate=&ik_e_sp=&ik_e_ol=&item_code="
	axios.get(iframeSrc).then(response => {
		const htmlParaser = response.data;
	})

	return



	const URL = `https://www.saiyasune.com/I1W${encodeURI(searchWord)}.html`
	let items = [];
	return fetch(URL).then(response => response.text()).then(data => {
		const htmlParaser = data;
		const $ = cheerio.load(htmlParaser)
		console.log(htmlParaser)
		//繰り返し
		$('iframe', htmlParaser).each(function () {
			const attr = $(this).attr("src");
			let title, href, price, imageUrl;
			title = $(this).find('.title').text()
			price = $(this).find('.important').text();
			price = Number(price.replace(',', "").replace('円', ""))
			href = $(this).find('a', '.title').attr('href')
			imageUrl = $(this).find('img', '.imageUrl_verticallyaligned').attr('src')
			items.push({ title, price, href, imageUrl })
		})

		let removeNoPrice = removeNoPriceItem(items)
		return { data: sortByPrice(removeNoPrice), url: URL }
	})
		.catch(error => { console.error(error); return { msg: error } })
}



/**ホビーストック */
const scrapehobbyStock = async (searchWord) => {
	const URL = `https://www.hobbystock.jp/groups?keyword=${encodeURI(searchWord)}`

	let items = [];
	return fetch(URL).then(response => response.text()).then(data => {
		const htmlParaser = data;
		const $ = cheerio.load(htmlParaser)
		//繰り返し
		$('.animate_item', htmlParaser).each(function () {
			let title, href, price, imageUrl;
			const yamaadItem = $(this);
			title = yamaadItem.find('h3.name').text();
			price = yamaadItem.find('ins').text();
			price = parseInt(price.replace("¥", '').replace(",", '').replace("円", ''))
			href = yamaadItem.find('a').attr('href');
			href = `https://www.hobbystock.jp${href}`
			items.push({ title, price, href })
		});


		let removeNoPrice = removeNoPriceItem(items)
		return { data: sortByPrice(removeNoPrice), url: URL }
	})
		.catch(error => { console.error(error); return { msg: 'error' } })
}
/**ホビーサーチ */
const scrapehobbySearch = async (searchWord) => {
	const URL = `https://www.1999.co.jp/search?typ1_c=101&cat=&state=&sold=0&searchkey=${encodeURI(searchWord)}&spage=1&sortid=2`

	let items = [];

	return fetch(URL).then(response => response.text()).then(data => {
		const htmlParaser = data;
		const $ = cheerio.load(htmlParaser)
		//繰り返し
		$('table.tableFixed', htmlParaser).each(function () {
			let title, href, price, imageUrl;
			const yamaadItem = $(this);
			title = yamaadItem.find('div.ListItemName').find('a').find('span').text()
			href = yamaadItem.find('div.ListItemName').find('a').attr('href');
			href = `https://www.1999.co.jp${href}`
			price = yamaadItem.find('tbody').find('td').find('span').text()
			price = convertCompletStringToPrice(price)

			if (title !== '') {
				items.push({ title, price, href })
			}
		});
		let removeNoPrice = removeNoPriceItem(items)
		return { data: sortByPrice(removeNoPrice), url: URL }

	}).catch(error => { console.error(error); return { msg: 'error' } })


}
/**山田 */
const scrapeYamada = async (searchWord) => {
	const URL = `https://www.yamada-denkiweb.com/search/${encodeURI(searchWord)}/?category=all&searchbox=1`

	let items = [];
	return fetch(URL).then(response => response.text()).then(data => {
		const htmlParaser = data;
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
		return { data: sortByPrice(removeNoPrice), url: URL }
	})
		.catch(error => { console.error(error); return { msg: 'error' } })
}

/**楽天を検索 */
const scrapeRakuten = async (searchWord) => {

	const URL = `https://search.rakuten.co.jp/search/mall/${encodeURI(searchWord)}/?s=11`

	let items = [];
	return fetch(URL).then(response => response.text()).then(data => {
		const htmlParaser = data;

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
		return { data: sortByPrice(removeNoPrice), url: URL }
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
		return { data: sortByPrice(removeNoPrice), url: URL }
	}).catch(error => { console.error(error); return { msg: error } })
}


/**yahooを検索 */
const scrapeYahoo = async (searchWord) => {
	const URL = `https://shopping.yahoo.co.jp/search?p=${encodeURI(searchWord)}&tab_ex=commerce&area=13&X=2&sc_i=shp_pc_search_sort_sortitem`
	let items = [];
	return fetch(URL).then(response => response.text()).then(data => {
		const htmlParaser = data;
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
		return { data: sortByPrice(removeNoPrice), url: URL }
	}).catch(error => { console.error(error); return { msg: error } })
}






/** アーテック発売：シリーズ：販売価格：¥102¥102原作：取得ポイント：1ポイント1ポイント商品コード：073606の中から数値だけを抽出 */
function convertCompletStringToPrice(string) {
	const index = string.indexOf("¥");
	const lastIndex = string.lastIndexOf("¥");


	string = string.slice(index + 1, lastIndex)
	if (string.indexOf('(') > 0) {
		string = string.slice(0, string.indexOf('('))
	}
	return string
}





