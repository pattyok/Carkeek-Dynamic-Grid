import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import _ from "lodash";

function Item ( {post, terms, meta, showMeta} ) {

    let image = '';
    if (post.fimg_url !== false) {
        let style = {};
        if (post.meta && post.meta._carkeekblocks_featured_image_focal_point && post.meta._carkeekblocks_featured_image_focal_point.length !== 0) {
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
    
    let metaData = '';
    if (showMeta) {
        const metaFields = JSON.parse(meta);
        metaData = metaFields.map((field, index) => {
            if (field.type === 'acf' || field.type === 'meta') {
                if (post[field.type] && post[field.type][field.fieldName] && post[field.type][field.fieldName].length > 0) {
                    return `<span key="${index}" class="cdg-meta cdg-meta-${field.fieldName} cdg-meta-${field.type}">${post[field.type][field.fieldName]}</span>`;
                }
            } else if (field.type === 'taxonomy') {
                if (post[field.fieldName] && post[field.fieldName].length > 0) {
					const taxonomy = field.fieldName;
                    // Here we properly access the term name for each taxonomy term
                    const termList = post[taxonomy].map(term => {
						const taxTerm = _.find(terms[taxonomy], { id: term });
                        return `<li class="cdg-meta-term cdg-term-${taxTerm.slug}">${taxTerm.name}</li>`;
                    }).join('');
                    return `<ul key="${index}" class="cdg-meta cdg-meta-${field.fieldName} cdg-meta-${field.type}">${termList}</ul>`;
                }
            }
            return '';
        }).join('');
    }

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
                <div dangerouslySetInnerHTML={{__html: metaData }}></div>
            </div>
            </a>
        </motion.div>
    )
}

export default Item;