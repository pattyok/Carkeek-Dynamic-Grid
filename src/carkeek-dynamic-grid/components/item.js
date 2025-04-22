import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

function Item ( {post, imageSize} ) {

	let image = '';
	if (post.fimg_url !== false) {
		let style = {};
		if (post.meta._carkeekblocks_featured_image_focal_point.length !== 0) {
			const focalPoint = post.meta._carkeekblocks_featured_image_focal_point;
			style.objectPosition = `${focalPoint.x * 100}% ${focalPoint.y * 100}%`;
		}
		image = <img src={post.fimg_url} alt={post.title.rendered} style={style} />;
	} else {
		image = <div className="cdg-no-image"></div>;
	}

	const { ref, inView, entry } = useInView({
		/* Optional options */
		rootMargin: "-50% 0% -50% 0%",
	  });

	return (
		<motion.div
		ref={ref}
		layout
		animate={{opacity: 1}}
		initial={{opacity: 0}}
		exit={{opacity: 0}}
		key={post.id}
		className={inView ? 'cdg-grid-item active' : 'cdg-grid-item'}>
			<a href={post.link}>
			{image}
			<div className="cdg-item-meta">
				<h2 dangerouslySetInnerHTML={{__html: post.title.rendered }}></h2>
			</div>
			</a>
		</motion.div>
	)
}

export default Item;