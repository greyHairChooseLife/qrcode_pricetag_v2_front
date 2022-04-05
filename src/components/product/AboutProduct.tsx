import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:3002',
})

	//********************************************************************
	//		Type Def	
	//********************************************************************
interface IRootMode {
	about: string,
	productId: number,
}

type Props = {
	rootMode: IRootMode,
	setRootMode: Dispatch<SetStateAction<IRootMode>>,
}

interface ISupplierInfo {
	id: number,
	name: string,
	address: string,
	contact: string,
	note?: string,
	margin_ratio?: string | number,
}

interface IProductInfo {
	id: number,
	product_code: string,
	name: string,
	size: string,
	registered_date: Date,
	purchased_cost: number,
	supplier_id: number,
	barcode: string,
}

export const AboutProduct = ({ rootMode, setRootMode }: Props) => {
	//********************************************************************
	//		generate useState
	//********************************************************************
	const [reRender, setReRender] = useState([]);					//just for rerendering
	const [supplier, setSupplier] = useState<ISupplierInfo[] | null>(null);
	const [product, setProduct] = useState<IProductInfo[] | null>(null);
	
	
	//********************************************************************
	//		get init supplier && re-render as suppliers updated
	//********************************************************************
	useEffect(() => {
		const fetchSuppliers = async () => {
			try{
				const response = await api.get('/supplier/get');
				setSupplier(response.data);
			} catch (err: any){
				throw err;
			}
		};

		const fetchProduct = async () => {
			try{
				const response = await api.get(`/product/get/${rootMode.productId}`);
					setProduct(response.data);
			} catch (err: any){
				throw err;
			}
		};

		fetchSuppliers();
		fetchProduct();
	}, []);

	useEffect(() => {
	}, []);
	
	console.log(product);


	return (
		<div>hi, I am about Product component. I am pointing {rootMode.productId}</div>
	);
}



