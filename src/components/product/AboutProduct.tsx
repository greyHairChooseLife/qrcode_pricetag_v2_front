import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:3002',
})

	//********************************************************************
	//		Type Def	
	//********************************************************************
interface IMode {
	about: string,
	productId: number,
}

type Props = {
	setMode: Dispatch<SetStateAction<IMode>>,
}

export const AboutProduct = ({ setMode }: Props) => {

	return (
		<div>hi, I am about Product component.</div>
	);
}



