import { useRouter } from 'next/router'
import React from 'react'
import { Button, Form } from 'react-bootstrap'

export default function Application() {
	const router = useRouter()
	const query = router.query
	const { name, email, tel, address, siteAId, siteAPw, siteBId, siteBPw,
	} = query
	return (
		<div className='p-4 m-4 '>
			<h1>応募フォーム</h1>
			<Form className='mb-20 p-10'>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>氏名</Form.Label>
					<Form.Control type="name" value={name} />
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>メールアドレス</Form.Label>
					<Form.Control type="email" value={email} />
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>電話番号</Form.Label>
					<Form.Control type="tel" value={tel} />
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>住所</Form.Label>
					<Form.Control type="address" value={address} />
				</Form.Group>


				<div>
					<h3>サイトA</h3>
					<div className='flex flex-wrap '>
						<Form.Group className="mb-3 p-2 items-center flex w-1/2" controlId="formBasicEmail">
							<Form.Label className='w-20 '>会員ID</Form.Label>
							<Form.Control type="address" value={siteAId} />
						</Form.Group>
						<Form.Group className="mb-3 p-2 items-center flex w-1/2" controlId="formBasicEmail">
							<Form.Label className='w-20 '>PW</Form.Label>
							<Form.Control type="address" value={siteAPw} />
						</Form.Group>
					</div>
				</div>
				<div>
					<h3>サイトB</h3>
					<div className='flex flex-wrap '>
						<Form.Group className="mb-3 p-2 items-center flex w-1/2" controlId="formBasicEmail">
							<Form.Label className='w-20 '>会員ID</Form.Label>
							<Form.Control type="address" value={siteBId} />
						</Form.Group>
						<Form.Group className="mb-3 p-2 items-center flex w-1/2" controlId="formBasicEmail">
							<Form.Label className='w-20 '>PW</Form.Label>
							<Form.Control type="address" value={siteBPw} />
						</Form.Group>
					</div>
				</div>



				<Button variant="primary" type="submit">
					送信
				</Button>
			</Form>




		</div>
	)
}
