import { withSelect } from "@wordpress/data";
import { useEffect, useState } from 'react';
import { __ } from "@wordpress/i18n";
import {
    Placeholder,
} from "@wordpress/components";
import {  useBlockProps,  BlockControls } from "@wordpress/block-editor";
import classnames from "classnames";

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
		showMetaOnHover,
		minImageWidth,
		imageOrientation,
		showMetaAsOverlay,
		gridGap,
		layoutStyle
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

	useEffect(() => {
		setFiltered(posts);
	}
	, [posts, taxonomySelected]);


	const blockStyles = classnames( {
        [ `is-style-meta-overlay` ]: showMetaAsOverlay,
		[ `is-style-meta-hover` ]: showMetaOnHover,
        [ `is-style-${ layoutStyle }` ]: layoutStyle,
		[ `is-tile-style-${ attributes.tileLayout }` ]: layoutStyle === 'tiles'
    } );

	const blockProps = useBlockProps({className: `${blockStyles}`});
	document.documentElement.style.setProperty('--cdg-img-aspect-ratio', imageOrientation);
	document.documentElement.style.setProperty('--cdg-img-min-width', minImageWidth + 'px');
	document.documentElement.style.setProperty('--cdg-grid-gap', 'var(--wp--preset--spacing--' + gridGap + '0)');
	document.documentElement.style.setProperty('--ck-grid-row-height', '40px');



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
					filterTax={taxonomySelected}
					imageSize={props.imageSize}
					layoutStyle={layoutStyle}
					gridGap={props.gridGap}
					showMeta= {props.showMeta}
					metaFields={props.metaFields}
				/>

        </div>
    );
}


export default withSelect((select, props) => {
    const { attributes } = props;
    const { postTypeSelected, taxonomySelected, metaFields } = attributes;
    const { getEntityRecords,  getPostTypes, getTaxonomies } = select("core");
    const { getSettings } = select( 'core/block-editor' );
    const taxTerms = {};
    const { imageSizes } = getSettings();
	const posts = getEntityRecords('postType', postTypeSelected);

	if ( taxonomySelected && taxonomySelected !== 'none' ) {
		taxTerms[taxonomySelected] = getEntityRecords('taxonomy', taxonomySelected, { per_page: -1 })
	}
	if ( Array.isArray(metaFields) ) {
		metaFields.forEach(field => {
			if ( field.type === 'taxonomy' && field.fieldName && !taxTerms[field.fieldName] ) {
				taxTerms[field.fieldName] = getEntityRecords('taxonomy', field.fieldName, { per_page: -1 });
			}
		});
	}

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
