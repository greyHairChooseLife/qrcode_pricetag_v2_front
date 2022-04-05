import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { CreateSupplierForm, CreateSupplierButton } from './CreateSupplierForm';
import { ReadSuppliers } from './ReadSuppliers';
import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:3002',
})

	//********************************************************************
	//		Type Def	
	//********************************************************************
interface ISupplierInfo {
	id: number,
	name: string,
	address: string,
	contact: string,
	note?: string,
	margin_ratio?: string | number,
}

interface IUpdateForm {
	active: boolean,
	target: number,
}

type AppModeType = 'aboutSupplier' | 'aboutProduct';

type Props = {
	setMode: Dispatch<SetStateAction<AppModeType>>,
}

type createFormType = { name: string, address: string, contact: string, note: string, margin_ratio: string | number }

export const AboutSupplier = ({ setMode }: Props) => {
	//********************************************************************
	//		generate useState
	//********************************************************************
	const [suppliers, setSuppliers] = useState<ISupplierInfo[] | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);
	const [reRender, setReRender] = useState([]);					//just for rerendering

	const [isCreate, setIsCreate] = useState<boolean>(false);
	const [isUpdate, setIsUpdate] = useState<IUpdateForm>({active: false, target: 0});

	//********************************************************************
	//		get init supplier && re-render as suppliers updated
	//********************************************************************
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
	}, [reRender]);

	//********************************************************************
	//		Create supplier
	//********************************************************************
	const onCreateSubmit = (form: createFormType) => {
		form.margin_ratio = Number(form.margin_ratio);
		api.post('/supplier/post', {
			...form,
		});
		setReRender([...reRender]);
		setIsCreate(!isCreate);
	}

	const onCreate = 
				<CreateSupplierForm  isCreate={isCreate} setIsCreate={setIsCreate} onCreateSubmit={onCreateSubmit}></CreateSupplierForm>;
	const offCreate = 
				<CreateSupplierButton isCreate={isCreate} setIsCreate={setIsCreate} ></CreateSupplierButton>;

	//********************************************************************
	//		Read, Update, Delete suppliers
	//********************************************************************
	const onUpdateSubmit = (form: { id: number, name: string, address: string, contact: string, note?: string, margin_ratio?: string | number }) => {
		form.margin_ratio = Number(form.margin_ratio);
		api.put('/supplier/put', {
			...form,
		});
		setReRender([...reRender]);
	}

	const onDeleteSubmit = (form: { id: number }) => {
		api.delete('/supplier/delete', {
			data: {...form}
		});
		setReRender([...reRender]);
	}

	const read = <ReadSuppliers suppliers={suppliers} isUpdate={isUpdate} setIsUpdate={setIsUpdate} onUpdateSubmit={onUpdateSubmit} onDeleteSubmit={onDeleteSubmit}/>;

	//********************************************************************
	//		render conditionally
	//********************************************************************
	if (loading) return <div>로딩중..</div>;
	if (error) return <div>에러가 발생했습니다.</div>;
	if (!suppliers) return null;

	return (
		<div>
			{read}
			{isCreate ? onCreate : offCreate}
		</div>
	);
}
