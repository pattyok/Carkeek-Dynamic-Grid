import Item from "./item";
import Filter from "./Filter";
import { motion, AnimatePresence } from "framer-motion";

function DynamicGrid(props) {
	const {
		isLoading,
		posts,
		categories,
		filtered,
		selectedCat,
		setFiltered,
		setSelectedCat,
		filterTax,
		imageSize,
		showMeta,
		meta
	} = props;

	if (!isLoading) {
		return (
			<>
			{(filterTax !== 'none' && filterTax !== '') && (
				<Filter terms={categories[filterTax]} selectedCat={selectedCat} setSelectedCat={setSelectedCat} setFiltered={setFiltered} posts={posts} filtered={filtered} tax={filterTax} />
			)}
			<motion.div layout className="cdg-grid-wrapper">
				<AnimatePresence>
				{filtered?.map(post => {
					return (
						<Item key={post.id} post={post} terms={categories} showMeta={showMeta} meta={meta} imageSize={imageSize} />
					)
				})}
				</AnimatePresence>
			</motion.div>
			</>
		)
	}

}

export default DynamicGrid;