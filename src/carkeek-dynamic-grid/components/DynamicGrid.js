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
		tax,
		imageSize
	} = props;


	if (!isLoading) {
		return (
			<>
			<Filter terms={categories} selectedCat={selectedCat} setSelectedCat={setSelectedCat} setFiltered={setFiltered} posts={posts} filtered={filtered} tax={tax} />
			<motion.div layout className="cdg-grid-wrapper">
				<AnimatePresence>
				{filtered?.map(post => {
					return (
						<Item key={post.id} post={post} imageSize={imageSize} />
					)
				})}
				</AnimatePresence>
			</motion.div>
			</>
		)
	}

}

export default DynamicGrid;