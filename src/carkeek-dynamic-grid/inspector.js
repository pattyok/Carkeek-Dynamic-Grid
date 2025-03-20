import { InspectorControls, InspectorAdvancedControls } from "@wordpress/block-editor";
import _ from "lodash";
import { __ } from "@wordpress/i18n";
import {
    RangeControl,
    PanelBody,
    ToggleControl,
    RadioControl,
    SelectControl,
    TextareaControl,
    TextControl
} from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";


function postsInspector(props) {
    const {
        taxonomies,
        taxTerms,
        postTypes,
        attributes,
        setAttributes,
        imageSizes,
    } = props;
    const {
        minImageWidth,
        postTypeSelected,
        taxonomySelected,
		showTitle,
        headlineLevel,
        sortPostsBy,
        sortPostsOrder,
        showImage,
        imageOrientation,
        imageSize,
        showDate,
		showMetaAsOverlay
    } = attributes;

    let ptOptions = [];
    if (postTypes) {
        ptOptions = postTypes.map(type => ({
            value: type.slug,
            label: type.name
        }));
    }
    if (!postTypeSelected) {
        const selectAnItem = { value: null, label: 'Select a Post Type' };
        ptOptions.unshift(selectAnItem);
    }
    let sizeOptions = [];
    if (imageSizes) {
        sizeOptions = imageSizes.map(type => ({
            value: type.slug,
            label: type.name
        }));
        sizeOptions.unshift({ value: 'default', label: 'Default' });
    }

    let taxOptions = [];
    if (taxonomies) {
        taxOptions = taxonomies.map(type => ({
            value: type.slug,
            label: type.name
        }));
    }
    if (!taxonomySelected) {
        const selectAnItem = { value: null, label: 'Select a Taxonomy' };
        taxOptions.unshift(selectAnItem);
    }
    const postTypeSelect = (
        <SelectControl
            label={__("Post Type", "carkeek-blocks")}
            onChange={(postTypeSelected) => setAttributes({ postTypeSelected })}
            options={ptOptions}
            value={postTypeSelected}
        />
    );




    const taxonomySelect = (
        <>

		{taxonomies && taxonomies.length > 0
			?
			<>
				<SelectControl
					label={__("Select Taxonomy", "carkeek-blocks")}
					onChange={(taxonomySelected) => setAttributes({ taxonomySelected })}
					options={taxOptions}
					value={taxonomySelected}
				/>
			</>
			: <div className="ck-error">{__("There are no taxonomies assigned this post type.", "carkeek-blocks")}</div>
		}

        </>
    );


    return (
        <>
            <InspectorControls>
			<PanelBody title={__("Posts Settings", "carkeek-blocks")}>
                    {postTypeSelect}
                    {postTypeSelected && (
                        <> {taxonomySelect} </>
                    )}
                    <SelectControl
                        label={__("Sort By", "carkeek-blocks")}
                        onChange={value =>
                            setAttributes({
                                sortPostsBy: value
                            })
                        }
                        options={[
                            { label: __("Publish Date"), value: "date" },
                            { label: __("Title (alpha)"), value: "title" },
                            { label: __("Menu Order"), value: "menu_order" }
                        ]}
                        value={sortPostsBy}
                    />
                    <RadioControl
                        label={__("Order")}
                        selected={sortPostsOrder}
                        options={[

                            { label: __("DESC"), value: "desc" },
							{ label: __("ASC"), value: "asc" },

                        ]}
                        onChange={value =>
                            setAttributes({
                                sortPostsOrder: value
                            })
                        }
                    />
                </PanelBody>
                <PanelBody title={__("Layout", "carkeek-blocks")} initialOpen={false}>

					<RangeControl
						label={__("Min Image Width", "carkeek-blocks")}
						value={minImageWidth}
						onChange={(minImageWidth) => setAttributes({ minImageWidth })}
						min={0}
						max={600}
						step={5}
					/>
					<ToggleControl
                        label={__("Show Meta as Overlay")}
                        checked={showMetaAsOverlay}
                        onChange={value =>
                            setAttributes({ showMetaAsOverlay: value })
                        }
                    />

                </PanelBody>

                <PanelBody title={__("Item Style", "carkeek-blocks")} initialOpen={false}>
					<ToggleControl
                        label={__("Show Title")}
                        checked={showTitle}
                        onChange={value =>
                            setAttributes({ showTitle: value })
                        }
                    />
                    <ToggleControl
                        label={__("Show Published Date")}
                        checked={showDate}
                        onChange={value =>
                            setAttributes({ showDate: value })
                        }
                    />
                    <ToggleControl
                        label={__("Include Featured Image")}
                        checked={showImage}
                        onChange={value =>
                            setAttributes({ showImage: value })
                        }
                    />

                    {showImage &&
                        <>
                            <SelectControl
                                label={__("Image Orientation", "carkeek-blocks")}
                                onChange={value =>
                                    setAttributes({
                                        imageOrientation: value
                                    })
                                }
                                options={[
                                    { label: __("Landscape 2:3"), value: "1.5" },
                                    { label: __("Landscape 3:4"), value: "1.33" },
									{ label: __("Landscape 3:5"), value: "1.66" },
                                    { label: __("Portrait 3:2"), value: "0.66" },
                                    { label: __("Portrait 4:3"), value: "0.75" },
                                    { label: __("Square 1:1"), value: "1" },
                                ]}
                                value={imageOrientation}
                            />
                            <SelectControl
                                label={__("Image Size", "carkeek-blocks")}
                                onChange={value =>
                                    setAttributes({
                                        imageSize: value
                                    })
                                }
                                options={sizeOptions}
                                value={imageSize}
                            />
                        </>
                    }

                </PanelBody>

            </InspectorControls>
        </>
    );
}

export default postsInspector;
