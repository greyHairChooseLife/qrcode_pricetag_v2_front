import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:3002',
})

interface ISupplierInfo {
	id: number,
	name: string,
	address: string,
	contact: string,
	note?: string,
	margin_ratio?: string,
}

export const AboutProduct = () => {
	const [suppliers, setSuppliers] = useState<ISupplierInfo[] | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchSuppliers = async () => {
			try {
				setError(null);
				setSuppliers(null);
				setLoading(true);
				const response = await api.get('/supplier/get');
				setSuppliers(response.data);
			} catch (error: any) {
				setError(error);
			}
			setLoading(false);
		};

		fetchSuppliers();
	}, []);

	if (loading) return <div>로딩중..</div>;
	if (error) return <div>에러가 발생했습니다</div>;
	if (!suppliers) return null;
	console.log(suppliers);

	return (
		<div>
			<h1>
				READ COMPONENT !!
			</h1>
			<table className="suppliersListTable">
				<thead>
					<tr>
						<th>name</th>
						<th>address</th>
						<th>contact</th>
						<th>note?</th>
						<th>margin_ratio?</th>
					</tr>
				</thead>
				<tbody>
					{suppliers.map(ele => (
						<tr>
							<td>{ele.name}</td>
							<td>{ele.address}</td>
							<td>{ele.contact}</td>
							<td>{ele.note}</td>
							<td>{ele.margin_ratio}</td>
						</tr>
					)
					)}
				</tbody>
			</table>
		</div>
	);
}



