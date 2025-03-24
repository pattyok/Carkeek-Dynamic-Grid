import { withSelect } from "@wordpress/data";
import { useEffect, useState } from 'react';
import { __ } from "@wordpress/i18n";
import {
    Placeholder,
} from "@wordpress/components";
import {  useBlockProps,  BlockControls } from "@wordpress/block-editor";

import PostsInspector from "./inspector";
import DynamicGrid from "./components/DynamicGrid";
import icons from "./icons";

function dynamicGridEdit( props ) {

    const {
        attributes,
        setAttributes,
        clientId,
        name,
		posts,
		taxTerms,

    } = props;

    const {
        postLayout,
        postTypeSelected,
        blockId,
		taxonomySelected,
		imageSize,
		minImageWidth,
		imageOrientation,
		showMetaAsOverlay,
		gridGap
    } = attributes;
    if ( ! blockId ) {
        setAttributes( { blockId: clientId } );
    }


    if (!postTypeSelected) {
        const noPostMessage =__("Select a Post Type from the Block Settings");
        return (
            <div
            { ...blockProps } >
                <PostsInspector { ...props } />
                <Placeholder icon={icons.layout} label={ __("Latest Posts")}>
                    {noPostMessage}
                </Placeholder>
                </div>
        );
    }

	const [filtered, setFiltered] = useState(posts);
	const [cats, setCats] = useState([]);
	const [selectedCat, setSelectedCat] = useState(0);
	const [blockStyles, setBlockStyles] = useState('');

	useEffect(() => {
		setFiltered(posts);
	}
	, [posts]);
	useEffect(() => {
		if (showMetaAsOverlay) {
			setBlockStyles('is-style-meta-overlay');
		} else {
			setBlockStyles('');
		}
	}
	, [showMetaAsOverlay]);

	const blockProps = useBlockProps({className: `${blockStyles}`});
	document.documentElement.style.setProperty('--cdg-img-aspect-ratio', imageOrientation);
	document.documentElement.style.setProperty('--cdg-img-min-width', minImageWidth + 'px');
	document.documentElement.style.setProperty('--cdg-grid-gap', 'var(--wp--preset--spacing--' + gridGap + '0)');


    return (
        <div { ...blockProps } >

                <PostsInspector { ...props } />
				<DynamicGrid
					isLoading={false}
					posts={posts}
					categories={taxTerms}
					filtered={filtered}
					setSelectedCat={setSelectedCat}
					setFiltered={setFiltered}
					tax={taxonomySelected}
					imageSize={props.imageSize}
					gridGap={props.gridGap}
				/>

        </div>
    );
}


export default withSelect((select, props) => {

    const { attributes } = props;
    const { postTypeSelected, taxonomySelected } = attributes;
    const { getEntityRecords,  getPostTypes, getTaxonomies } = select("core");
    const { getSettings } = select( 'core/block-editor' );
    const taxTerms = getEntityRecords('taxonomy', taxonomySelected, { per_page: -1 } );
    const { imageSizes } = getSettings();
	const posts = getEntityRecords('postType', postTypeSelected);

    let taxonomies = getTaxonomies({ per_page: -1 });
    taxonomies = !Array.isArray(taxonomies)
            ? taxonomies
            : taxonomies.filter(tax => tax.types.includes(postTypeSelected));


    return {
        postTypes: getPostTypes( { per_page: -1 } ),
        taxonomies: taxonomies,
        taxSelected:  Array.isArray(taxonomies) && taxonomies.length == 1 ? taxonomies[0] : taxonomySelected,
        taxTerms: taxTerms,
        imageSizes: imageSizes,
		posts: posts,
    };
})(dynamicGridEdit);
