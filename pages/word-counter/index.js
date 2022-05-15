import React from 'react'
import { useState, useEffect, useContext, } from 'react'
import { Button, Form } from 'react-bootstrap';

export default function Index() {
	const [text, settext] = useState('');
	const [textCount, settextCount] = useState(0);
	const [withoutSpace, setwithoutSpace] = useState(0);



	const handleOnChange = (e) => {
		settext(e.target.value)
		const count = e.target.value.length;
		const str = 'gajsgs kljgls a    lkjgsa'
		settextCount(count)
		setwithoutSpace(text.replace(/\s+/g, "").length,)
	}

	// console.log(text)   //////////

	const onBtnClick = () => {
		// 1. Blobオブジェクトを作成する
		const blob = new Blob([text], { type: "text/plain" });

		// 2. HTMLのa要素を生成
		const link = document.createElement('a');

		// 3. BlobオブジェクトをURLに変換
		link.href = URL.createObjectURL(blob);
		// 4. ファイル名を指定する
		link.download = 'sample.txt';
		// 5. a要素をクリックする処理を行う
		link.click();
	}



	return (
		<>
			<div className='p-4 m-4'>
				<h1 className='font-bold text-4xl'>ワードカウンター</h1>
				<p>単語数: {textCount} 語</p>
				<p>単語数（スペース/改行を除く）: {withoutSpace} 語</p>
				<Form>
					<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
						<Form.Label>メモを入力してください</Form.Label>
						<Form.Control as="textarea" rows={20} value={text.text} onChange={handleOnChange} />
					</Form.Group>
				</Form>

				<Button className='btn bg-blue-400' onClick={onBtnClick}>テキスト出力</Button>
			</div>
		</>
	)
}
