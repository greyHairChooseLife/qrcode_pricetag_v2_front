import React, { useState, useEffect } from 'react';
import './App.css';
import { AboutSupplier } from './components/supplier/AboutSupplier';
import { AboutProduct } from './components/product/AboutProduct';

type AppModeType = 'aboutSupplier' | 'aboutProduct';

function App() {
	const initialMode: AppModeType = 'aboutSupplier';

	const [ mode, setMode ] = useState<AppModeType>(initialMode);
//	useEffect(() => {
//	}, [state])
	
	let article = null;
	switch (mode){
		case 'aboutSupplier':
			article = 
				<AboutSupplier setMode={setMode}/>
			break;
		case 'aboutProduct':
			article = 
				<AboutProduct />
			break;
		default :
			console.log(mode);
	}

	return (
		<div className="App">

			<div>
				mode : {mode}
			</div>
			<br></br>
			{ article }

		</div>
	);
}

export default App;
