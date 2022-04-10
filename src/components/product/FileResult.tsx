import React from 'react'

	//********************************************************************
	//		types def for ...
	//********************************************************************
interface IError {
	category: 'barcodeUndefined' | 'barcodeWrong' | 'nameUndefined' | 'purchased_costUndefined' | 'purchased_costWrong',
	lineNumber: number,
}

interface IErrorProps {
	error: IError[] | null,
}

export const SpreadError = ({ error }: IErrorProps) => {
	if(error !== null){
		const barcodeError: any[] = [];
		const purchased_costError: any[] = [];
		const nameError: any[] = [];
		error.forEach(ele => {
			if(ele.category === 'barcodeUndefined' || ele.category === 'barcodeWrong') barcodeError.push(ele.lineNumber);
			if(ele.category === 'purchased_costUndefined' || ele.category === 'purchased_costWrong') purchased_costError.push(ele.lineNumber);
			if(ele.category === 'nameUndefined') nameError.push(ele.lineNumber);
		});
		return (
			<div>
				<div>this is errors</div>
				<div>
					<div>바코드를 확인하세요.</div>
					<div>라인번호 : {barcodeError.map((ele, idx, arr) => {
						if(idx === arr.length-1){
							return (
								<span>{ele}</span>
							)
						}else{
							return (
								<span>{ele}, </span>
							)
						}
					})}</div>
				</div>
				<div>
					<div>상품명을 확인하세요</div>
					<div>라인번호 : {nameError.map((ele, idx, arr) => {
						if(idx === arr.length-1){
							return (
								<span>{ele}</span>
							)
						}else{
							return (
								<span>{ele}, </span>
							)
						}
					})}</div>
				</div>
				<div>
					<div>구매가를 확인하세요</div>
					<div>라인번호 : {purchased_costError.map((ele, idx, arr) => {
						if(idx === arr.length-1){
							return (
								<span>{ele}</span>
							)
						}else{
							return (
								<span>{ele}, </span>
							)
						}
					})}</div>
				</div>
			</div>
		)
	}
	return (
		<div>error is null</div>
	)
}

	//********************************************************************
	//		types def for ...
	//********************************************************************
interface IFileColumns {
	name: string,
	size: string,
	purchased_cost: number,
	barcode: string,
	lineNumber: number,
}

interface IAddProps {
	add: IFileColumns[] | null,
}

export const SpreadAdd = ({ add }: IAddProps) => {
	if(add !== null){
		return (
			<div>
				<div>추가 항목 : {add.length}개</div>
				<div>
					<table>
						<thead>
							<tr>
								<th>lineNumber</th>
								<th>name</th>
								<th>size</th>
								<th>purchased_cost</th>
								<th>barcode</th>
							</tr>
						</thead>
						<tbody>
							{add.map(ele => {
								return (
									<tr key={ele.lineNumber}>
										<td>{ele.lineNumber}</td>
										<td>{ele.name}</td>
										<td>{ele.size}</td>
										<td>{ele.purchased_cost}</td>
										<td>{ele.barcode}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		)
	}
	return (
		<div></div>
	)
}

	//********************************************************************
	//		types def for ...
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
	lineNumber?: string,
}

interface IUpdate {
	update: {
		ele: IFileColumns,
		origin: IProductInfo, 
		diff: string[],
	}[],
	add: IFileColumns[] | null,
}

interface IUpdateProps {
	update: IUpdate | null,
}

export const SpreadUpdate = ({ update }: IUpdateProps) => {
	let addPart = null;
	let updatePart = null;

	if(update !== null){
		if(update.add !== null){			//addPart def
			addPart = 
			<div>
				<div>추가 항목 : {update.add.length}개</div>
				<div>
					<table>
						<thead>
							<tr>
								<th>lineNumber</th>
								<th>name</th>
								<th>size</th>
								<th>purchased_cost</th>
								<th>barcode</th>
							</tr>
						</thead>
						<tbody>
							{update.add.map(ele => {
								return (
									<tr key={ele.lineNumber}>
										<td>{ele.lineNumber}</td>
										<td>{ele.name}</td>
										<td>{ele.size}</td>
										<td>{ele.purchased_cost}</td>
										<td>{ele.barcode}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		}
		if(update.update !== null){		//updatePart def
			updatePart = 
			<div>
				<div>수정 항목 : {update.update.length}개</div>
				<div>
					<table>
						<thead>
							<tr>
								<th>lineNumber</th>
								<th>name</th>
								<th>size</th>
								<th>purchased_cost</th>
								<th>barcode</th>
								<th>구매가 변경</th>
								<th>이름 변경</th>
								<th>규격 변경</th>
							</tr>
						</thead>
						<tbody>
							{update.update.map((ele, idx) => {
								return (
									<tr key={idx}>
										<td>{ele.ele.lineNumber}</td>
										<td>{ele.ele.name}</td>
										<td>{ele.ele.size}</td>
										<td>{ele.ele.purchased_cost}</td>
										<td>{ele.ele.barcode}</td>
										<td>{ele.origin.purchased_cost === ele.ele.purchased_cost ? '' : `${ele.origin.purchased_cost} >> ${ele.ele.purchased_cost}`}</td>
										<td>{ele.origin.name === ele.ele.name ? '' : `${ele.origin.name} >> ${ele.ele.name}`}</td>
										<td>{ele.origin.size === ele.ele.size ? '' : `${ele.origin.size} >> ${ele.ele.size}`}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		}

		return (
			<div>
				{addPart}
				{updatePart}
			</div>
		)
	}
	return (
		<div></div>
	)
}
