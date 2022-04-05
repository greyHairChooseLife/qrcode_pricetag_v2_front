import React, { useState, useEffect } from 'react';
import './App.css';
import { AboutSupplier } from './components/supplier/AboutSupplier';
import { AboutProduct } from './components/product/AboutProduct';

interface IRootMode {
	about: string,
	productId: number,
}

function App() {

	const initialMode = {
		about: 'Supplier',
		productId: 1,
	}

	const [ rootMode, setRootMode ] = useState<IRootMode>(initialMode);
//	useEffect(() => {
//	}, [state])
	
	let article = null;
	switch (rootMode.about){
		case 'Supplier':
			article = 
				<AboutSupplier setRootMode={setRootMode}/>
			break;
		case 'Product':
			article = 
				<AboutProduct rootMode={rootMode} setRootMode={setRootMode}/>
			break;
		default :
			console.log(rootMode);
	}

	return (
		<div className="App">

			<div>
				mode : {rootMode.about}
			</div>
			<br></br>
			{ article }

		</div>
	);
}

export default App;
