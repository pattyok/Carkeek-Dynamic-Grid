/**
 * Primary view component for the Carkeek Dynamic Grid plugin.
 */
import { useEffect, useState } from 'react';
import { getCategoryData, getPostData } from './components/getData';
import DynamicGrid from './components/DynamicGrid';

import { createRoot } from 'react-dom/client';


function App(props){
	const { dataUrl, taxUrl,tax } = props;
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState({
		loadingPosts: true,
		loadingCats: true,
	});
	const [filtered, setFiltered] = useState([]);
	const [cats, setCats] = useState([]);
	const [selectedCat, setSelectedCat] = useState(0);

	const resolvePosts = (data) => {
		setPosts(data);
		setLoading( (prevState) => {
			return {
				...prevState,
				loadingPosts: false,
			}
		});
		setFiltered(data);
	}
	const resolveCategories = (data) => {
		setCats(data);
		setLoading( (prevState) => {
			return {
				...prevState,
				loadingCats: false,
			}
		});
	}

	useEffect(() => {
		getPostData(dataUrl, resolvePosts);
	  }, []);

	  useEffect(() => {
		getCategoryData(taxUrl, resolveCategories);
	  }, []);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const catParam = urlParams.get(tax);
		if (catParam) {
			setSelectedCat(parseInt(catParam, 10));
		}
	}, []);

	useEffect(() => {

		if (selectedCat !== 0) {
			const urlParams = new URLSearchParams(window.location.search);
			urlParams.set(tax, selectedCat);
			window.history.replaceState(null, null, `?${urlParams.toString()}`);
		} else {
			const urlParams = new URLSearchParams(window.location.search);
			urlParams.delete(tax);
			window.history.replaceState(null, null, `?${urlParams.toString()}`);
		}

	}, [selectedCat]);

	return (
		<>
			<DynamicGrid
				isLoading={loading.loadingPosts || loading.loadingCats}
				posts={posts}
				categories={cats}
				filtered={filtered}
				selectedCat={selectedCat}
				setSelectedCat={setSelectedCat}
				setFiltered={setFiltered}
				tax={tax}
				imageSize={props.imageSize}
			/>

		</>

	)
}


if (document.getElementById('carkeek-dynamic-grid')) {
	const gridEl = document.getElementById('carkeek-dynamic-grid');
	const dataUrl = gridEl.getAttribute('data-posturl');
	const taxUrl = gridEl.getAttribute('data-taxurl');
	const tax = gridEl.getAttribute('data-tax');
	const imageSize = gridEl.getAttribute('data-imagesize');

	const root = createRoot(gridEl);
	root.render(<App dataUrl={dataUrl} taxUrl={taxUrl} tax={tax} imageSize={imageSize} />);




}

