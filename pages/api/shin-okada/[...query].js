
const cheerio = require('cheerio');
import axios from 'axios';







export default async function Index(req, res) {
	let items = [];
	let data;
	const shopName = req.query.query[0]
	const searchWord = req.query.query[1]
	const body = req.body

	function getNumber() {
		return new Promise(async function (resolve, reject) {
			const data = await tryScraping(shopName)
			items.push({ key: shopName, data });
			resolve('データ取得完了');

		});
	}
	getNumber().then(result => {
		console.log(result)   //////////
	}).then(result => {
		console.log('レスポンスを返します')   //////////
		return res.json({ items, shopName, searchWord })
	})





	/**shop名と接続先URLを受け取り、shop名で条件分岐して、データを返す */
	async function tryScraping(key) {
		try {
			switch (key) {
				case 'amazon':
					data = await scrapeAmazon(searchWord);
					console.log(`${key}: ${data.data.length}件のデータ`)   //////////
					return data
					break;
				case 'surugaya':
					data = await scrapeSurugaya(searchWord);
					console.log(`${key}: ${data.data.length}件のデータ`)   //////////
					return data
					break;
				case 'rakuten':
					data = await scrapeRakuten(searchWord);
					console.log(`${key}: ${data.data.length}件のデータ`)   //////////
					return data
					break;
				case 'yahoo':
					data = await scrapeYahoo(searchWord);
					console.log(`${key}: ${data.data.length}件のデータ`)   //////////
					return data
					break;
				case 'hobbySearch':
					data = await scrapehobbySearch(searchWord);
					console.log(`${key}: ${data.data.length}件のデータ`)   //////////
					return data
					break;

				//最安値はiframのため入手不可能
				case 'saiyasune':
					data = await scrapeSaiyasune(searchWord);
					console.log(`${key}: ${data.data.length}件のデータ`)   //////////
					return data
					break;


				case 'hobbyStock':
					let dataFromOtherShop = await tryScraping('amazon')
					dataFromOtherShop.data.length === 0 ? dataFromOtherShop = await tryScraping('yahoo') : '';
					let textSearchWord = dataFromOtherShop.data[0]?.title.slice(0, 30)
					console.log(`ホビーストックはキーワード検索を行います${textSearchWord}`)   //////////
					data = await scrapehobbyStock(textSearchWord);
					console.log(`${key}: ${data.data.length}件のデータ`)   //////////
					return data
					break;

				case 'yamada':
					data = await scrapeYamada(searchWord);
					console.log(`${key}: ${data.data.length}件のデータ`)   //////////
					return data
					break;

				default:
					return res.json({ msg: 'shopName parameter unset ' })
					break;

			}
		} catch (e) {
			console.log(e)
			return res.status(500).json({ e, msg: 'errorが発生' })
		}
	}













}




/**ホビーストック */
const scrapehobbyStock = async (searchWord) => {
	const URL = `https://www.hobbystock.jp/groups?keyword=${encodeURI(searchWord)}`

	let items = [];
	return axios.get(URL).then(response => {
		const htmlParaser = response.data;
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
		return { url: URL, data: sortByPrice(removeNoPrice) }
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

		//１つだけ結果が表示される場合
		let title, href, price, imageUrl;
		console.log('個別詳細ページにデータを取得しに行きます')   //////////
		title = $('.h2_itemDetail').text();
		href = URL;
		price = $('span.Price_Dai').text().replace(/¥|,|\n|\(税込\)|代引・銀行・コンビニ|\s|/g, "")
		items.push({ title, price, href })

		let removeNoPrice = removeNoPriceItem(items)
		return { url: URL, data: sortByPrice(removeNoPrice) }

	})
		.catch(error => { console.error(error); return { msg: 'error' } })
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
		return { url: URL, data: sortByPrice(removeNoPrice) }
	})
		.catch(error => { console.error(error); return { msg: 'error' } })


}

/**楽天を検索 */
const scrapeRakuten = async (searchWord) => {

	const URL = `https://search.rakuten.co.jp/search/mall/${encodeURI(searchWord)}/?s=11&used=0`

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
		return { url: URL, data: sortByPrice(removeNoPrice) }
	})
		.catch(error => { console.error(error); return { msg: error } })
}

