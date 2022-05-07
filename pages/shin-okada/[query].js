import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import React from 'react'
import tryScraping from '../../lib/shin-okada';

export default function ShinOkadaUrl() {
	const [scrapeData, setscrapeData] = useState([]);
	const router = useRouter()
	const query = router.query.query
	useEffect(async () => {
		const data = tryScraping(query);
		console.log(data)

	}, []);

	return (
		<div>

			{query}


		</div>
	)
}
