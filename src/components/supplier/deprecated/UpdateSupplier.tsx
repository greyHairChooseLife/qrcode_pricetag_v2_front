import React, { Dispatch, SetStateAction } from 'react'

interface IUpdateForm {
	active: boolean,
	target: number | null,
}

type Props = {
	isUpdate: IUpdateForm,
	setIsUpdate: Dispatch<SetStateAction<IUpdateForm>>
}

export const UpdateSupplierSwitch = ({ isUpdate, setIsUpdate }: Props) => {
	const onClick = (isUpdate: IUpdateForm) => {
		setIsUpdate({
			active: !isUpdate.active,
			target: isUpdate.target,
		});
	}
	return (
		<div>
			<button onClick={() => onClick(isUpdate)}>
				update btn
			</button>
		</div>
	)
}
