import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { ReadCurrent } from './ReadCurrent';
import { UploadXLSX } from './UploadXLSX';
import { SpreadAdd, SpreadUpdate, SpreadError, ApplyBtn } from './FileResult';
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
	parseResult: 'current' | 'addOnly' | 'updating' | 'error',
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

type articleType = 'current' | 'addOnly' | 'updating' | 'error';

export const AboutProduct = ({ rootMode, setRootMode }: Props) => {
	//********************************************************************
	//		generate useState
	//********************************************************************
	const [supplier, setSupplier] = useState<ISupplierInfo | null>(null);
	const [product, setProduct] = useState<IProductInfo[] | null>(null);

	////const [article, setArticle] = useState<any | null>(null);
//	const [article, setArticle] = useState<articleType>('current');
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
	}, [mode]);

	//********************************************************************
	//		axios function to post, put XLSX content
	//********************************************************************
	const postXLSX = (): void => {
		const form: any[] = [];
		if(adding !== null){
			adding.forEach((ele: any) => {
				ele = {...ele, supplier_id: rootMode.productId};
				form.push(ele);
			})
			api.post('/product/post', form);
		}
		setMode({
			parseResult: 'current',
		})
	}

	const putXLSX = (): void => {
		let form: any[] = [];
		let form2: any[] = [];
		if(updating !== null){
			if(updating.add !== null){
				updating.add.forEach((ele: any) => {
					ele = {...ele, supplier_id: rootMode.productId};
					form.push(ele);
				})
				api.post('/product/post', form);
			}
			if(updating.update !== null){
				updating.update.forEach((ele: any) => {
					form2.push(ele.ele);
				})
				api.put('/product/put', form2);
			}
		}
		setMode({
			parseResult: 'current',
		})
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
				setMode({parseResult: 'addOnly'});
				break;
			case 'error':
				setError(form.result);
				setMode({parseResult: 'error'});
				break;
			default:
				break;
			}
	}

	//********************************************************************
	//		subComponent
	//********************************************************************
	const subComponent = {
		current: 
			<ReadCurrent product={product}></ReadCurrent>,
		addOnly: 
			<div>
				<SpreadAdd add={adding}></SpreadAdd>
				<ApplyBtn func={postXLSX}></ApplyBtn>
			</div>,
		updating: 
			<div>
				<SpreadUpdate update={updating}></SpreadUpdate>
				<ApplyBtn func={putXLSX}></ApplyBtn>
			</div>,
		error: 
			<SpreadError error={error}></SpreadError>
	}

	return (
		<div>
			<UploadXLSX product={product} onParseXLSX={onParseXLSX} ></UploadXLSX>
			<div>supplier ID : {rootMode.productId}</div>
			{subComponent[mode.parseResult]}
		</div>
	);
}



