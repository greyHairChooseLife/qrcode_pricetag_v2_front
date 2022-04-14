import React, { useState, Dispatch, SetStateAction }from 'react'

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

interface Imode {
	parseResult: 'current' | 'addOnly' | 'updating' | 'error' | 'printTag',
	printList: [string, string][],
}

type currentPropsType = {
	product: IProductInfo[] | null,
	setMode: Dispatch<SetStateAction<Imode>>,
}

export const ReadCurrent = ({ product, setMode }: currentPropsType) => {
	const [genTagChecked, setGenTagChecked] = useState<[string, string][]>([]);

	//if(product === null || []) return (<div>등록된 상품이 없습니다.</div>)
	if(product === null) return (<div>등록된 상품이 없습니다.</div>)
	else{
		product.sort((a, b): number => {	//제품명으로 비교하고, 같은 제품명일 경우 사이즈로 비교
			const shorterName = a.name.length >= b.name.length ? b.name.length : a.name.length;
			for(var i=0; i<shorterName; i++){
				if(a.name.charCodeAt(0) - b.name.charCodeAt(0) !== 0)
					return a.name.charCodeAt(0) - b.name.charCodeAt(0)
			}
			const shorterSize = a.size.length >= b.size.length ? b.size.length : a.size.length;
			for(var i=0; i<shorterSize; i++){
				if(a.size.charCodeAt(0) - b.size.charCodeAt(0) !== 0)
					return a.size.charCodeAt(0) - b.size.charCodeAt(0)
			}
			return 0;
		});

		return (
			<div>
				<form method="post" id="checked" onSubmit={(e)=>{
					e.preventDefault();
					setMode({
						parseResult: 'printTag',
						printList: genTagChecked,
					});
				}}>
					<button type="submit">MAKE</button>
				</form>
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>size</th>
							<th>purchased_cost</th>
							<th>barcode</th>
							<th>PRINT</th>
						</tr>
					</thead>
					<tbody>
						{product.map((ele: IProductInfo, idx: number) => {
							return (
								<tr key={ele.id}>
									<td>{ele.name}</td>
									<td>{ele.size}</td>
									<td>{ele.purchased_cost}</td>
									<td>{ele.barcode}</td>
									<td><input form="checked" type="checkbox" name="barcodes" value={ele.barcode} onClick={(e)=>{
										setGenTagChecked([...genTagChecked, [e.currentTarget.value, ele.name]])
									}}></input></td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
}
