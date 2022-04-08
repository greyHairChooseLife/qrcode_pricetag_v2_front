import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { ReadCurrent } from './ReadCurrent';
import { UploadXLSX } from './UploadXLSX';
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

interface Imode {
	parseResult: 'current' | 'updating' | 'error',
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

interface IError {
	id: string,
}

interface IFileColumns {
	name: number,
	size: string,
	purchased_cost: number,
	barcode: string,
	lineNumber: number,
}

interface IParseXLSX {
	resultClass: 'updating' | 'adding' | 'error',
	result: IFileColumns[] | IError[],
}

export const AboutProduct = ({ rootMode, setRootMode }: Props) => {
	//********************************************************************
	//		generate useState
	//********************************************************************
	const [supplier, setSupplier] = useState<ISupplierInfo[] | null>(null);
	const [product, setProduct] = useState<IProductInfo[] | null>(null);

	const [mode, setMode] = useState<Imode>({
		parseResult: 'current',
	});

	const [current, setCurrent] = useState<IProductInfo[] | null>(null);
	const [updating, setUpdating] = useState<IProductInfo[] | null>(null);
	const [adding, setAdding] = useState<IProductInfo[] | null>(null);
	const [error, setError] = useState<IError[] | null>(null);
	
	//********************************************************************
	//		get init supplier, products
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


	let article, uploadXLSX = null;
	//********************************************************************
	//		read current
	//********************************************************************
	if(mode.parseResult === 'current'){
		article = <ReadCurrent product={product}></ReadCurrent>
	}

	//********************************************************************
	//		upload XLSX 
	//********************************************************************
		const onParseXLSX = (form: IParseXLSX):void => {
		switch (form.resultClass) {
			case 'updating':
				//form.result can't be typed IError[] in this case. Why error? Maybe comeback after telling the condition at <UploadXLSX />
				//setUpdating({...form.result})
				break;
			case 'adding':
				//setAdding({...form.result})
				console.log('adding: ', form.result);
				break;
			case 'error':
				//setError({...form.result})
				console.log('err: ', form.result);
				break;
			default:
				break;
		}
	}
	uploadXLSX = <UploadXLSX product={product} onParseXLSX={onParseXLSX} setMode={setMode}></UploadXLSX>
	//Update Component to upload xlsx file and parse it and update states like 'add, update, err ...'

	return (
		<div>
			{uploadXLSX}
			<div>hi, I am about Product component. I am pointing {rootMode.productId}</div>
			{article}
		</div>
	);
}



