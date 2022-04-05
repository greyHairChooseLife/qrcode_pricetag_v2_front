import React, { useState, useEffect } from 'react';
import './App.css';
import { AboutSupplier } from './components/supplier/AboutSupplier';
import { AboutProduct } from './components/product/AboutProduct';

interface IMode {
	about: string,
	productId: number,
}

function App() {

	const initialMode = {
		about: 'Supplier',
		productId: 1,
	}

	const [ mode, setMode ] = useState<IMode>(initialMode);
//	useEffect(() => {
//	}, [state])
	
	let article = null;
	switch (mode.about){
		case 'Supplier':
			article = 
				<AboutSupplier setMode={setMode}/>
			break;
		case 'Product':
			article = 
				<AboutProduct />
			break;
		default :
			console.log(mode);
	}

	return (
		<div className="App">

			<div>
				mode : {mode.about}
			</div>
			<br></br>
			{ article }

		</div>
	);
}

export default App;
