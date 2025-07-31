import Item from "./item";
import Filter from "./Filter";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from 'react';

function DynamicGrid(props) {
	const {
		isLoadingPosts,
		isLoadingCats,
		posts,
		categories,
		filtered,
		selectedCat,
		setFiltered,
		setSelectedCat,
		filterTax,
		imageSize,
		showMeta,
		meta,
		loadingText
	} = props;


	return (
		<>

		{!isLoadingCats && (filterTax !== 'none' && filterTax !== '') && (
			<Filter terms={categories[filterTax]} selectedCat={selectedCat} setSelectedCat={setSelectedCat} setFiltered={setFiltered} posts={posts} filtered={filtered} tax={filterTax} />
		)}
		{isLoadingPosts && <div className="cdg-loading">{loadingText}</div>}
		{!isLoadingPosts && (
		<motion.div layout className="cdg-grid-wrapper">
			<AnimatePresence>
			{filtered?.map((post, index) => {
				return (

					<Item key={post.id} post={post} terms={categories} showMeta={showMeta} meta={meta} imageSize={imageSize} />
				)
			})}
			</AnimatePresence>
		</motion.div>
		)}
		</>
	)
}



export default DynamicGrid;