/**Amazonを検索 */
/**これだけはpupteerにて */
const scrapeAmazon = async (searchWord) => {
	// const URL = `https://www.amazon.co.jp/s?k=${encodeURI(searchWord)}&s=price-asc-rank&__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=206W0TL0OM2N5&qid=1651031081&sprefix=%E7%84%A1%E5%8D%B0%2Caps%2C233&ref=sr_st_price-asc-rank`
	const URL = `https://www.amazon.co.jp/s?k=${encodeURI(searchWord)}&__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=3JW6U8Z89UAC3&sprefix=${encodeURI(searchWord)}%2Caps%2C454&ref=nb_sb_noss`
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
		return { url: URL, data: sortByPrice(removeNoPrice) }
	}).catch(error => { console.error(error); return { msg: error } })

	// const options = {
	// 	args: ['--no-sandbox', '-disable-setuid-sandbox'],
	// 	// headless: false,
	// 	// slowMo: 30
	// };

	// const puppeteer = require('puppeteer');
	// const browser = await puppeteer.launch(options)

	// const page = await browser.newPage()
	// await page.goto(URL, { waitUntil: 'networkidle2', });


	// const itemList = await page.$$('.a-section.a-spacing-base');
	// if (itemList.length === 0) {
	// 	console.log('例外処理')   //////////

	// 	const prices = await page.$$('.a-price-whole');
	// 	for (let i = 0; i < prices.length; i++) {
	// 		const priceEl = prices[i]
	// 		let title, href, price = 'no price set', imageUrl;
	// 		price = await getProp(priceEl, "textContent")
	// 		price = price.replace('￥', "").replace(',', "").replace("¥", "")/////////
	// 		items.push({ title, price, href, imageUrl })
	// 		// console.log('no Data')   //////////
	// 		if (i === prices.length - 1) {
	// 			console.log(items)   //////////
	// 			const removeNoPrice = removeNoPriceItem(items)
	// 			browser.close()
	// 			return { url: URL, data: sortByPrice(removeNoPrice) }
	// 		}

	// 	}

	// 	if (prices.length === 0) {
	// 		browser.close()
	// 		return { url: URL, data: [], noData: true }
	// 	}

	// } else {
	// 	console.log('通常処理')   //////////
	// 	for (let i = 0; i < itemList.length; i++) {
	// 		let item = itemList[i]
	// 		let title, href, price = 'no price set', imageUrl;
	// 		let atag = await item.$('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal')
	// 		title = await getProp(atag, "textContent")
	// 		href = await getProp(atag, 'href')
	// 		price = await item.$('span.a-price-whole')
	// 		price = await getProp(price, "textContent")
	// 		price = price.replace('￥', "").replace(',', "").replace("¥", "")
	// 		items.push({ title, price, href, imageUrl })
	// 		if (i === itemList.length - 1) {
	// 			console.log(items)   //////////
	// 			const removeNoPrice = removeNoPriceItem(items)
	// 			browser.close()
	// 			return { url: URL, data: sortByPrice(removeNoPrice) }
	// 		}
	// 	}
	// }


	// itemList.forEach(async item => {
	// 	let title, href, price = 'no price set', imageUrl;
	// 	let atag = await item.$('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal')
	// 	title = await getProperty(atag, "textContent")
	// 	href = await getProperty(atag, 'href')

	// 	price = await item.$('span.a-price-whole')
	// 	price = await getProperty(price, "textContent")
	// 	price = Number(price.replace('￥', "").replace(',', ""))
	// 	items.push({ title, price, href, imageUrl })
	// })
	// console.log(items)   //////////








	async function getProp(elem, property) {
		try {
			let result;
			if (elem) {
				let jsHadnle = await elem.getProperty(property);
				result = await jsHadnle.jsonValue();
				return result;
			} else {
				return 'element is null'
			}
		} catch (error) {
			console.error(error)
			return 'error'
		}
	}

}


/**yahooを検索 */
const scrapeYahoo = async (searchWord) => {
	const URL = `https://shopping.yahoo.co.jp/search?X=2&p=${encodeURI(searchWord)}&tab_ex=commerce&sc_i=shp_pc_search_nrwtr_item&area=13&used=2&b=1`

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
		return { url: URL, data: sortByPrice(removeNoPrice) }
	}).catch(error => { console.error(error); return { msg: error } })
}
const scrapeSurugaya = async (searchWord) => {
	const URL = `https://www.suruga-ya.jp/search?category=&search_word=${encodeURI(searchWord)}&search_word_root=${encodeURI(searchWord)}&category1=0&category2=0&category3=0&sale_classified=1&title=&year1=&month1=&day1=&year2=&month2=&day2=&adult_s&inStock=On&top_detail_search_bookmark=1&cookie=true&tenpo_code=`



	console.log(URL)   //////////

	let items = [];
	return fetch(URL).then(response => response.text()).then(data => {
		const htmlParaser = data;
		const $ = cheerio.load(htmlParaser)
		//繰り返し
		$('.item', htmlParaser).each(function () {
			let title, href, price = 'no price set', imageUrl;
			title = $(this).find('p.title').text();
			href = $(this).find('a').attr('href');
			$(this).find('.price_teika').each(function () {
				let replacedText = $(this).text().replace(/\t|\r|\n|\s/g, "");
				replacedText.includes("新品") ?? replacedText.includes("予約") ? price = Number(replacedText.replace(/\D/g, "")) : '';
			})
			// price = price.replace(/\t|\r|\n|\s/g, "");
			// price = price.replace(/¥|,|\n|\(税込\)|代引・銀行・コンビニ|\s|/g, text => { return text })
			console.log(price)   //////////
			// price = Number(price.replace('￥', "").replace(',', "").replace('税込', ""))
			items.push({ title, price, href, imageUrl })
		})

		let removeNoPrice = removeNoPriceItem(items)
		return { url: URL, data: sortByPrice(removeNoPrice) }
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


