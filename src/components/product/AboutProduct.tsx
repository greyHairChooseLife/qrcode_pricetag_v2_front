import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { ReadCurrent } from './ReadCurrent';
import { UploadXLSX } from './UploadXLSX';
import { SpreadUpdate, SpreadAdd, SpreadError } from './FileResult';
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
	category: 'barcodeUndefined' | 'barcodeWrong' | 'nameUndefined' | 'purchased_costUndefined' | 'purchased_costWrong',
	lineNumber: number,
}

interface IFileColumns {
	name: string,
	size: string,
	purchased_cost: number,
	barcode: string,
	lineNumber: number,
}

interface IUpdate {
	update: {
		ele: IFileColumns,
		origin: IProductInfo,
		diff: string[],
	}[],
	add: IFileColumns[] | null,
}

interface IParseXLSXUpdate {
	resultClass: 'update',
	result: IUpdate,
}
interface IParseXLSXAddOnly {
	resultClass: 'addOnly',
	result: IFileColumns[],
}
interface IParseXLSXError {
	resultClass: 'error',
	result: IError[],
}

type parseXLSXType = IParseXLSXUpdate | IParseXLSXAddOnly | IParseXLSXError;

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
	const [updating, setUpdating] = useState<IUpdate | null>(null);
	const [adding, setAdding] = useState<IFileColumns[] | null>(null);
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

	let article: any = null;
	let uploadXLSX = null;

	
	//********************************************************************
	//		assign to article by state: mode	
	//********************************************************************
	if(mode.parseResult === 'current'){
		article = <ReadCurrent product={product}></ReadCurrent>
	}
	else if(mode.parseResult === 'updating'){
		article = 
			<div>
				<SpreadAdd add={adding}></SpreadAdd>
				<SpreadUpdate update={updating}></SpreadUpdate>
			</div>
	}
	else if(mode.parseResult === 'error'){
		article = <SpreadError error={error}></SpreadError>
	}

	//********************************************************************
	//		upload XLSX function
	//********************************************************************
	const onParseXLSX = (form: parseXLSXType ):void => {
		switch (form.resultClass) {
			case 'update':
				//setUpdating({...form.result}) console.log('update: ', form.result); break;
				setUpdating(form.result);
				setMode({parseResult: 'updating'});
				break;
			case 'addOnly':
				setAdding(form.result);
				setMode({parseResult: 'updating'});
				break;
			case 'error':
				setError(form.result);
				setMode({parseResult: 'error'});
				break;
			default:
				break;
			}
	}

	uploadXLSX = <UploadXLSX product={product} onParseXLSX={onParseXLSX} ></UploadXLSX>
	//Update Component to upload xlsx file and parse it and update states like 'add, update, err ...'

	return (
		<div>
			{uploadXLSX}
			<div>hi, I am about Product component. I am pointing {rootMode.productId}</div>
			{article}
		</div>
	);
}



