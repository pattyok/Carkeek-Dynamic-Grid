/**
 * Primary view component for the Carkeek Dynamic Grid plugin.
 */
import { useEffect, useState } from 'react';
import { getCategoryData, getPostData } from './components/getData';
import DynamicGrid from './components/DynamicGrid';

import { createRoot } from 'react-dom/client';


function App(props){
	const { dataUrl, taxUrls, filterTax, meta } = props;
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
	const resolveCategories = (data, taxonomy, done) => {
		// Update to handle taxonomy parameter and organize terms by taxonomy
        if (!data || !Array.isArray(data)) {
            return;
        }

        setCats(prevCats => ({
            ...prevCats,
            [taxonomy]: data // Store terms under their taxonomy name
        }));
		// If the taxonomy is the one we are filtering by, we can set the filtered state
		if (done) {
			setLoading( (prevState) => {
				return {
					...prevState,
					loadingCats: false,
				}
			});
		}
	}

	useEffect(() => {
		getPostData(dataUrl, resolvePosts);
	  }, []);

	useEffect(() => {
		const urls = JSON.parse(taxUrls);
		const count = Object.keys(urls).length;
		if (Object.keys(urls).length === 0 || !urls) {
			resolveCategories([], filterTax, true);
			return;
		}
		Object.keys(urls).map((taxonomy, i) => {
			const url = urls[taxonomy];
			let done = false;
			if (i === count - 1) {
				done = true;
			}
			getCategoryData(url, (data) => resolveCategories(data, taxonomy, done));
		});
	}, [taxUrls, filterTax]);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const catParam = urlParams.get(filterTax);
		if (catParam) {
			setSelectedCat(parseInt(catParam, 10));
		}
	}, []);

	useEffect(() => {

		if (selectedCat !== 0) {
			const urlParams = new URLSearchParams(window.location.search);
			urlParams.set(filterTax, selectedCat);
			window.history.replaceState(null, null, `?${urlParams.toString()}`);
		} else {
			const urlParams = new URLSearchParams(window.location.search);
			urlParams.delete(filterTax);
			window.history.replaceState(null, null, `?${urlParams.toString()}`);
		}

	}, [selectedCat]);

	return (
		<>
			<DynamicGrid
				meta={meta}
				showMeta={meta.length > 0}
				isLoading={loading.loadingPosts || loading.loadingCats}
				posts={posts}
				categories={cats}
				filtered={filtered}
				selectedCat={selectedCat}
				setSelectedCat={setSelectedCat}
				setFiltered={setFiltered}
				filterTax={filterTax}
				imageSize={props.imageSize}
			/>

		</>

	)
}


if (document.getElementById('carkeek-dynamic-grid')) {
	const gridEl = document.getElementById('carkeek-dynamic-grid');
	const dataUrl = gridEl.getAttribute('data-posturl');
	const taxUrls = gridEl.getAttribute('data-taxurls');
	const filterTax = gridEl.getAttribute('data-filter-tax');
	const imageSize = gridEl.getAttribute('data-imagesize');
	const meta = gridEl.getAttribute('data-meta');

	const root = createRoot(gridEl);
	root.render(<App dataUrl={dataUrl} taxUrls={taxUrls} filterTax={filterTax} imageSize={imageSize} meta={meta} />);
}

function setGalleryHeight() {
	const tiledGalleries = document.querySelectorAll('.wp-block-carkeek-blocks-dynamic-grid.is-style-tiles');
	tiledGalleries?.forEach(gallery => {
		const width = gallery.offsetWidth;
		const rowHeight = width / 12;
		gallery.style.setProperty('--ck-grid-row-height', `${rowHeight}px`);
	});
}

setGalleryHeight();
window.addEventListener('resize', setGalleryHeight);