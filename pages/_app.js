import Head from 'next/head'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
	return <>

		<Head>
			<link
				href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
				rel="stylesheet"
				integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
				crossOrigin="anonymous">
			</link>
		</Head>
		<Component {...pageProps} />
	</>



}

export default MyApp
