import react, { useEffect } from 'react'

export const Tag = () => {
	useEffect(() => {
		const script = document.createElement('script');
		script.src = 
			"https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
		script.async = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		}
	}, []);
	return (
		<div>
			<button>MAKE</button>
		</div>
	);
}

			//"https://cdn.jsdelivr.net/npm/jsbarcode@3.11.4/dist/JsBarcode.all.min.js"
