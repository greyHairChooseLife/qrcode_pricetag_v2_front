import React, { useState, Dispatch, SetStateAction } from 'react'

	//********************************************************************
	//		Type Def	
	//********************************************************************
interface ISupplierInfo{ id: number, name: string,
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
	suppliers: ISupplierInfo[] | null,
	isUpdate: IUpdateForm,
	setIsUpdate: Dispatch<SetStateAction<IUpdateForm>>,
	onUpdateSubmit: (form: ISupplierInfo) => void,
	onDeleteSubmit: (form: {id: number}) => void,
	setRootMode: Dispatch<SetStateAction<IRootMode>>,
}

type CheckValidation = ISupplierInfo;
type updateFormType = ISupplierInfo;

export const ReadSuppliers = ({ suppliers, isUpdate, setIsUpdate, onUpdateSubmit, onDeleteSubmit, setRootMode }: Props) => {

	const [ updateForm, setUpdateForm ] = useState<updateFormType>({
		id: 0,
		name: "", 
		address: "", 
		contact: "",
		note: "",
		margin_ratio: "",
	});

	//********************************************************************
	//		UPDATE
	//********************************************************************
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

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUpdateForm({
			...updateForm,
			[name]: value,
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if(checkValidation(updateForm)){
			onUpdateSubmit(updateForm);
			setUpdateForm({
				id: isUpdate.target,
				name: "", 
				address: "", 
				contact: "",
				note: "",
				margin_ratio: "",
			})
		}
		setIsUpdate({
			active: false,
			target: 0, 
		});
	};

	//********************************************************************
	//		SET ROOT MODE	
	//********************************************************************
	const handleSetMode = (id: number): void => {
		setRootMode({
			about: 'Product',
			productId: id,
		})
	}

	return (
		<div>
			<form id="updateForm" onSubmit={handleSubmit}></form>
			{suppliers !== null ? 
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
						{suppliers.map((ele: any, idx: number, arr: any) => {
							if(isUpdate.target === arr[idx].id){
								return(
									<tr key={ele.id}>
										<td><input form="updateForm" onChange={onChange} value={updateForm.name} name="name"></input></td>
										<td><input form="updateForm" onChange={onChange} value={updateForm.address} name="address"></input></td>
										<td><input form="updateForm" onChange={onChange} value={updateForm.contact} name="contact"></input></td>
										<td><input form="updateForm" onChange={onChange} value={updateForm.note} name="note"></input></td>
										<td><input form="updateForm" onChange={onChange} value={updateForm.margin_ratio} name="margin_ratio"></input></td>
										<td><button form="updateForm" type="submit">확인</button></td>
										<td><UpdateSwitch eleId={ele.id} isUpdate={isUpdate} setIsUpdate={setIsUpdate} /></td>
										<td><DeleteBtn eleId={ele.id} onDeleteSubmit={onDeleteSubmit} setIsUpdate={setIsUpdate} /></td>
									</tr>
								)
							}else{
								return (
									<tr key={ele.id}>
										<td onClick={()=>{handleSetMode(ele.id)}}>{ele.name}</td>
										<td onClick={()=>{handleSetMode(ele.id)}}>{ele.address}</td>
										<td onClick={()=>{handleSetMode(ele.id)}}>{ele.contact}</td>
										<td onClick={()=>{handleSetMode(ele.id)}}>{ele.note}</td>
										<td onClick={()=>{handleSetMode(ele.id)}}>{ele.margin_ratio}</td>
										<td><UpdateSwitch eleId={ele.id} isUpdate={isUpdate} setIsUpdate={setIsUpdate} setUpdateForm={setUpdateForm} suppliers={suppliers} /></td>
									</tr>
								)
							}
						}
						)}
					</tbody>
				</table>
				:
				<p>등록된 거래처가 없습니다:(</p>
			}
			
		</div>
	)
}

//	ON OFF switch
type updateSwitchProps = {
	eleId: number,
	isUpdate: IUpdateForm,
	setIsUpdate: Dispatch<SetStateAction<IUpdateForm>>,
	setUpdateForm?: Dispatch<SetStateAction<ISupplierInfo>>,
	suppliers?: ISupplierInfo[]
}

const UpdateSwitch = ({ eleId, isUpdate, setIsUpdate, setUpdateForm, suppliers }: updateSwitchProps) => {
	if(isUpdate.active === false){
		let selected: any;
		if(suppliers !== undefined){
			//selected = suppliers[eleId];
			suppliers.forEach((ele)=>{
				if(ele.id === eleId)
					selected = ele;
			})
		}
		return(
			<button onClick={() => {
				if(setIsUpdate !== undefined){
					setIsUpdate({
						active: true,
						target: eleId
					});
				}
				if(setUpdateForm !== undefined){
					setUpdateForm({
						id: selected.id,
						name: selected.name, 
						address: selected.address, 
						contact: selected.contact,
						note: selected.note,
						margin_ratio: selected.margin_ratio,
					});
				}
			}}>update</button>
		)
	}else{
		return(					
			<button onClick={() => {
				if(setIsUpdate !== undefined){
					setIsUpdate({
						active: false,
						target: 0, 
					});
				}
			}}>cancel</button>
		)
	}
}

//	Delete Button
type deleteBtnProps = {
	eleId: number,
	onDeleteSubmit: (form: {id: number}) => void,
	setIsUpdate: Dispatch<SetStateAction<IUpdateForm>>,
}

const DeleteBtn = ({ eleId, onDeleteSubmit, setIsUpdate }: deleteBtnProps) => {
	return (
		<button onClick={()=>{
			onDeleteSubmit({id: eleId});
			setIsUpdate({
				active: false,
				target: 0, 
			});
		}}>delete</button>
	)
}
