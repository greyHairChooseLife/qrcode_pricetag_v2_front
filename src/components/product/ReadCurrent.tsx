import React from 'react'

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

type currentPropsType = {
	product: IProductInfo[] | null,
}

export const ReadCurrent = ({ product }: currentPropsType) => {
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
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>size</th>
							<th>purchased_cost</th>
							<th>barcode</th>
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
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
}
