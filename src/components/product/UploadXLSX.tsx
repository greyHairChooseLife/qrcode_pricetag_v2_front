import React, { useEffect, useState, ChangeEvent, Dispatch, SetStateAction } from 'react'
import * as xlsx from 'xlsx'

	//********************************************************************
	//		Type Def	
	//********************************************************************
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

interface IParseXLSX {
	resultClass: 'updating' | 'adding' | 'error',
	result: IFileColumns[] | IError[],
}

interface Imode {
	parseResult: 'current' | 'updating' | 'error',
}

interface IFileColumns {
	name: number,
	size: string,
	purchased_cost: number,
	barcode: string,
	lineNumber: number,
}

type uploadXLSXProps = {
	product: IProductInfo[] | null,
	onParseXLSX: (form: IParseXLSX)=> void,
	setMode: Dispatch<SetStateAction<Imode>>,
}

export const UploadXLSX = ( { product, onParseXLSX }: uploadXLSXProps ) => {
	//const [originFileData, setOriginFileData] = useState<IFileColumns[] | null>(null);
	const [fileError, setFileError] = useState<any[] | null>(null);
	const [readFileData, setReadFileData] = useState<IFileColumns[] | null>(null);
	const [comparable, setComparable] = useState<boolean>(false);

	//********************************************************************
	//		parse it as reading File
	//********************************************************************
	useEffect(() => {						// check and setFileError
		checkValidation(readFileData);		
	}, [readFileData]);

	useEffect(() => {						// if fileError exist then it stops comparing && exec final function onParseXLSX() to feed back for user
		if(fileError !== null){
			if(fileError.length > 0){
				console.log('file has err');
				setComparable(false);
				onParseXLSX({
					resultClass: 'error',
					result: fileError
				});
			}
			else
				setComparable(true);
		}
	}, [fileError]);

	useEffect(() => {						// exec conditions : no error, 
		if(comparable === true && readFileData !== null){
			const prev = product;
			const cur = readFileData;
			compare(prev, cur);				
		}
	}, [comparable]);

	const compare = (prev: IProductInfo[] | null, cur: IFileColumns[]) => {
		const sortByBarcode = (a: IProductInfo | IFileColumns, b: IProductInfo | IFileColumns): number => {
			return Number(a.barcode) - Number(b.barcode);
		}
		if(prev === null || prev.length === 0){
			console.log('prev is empty, add everything');
			onParseXLSX({
				resultClass: 'adding',
				result: cur
			});
		}else if(cur !== null){
			prev.sort(sortByBarcode);
			cur.sort(sortByBarcode);
			console.log('p: ', prev);
			console.log('c: ', cur);
		}
		
	}

	const checkValidation = (fileReadData: IFileColumns[] | null) => {
		if(fileReadData !== null){
			const allError = fileReadData.reduce((prev:any, cur:any):any => {
				if(cur.barcode === undefined){
					prev.push({
						category: 'barcodeUndefined',
						lineNumber: cur.lineNumber,
					});
				}else if(cur.barcode < 0){
					prev.push({
						category: 'barcodeWrong',
						lineNumber: cur.lineNumber,
					});
				}
				if(cur.name === undefined){
					prev.push({
						category: 'nameUndefined',
						lineNumber: cur.lineNumber,
					});
				}
				if(cur.purchased_cost === undefined){
					prev.push({
						category: 'purchased_costUndefined',
						lineNumber: cur.lineNumber,
					});
				}else if(cur.purchased_cost < 0 || !Number.isInteger(cur.purchased_cost)){
					prev.push({
						category: 'purchased_costWrong',
						lineNumber: cur.lineNumber,
					});
				}
				return prev;
			}, [])
			setFileError(allError);
		}	
	}

	const readFile = async (e: ChangeEvent<HTMLInputElement>) => {
		if(e.target.files !== null){
			const file = e.target.files[0];
			const data = await file.arrayBuffer();
			const workbook = xlsx.read(data);
			const first_sheet_name = workbook.SheetNames[0];
			const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[first_sheet_name]);
			const refined = jsonData.map((ele:any)=>{
				return {
					name: ele['상품명'],
					size: ele['규격'],
					purchased_cost: ele['매입가'],
					barcode: ele['바코드'],
					lineNumber: ele['__rowNum__'],
				};
			})
			setReadFileData([...refined]);
		}
	}

	return (
		<div>
			<input type="file" onChange={readFile}></input>
		</div>
	)
}



//onChange={(e:any) => {
//				e.preventDefault();
//				//const fileName = e.target.value.split("\\");
//				//<div>선택 된 파일 : <span></span></div>
//				//e.currentTarget.parentElement.querySelector('span').innerText = fileName.pop();
//				await handleInput(e);
//				const read = async (e:any) => {
//					await readFile(e);
//				};
//				read(e);
//				console.log('ho!: ', readFileData);
//			}}
