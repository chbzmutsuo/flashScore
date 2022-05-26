


export default async function Test(req, res) {


	const json = [
		{ id: 2, kaiinId: 2, kaishamei: "company-2" },
		{ id: 98, kaiinId: 98, kaishamei: "company-98" },
		{ id: 4, kaiinId: 4, kaishamei: "company-4" },
	]



	// ---------------------コントローラー処理------------------------
	const companies = json;

	//個別の会社のidだけを取得する例
	const singleCompany = companies[0]['id']


	//もしもパス（....edit/98）のIDが取得できると仮定した時、以下で、そのeditIdのデータを配列からピックアップする処理
	const editId = "98"



	//↓何をしているかというと、配列(companies)の中の1つずつのデータ(filterの後の引数 =company = { id: 2, kaiinId: 2, kaishamei: "company-2" }ごとにループして処理を行なっている。
	//何の処理かというと、処理の結果として、trueをreturnした場合のみ、配列singleCompanyByIdに格納される
	// これがfilter関数
	const singleCompanyById = companies.filter(company => {
		const id = company['id']
		const kaiinId = company['kaiinId'] //これは使わない
		const kaishamei = company['kaishamei']//これは使わない
		return id.toString() === editId.toString()
		// ↑jsonの中のidとパスのeditIdのデータ型を念の為文字列形に統一
	})


	console.log(singleCompanyById) //[ { id: 98, kaiinId: 98, kaishamei: 'company-98' }
	const targetCompany = singleCompanyById[0] // ← 値は一つだけだが、配列のなので、最初のを拾う必要がある

	const targetCompanyid = targetCompany['id']
	const targetCompanyKaiinId = targetCompany['kaiinId']
	const targetCompanyKaishamei = targetCompany['kaishamei']


	console.log(
		targetCompanyid, //98
		targetCompanyKaiinId, //98
		targetCompanyKaishamei, //company-98
	)

	return res.json({ result: 'test' })
}

