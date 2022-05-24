import React, { useRef } from 'react'
import { Fireworks } from 'fireworks-js/dist/react'
import { useState, useEffect, useContext, } from 'react'
import { Button, Card, Carousel, Image } from 'react-bootstrap'
import styles from './index.module.css'

export default function Yoneko() {

	const [index, setIndex] = useState(0);
	const [fireWorks, setfireWorks] = useState(false);
	const audioRef = useRef()

	useEffect(() => {
		fire()
	}, []);


	function fire() {
		setfireWorks(true)
		setTimeout(() => {
			setfireWorks(false)
		}, 3000);

	}

	const handleSelect = (selectedIndex, e) => {
		setIndex(selectedIndex);
		console.log(index)   //////////
	};


	const options = {
		speed: 3,
		rocketsPoint: 100,
		particles: 100,
		mouse: { move: true, click: true }
	}

	const style = {
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		position: 'fixed',
		background: 'rgb(55 65 81)',

	}


	return (

		<div className='bg-gray-700 font-mono'>
			<Fireworks options={options} style={style} className={styles.disappear} />
			{!fireWorks && <div className={`text-center bg-gray-700 text-white min-h-screen p-4 ${styles.smooth} `}>
				<h1 className='text-yellow-200 font-bold'>2500日おめでとう！！！</h1>
				<audio src='/yoneko-images/ok.m4a' ref={audioRef} />

				<Carousel activeIndex={index} onSelect={handleSelect}>
					<Carousel.Item>
						<div className='p-10 '>
							<Card bsPrefix='bg-red-200 text-gray-700  shadow rounded-lg'>
								<Image src={'/yoneko-images/shopping.jpeg'} alt='' width={320} height={240} />
								< Card.Body >
									<Card.Title><span className='font-bold '>お洋服プレゼント</span></Card.Title>
									<Card.Text>
										<span className='text-sm'>納得のいくまでお洋服の買い物に付き合います！気にいるものがあれば一個買っちゃうよ〜！</span>
									</Card.Text>
									<Button className='btn btn-sm bg-secondary text-white' onClick={() => { audioRef.current.play() }}>USE</Button>
								</ Card.Body>
							</Card >
						</div >
					</Carousel.Item >
					<Carousel.Item>
						<div className='p-10 '>
							<Card bsPrefix='bg-green-200 text-gray-700  shadow rounded-lg'>
								<Image src={'/yoneko-images/cafe.jpeg'} alt='' width={320} height={240} />
								< Card.Body >
									<Card.Title><span className='font-bold '>カフェ＆スイーツ</span></Card.Title>
									<Card.Text>
										<span className='text-sm'>好きなカフェまで連れていくよ〜！デザートもね！</span>
									</Card.Text>
									<Button className='btn btn-sm bg-secondary text-white' onClick={() => { audioRef.current.play() }}>USE</Button>
								</ Card.Body>
							</Card >
						</div >
					</Carousel.Item >
					<Carousel.Item>
						<div className='p-10 '>
							<Card bsPrefix='bg-orange-200 text-gray-700  shadow rounded-lg'>
								<Image src={'/yoneko-images/speak-ill.jpeg'} alt='' width={320} height={240} />
								< Card.Body >
									<Card.Title><span className='font-bold '>愚痴聞きまくり</span></Card.Title>
									<Card.Text>
										<span className='text-sm'>最近上手になってきたと思ってる。</span>
									</Card.Text>
									<Button className='btn btn-sm bg-secondary text-white' onClick={() => { audioRef.current.play() }}>USE</Button>
								</ Card.Body>
							</Card >
						</div >
					</Carousel.Item >
					<Carousel.Item>
						<div className='p-10 '>
							<Card bsPrefix='bg-gray-200 text-gray-700  shadow rounded-lg'>
								<Image src={'/yoneko-images/taxi.jpeg'} alt='' width={320} height={240} />
								< Card.Body >
									<Card.Title><span className='font-bold '>職場送迎</span></Card.Title>
									<Card.Text>
										<span className='text-sm'>事前の予約が必要です。</span>
									</Card.Text>
									<Button className='btn btn-sm bg-secondary text-white' onClick={() => { audioRef.current.play() }}>USE</Button>
								</ Card.Body>
							</Card >
						</div >
					</Carousel.Item >
					<Carousel.Item>
						<div className='p-10 '>
							<Card bsPrefix='bg-yellow-200 text-gray-700  shadow rounded-lg'>
								<Image src={'/yoneko-images/keep-out.jpeg'} alt='' width={320} height={240} />
								< Card.Body >
									<Card.Title><span className='font-bold '>プジジ強制停止信号</span></Card.Title>
									<Card.Text>
										<span className='text-sm'>使うタイミングは、見極めて・・・</span>
									</Card.Text>
									<Button className='btn btn-sm bg-secondary text-white' onClick={() => { audioRef.current.play() }}>USE</Button>
								</ Card.Body>
							</Card >
						</div >
					</Carousel.Item >
				</Carousel>








			</div >}
		</div>
	)

}
