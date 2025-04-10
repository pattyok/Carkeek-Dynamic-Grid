import { motion } from "framer-motion";

function Item ( {post, imageSize} ) {
	const image = post.fimg_url !== false ? post.fimg_url : 'https://via.placeholder.com/150';
	let style = {};
	if (post.meta._carkeekblocks_featured_image_focal_point.length !== 0) {
		const focalPoint = post.meta._carkeekblocks_featured_image_focal_point;
		style.objectPosition = `${focalPoint.x * 100}% ${focalPoint.y * 100}%`;
	}
	return (
		<motion.div
		layout
		animate={{opacity: 1}}
		initial={{opacity: 0}}
		exit={{opacity: 0}}
		key={post.id}
		className="cdg-grid-item">
			<a href={post.link}>
			<img src={image} alt={post.title.rendered} style={style} />
			<div className="cdg-item-meta">
				<h2 dangerouslySetInnerHTML={{__html: post.title.rendered }}></h2>
			</div>
			</a>
		</motion.div>
	)
}

export default Item;