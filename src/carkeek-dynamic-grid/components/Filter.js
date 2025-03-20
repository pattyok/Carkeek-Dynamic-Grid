import {useEffect} from 'react';

function Filter( {	terms, posts, selectedCat, setSelectedCat, setFiltered, tax} ) {

	useEffect(() => {
		if (selectedCat === 0) {
			setFiltered(posts);
			return;
		}
		const filtered = posts?.filter((post) => post[tax].includes(selectedCat));
		setFiltered(filtered);

	}, [selectedCat]);


	return (
		<div className="cdg-filter-wrapper">
			<button onClick={() => setSelectedCat(0)}>All</button>
			{terms?.map((term) => (
				<button
					key={term.id}
					onClick={() => setSelectedCat(term.id)}
					className={selectedCat === term.id ? 'active' : ''}
					dangerouslySetInnerHTML={{__html: term.name }}
					>
				</button>
			))}
		</div>
	);

}

export default Filter;