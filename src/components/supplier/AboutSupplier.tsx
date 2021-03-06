import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { CreateSupplierForm, CreateSupplierButton } from './CreateSupplierForm';
import { ReadSuppliers } from './ReadSuppliers';
import './AboutSupplier.css';
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

interface IRootMode {
	about: string,
	productId: number,
}

type Props = {
	setRootMode: Dispatch<SetStateAction<IRootMode>>,
}

type createFormType = { name: string, address: string, contact: string, note: string, margin_ratio: string | number }

export const AboutSupplier = ({ setRootMode }: Props) => {
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
				const response = await api.get('/supplier');
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
		api.post('/supplier', {
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
		api.put('/supplier', {
			...form,
		});
		setReRender([...reRender]);
	}

	const onDeleteSubmit = (form: { id: number }) => {
		api.delete('/supplier', {
			data: {...form}
		});
		setReRender([...reRender]);
	}

	const read = <ReadSuppliers suppliers={suppliers} isUpdate={isUpdate} setIsUpdate={setIsUpdate} onUpdateSubmit={onUpdateSubmit} onDeleteSubmit={onDeleteSubmit} setRootMode={setRootMode} />;

	//********************************************************************
	//		render conditionally
	//********************************************************************
	if (loading) return <div>?????????..</div>;
	if (error) return <div>????????? ??????????????????.</div>;
	if (!suppliers) return null;

	return (
		<div className="supplierBoard">
			{read}
			{isCreate ? onCreate : offCreate}
		</div>
	);
}
