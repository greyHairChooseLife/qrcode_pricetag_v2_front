import react, { useState, useEffect } from 'react'

type TagPageProps = {
	printList: string[];
}

export const TagPage = ({ printList }: TagPageProps) => {

	const newWindowObj = window as any;

	useEffect(()=>{


		let qr_url = `http://google.com`;
		printList.forEach((ele, idx) => {
			new newWindowObj.QRCode(document.getElementById(`qrcode_${idx}`), {
				text: qr_url,
				width: 60,
				height: 60,
				colorDark : "#000000",
				colorLight : "#ffffff",
				correctLevel : newWindowObj.QRCode.CorrectLevel.H
			});

			newWindowObj.JsBarcode(`#barcode_${idx}`, ele, {
				format: "CODE128",
				lineColor: "black",
				width: 2.5,
				height: 50,
				fontSize: 15,
				margin: 15,
				marginBottom: 2,
			});
		});
	}, [])

	const codeElements = printList.map((ele, idx) => {
		const qrcode = "qrcode_" + idx;
		const barcode = "barcode_" + idx;
		return (
			<div key={idx}>
				<div id={qrcode}></div>
				<svg id={barcode}></svg>
			</div>
		)
	});


	return (
		<div className="">
			{codeElements}
		</div>
	);
}
