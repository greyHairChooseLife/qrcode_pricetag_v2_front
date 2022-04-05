import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:3002',
})

	//********************************************************************
	//		Type Def	
	//********************************************************************
interface IRootMode {
	about: string,
	productId: number,
}

type Props = {
	rootMode: IRootMode,
	setRootMode: Dispatch<SetStateAction<IRootMode>>,
}

export const AboutProduct = ({ rootMode, setRootMode }: Props) => {

	return (
		<div>hi, I am about Product component. I am pointing {rootMode.productId}</div>
	);
}



