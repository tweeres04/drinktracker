import { useState } from 'react';

export default function useTyler() {
	const [isTyler] = useState(localStorage.getItem('tyler'));
	return isTyler;
}
