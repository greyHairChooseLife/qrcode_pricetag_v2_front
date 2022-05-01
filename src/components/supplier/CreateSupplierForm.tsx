import React, { useState, Dispatch, SetStateAction } from 'react'

	//********************************************************************
	//		Type Def	
	//********************************************************************
type onCreateSubmitType = (form: { name: string, address: string, contact: string, note: string, margin_ratio: string }) => void;

type Props = {
	onCreateSubmit: onCreateSubmitType,
	isCreate: boolean,
	setIsCreate: Dispatch<SetStateAction<boolean>>,
}

type CheckValidation = {
	name: string, 
	address: string, 
	contact: string,
	note: string,
	margin_ratio: string
}

export const CreateSupplierForm = ({ onCreateSubmit, isCreate, setIsCreate }: Props) => {
	const [ form, setForm ] = useState({
		name: '',
		address: '', 
		contact: '',
		note: '',
		margin_ratio: ''
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm({
			...form,
			[name]: value,
		});
	};

	const checkValidation = (form: CheckValidation): boolean => {
		const { name, address, contact, margin_ratio } = form;
		if(name === ''){
			alert('거래처명을 써 주세요.');
			return false;
		}
		if(address === ''){
			alert('주소를 써 주세요.');
			return false;
		}
		if(contact === ''){
			alert('전화번호를 써 주세요.');
			return false;
		}
		if(Number(margin_ratio) >= 1){
			alert('마진률은 1 이하여야 합니다.');
			return false;
		}
		return true;
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if(checkValidation(form)){
			onCreateSubmit(form);
			setForm({
				name: '',
				address: '',
				contact: '',
				note: '',
				margin_ratio: ''
			})
		}
	};

	const onClick = (isCreate: boolean) => {
		setIsCreate(!isCreate);
	}

	return (
		<div className="createForm">
			<form onSubmit={handleSubmit} autoComplete="off">
				<input placeholder="이름" name="name" value={form.name} onChange={onChange} />
				<input placeholder="주소" name="address" value={form.address} onChange={onChange} />
				<input placeholder="전화번호" name="contact" value={form.contact} onChange={onChange} />
				<input placeholder="비고" name="note" value={form.note} onChange={onChange} />
				<input placeholder="마진률" name="margin_ratio" value={form.margin_ratio} onChange={onChange} />
				<button type="submit">확인</button>
				<button onClick={() => onClick(isCreate)}>취소</button>
			</form>
		</div>
	)
}

type createBtnType = {
	isCreate: boolean,
	setIsCreate: Dispatch<SetStateAction<boolean>>,
}
export const CreateSupplierButton = ({ isCreate, setIsCreate }: createBtnType) => {
	const onClick = (isCreate: boolean) => {
		setIsCreate(!isCreate);
	}
	return (
		<div className="createButton">
			<button onClick={() => onClick(isCreate)}>
				거래처 추가하기
			</button>
		</div>
	)
}
