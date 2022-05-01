import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { ReadCurrent } from './ReadCurrent';
import { UploadXLSX } from './UploadXLSX';
import { SpreadAdd, SpreadUpdate, SpreadError, ApplyBtn } from './FileResult';
import { TagPage } from './TagMaker';
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
	parseResult: 'current' | 'addOnly' | 'updating' | 'error' | 'printTag',
	printList: [string, string][],
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

	const [mode, setMode] = useState<Imode>({
		parseResult: 'current',
		printList: []
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
				const response = await api.get('/supplier');
				setSupplier(response.data);
			} catch (err: any){
				throw err;
			}
		};

		const fetchProduct = async () => {
			try{
				const response = await api.get(`/product/${rootMode.productId}`);
					setProduct(response.data);
			} catch (err: any){
				throw err;
			}
		};

		fetchSuppliers();
		fetchProduct();
	}, [mode]);

	//********************************************************************
	//		axios function to post, put XLSX content && delete all prev
	//********************************************************************
	const postXLSX = (): void => {
		const form: any[] = [];
		if(adding !== null){
			adding.forEach((ele: any) => {
				ele = {...ele, supplier_id: rootMode.productId};
				form.push(ele);
			})
			api.post('/product', form);
		}
		setMode({...mode,
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
				api.post('/product', form);
			}
			if(updating.update !== null){
				updating.update.forEach((ele: any) => {
					form2.push(ele.ele);
				})
				api.put('/product', form2);
			}
		}
		setMode({
			...mode,
			parseResult: 'current',
		})
	}

	const deleteProduct = (): void => {
		if(window.confirm('정말로 모든 상품 정보를 삭제하시겠습니까?')){
			const form = {supplierId: rootMode.productId};
			api.delete('/product', {
				data: form,
			});
			setMode({
				...mode,
			})
		}else{
			console.log('u chosen No for no');
		}
	}
	
	//********************************************************************
	//		upload XLSX function
	//********************************************************************
	const onParseXLSX = (form: parseXLSXType ):void => {
		switch (form.resultClass) {
			case 'update':
				//setUpdating({...form.result}) console.log('update: ', form.result); break;
				setUpdating(form.result);
				setMode({...mode, parseResult: 'updating'});
				break;
			case 'addOnly':
				setAdding(form.result);
				setMode({...mode, parseResult: 'addOnly'});
				break;
			case 'error':
				setError(form.result);
				setMode({...mode, parseResult: 'error'});
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
			<ReadCurrent product={product} setMode={setMode}></ReadCurrent>,
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
			<SpreadError error={error}></SpreadError>,
		printTag:
			<TagPage printList={mode.printList}></TagPage>
	}

	return (
		<div>
			{mode.parseResult !== 'printTag' && <UploadXLSX product={product} onParseXLSX={onParseXLSX} ></UploadXLSX>}
			<div>supplier ID : {rootMode.productId}</div>
			{mode.parseResult !== 'printTag' && <div><button onClick={()=>{ deleteProduct() }}>delete product</button></div>}
			{subComponent[mode.parseResult]}
		</div>
	);
}
