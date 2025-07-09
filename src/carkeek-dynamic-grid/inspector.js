import { InspectorControls, InspectorAdvancedControls } from "@wordpress/block-editor";
import { Repeater } from '@10up/block-components';
import _, { set } from "lodash";
import { __ } from "@wordpress/i18n";
import {
    RangeControl,
    PanelBody,
    ToggleControl,
    RadioControl,
    SelectControl,
    Button,
    TextControl
} from "@wordpress/components";
import { wordpress } from '@wordpress/icons';
import marks from './marks';
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
		showMetaAsOverlay,
		metaFields,
		showMetaOnHover,
		gridGap,
		layoutStyle,
		tileLayout
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

	const selectAnItem = { value: 'none', label: 'Select a Taxonomy' };
	taxOptions.unshift(selectAnItem);

    const postTypeSelect = (
        <SelectControl
            label={__("Post Type", "carkeek-blocks")}
            onChange={(postTypeSelected) => setAttributes({ postTypeSelected })}
            options={ptOptions}
            value={postTypeSelected}
        />
    );

	useEffect(() => {
		if (layoutStyle === 'tiles') {
			setAttributes({
				showMetaAsOverlay: true,
			});
		}
	}, [layoutStyle, setAttributes]);

    const taxonomySelect = (
        <>

		{taxonomies && taxonomies.length > 0
			?
			<>
				<SelectControl
					label={__("Select Filter Taxonomy", "carkeek-blocks")}
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
				{postTypeSelected && (
					<PanelBody title={__("Filter Settings", "carkeek-blocks")} initialOpen={false}>
                        <> {taxonomySelect} </>
					</PanelBody>
                )}
                <PanelBody title={__("Layout", "carkeek-blocks")} initialOpen={false}>
					<RadioControl
						label={__("Layout Style", "carkeek-blocks")}
						selected={layoutStyle}
						options={[
							{ label: __("Grid"), value: "grid" },
							{ label: __("Tiles"), value: "tiles" },
						]}
						onChange={value =>
							setAttributes({
								layoutStyle: value
							})
						}
					/>
					{layoutStyle === 'grid' &&
						<RangeControl
							label={__("Min Image Width", "carkeek-blocks")}
							value={minImageWidth}
							onChange={(minImageWidth) => setAttributes({ minImageWidth })}
							min={0}
							max={600}
							step={5}
						/>
					}
					{layoutStyle === 'tiles' &&
					<RadioControl
						label={__("Tile Layout", "carkeek-blocks")}
						selected={tileLayout}
						options={[
							{ label: __("Layout 1 (large)"), value: "large" },
							{ label: __("Layout 2 (smaller)"), value: "small" },
						]}
						onChange={value =>
							setAttributes({
								tileLayout: value
							})
						}
					/>
			}
					<RangeControl
						label= "Grid Gap"
						value={ gridGap }
						onChange={ ( gridGap ) => setAttributes( { gridGap } ) }
						min={ 0 }
						max={ 8 }
						step={ 1 }
						type="stepper"
						withInputField={ false }
						marks={ marks['gridGap'] }
					/>


                </PanelBody>

                <PanelBody title={__("Item Style", "carkeek-blocks")} initialOpen={false}>
					{layoutStyle === 'grid' && (
						<ToggleControl
							label={__("Show Meta as Overlay")}
							checked={showMetaAsOverlay}
							onChange={value =>
								setAttributes({ showMetaAsOverlay: value })
							}
						/>
					)}

					{showMetaAsOverlay && (
						<ToggleControl
							label={__("Show Meta on Hover")}
							checked={showMetaOnHover}
							help={
								showMetaOnHover
									? 'Only show meta on hover'
									: 'Always show meta'
							}
							onChange={value =>
								setAttributes({ showMetaOnHover: value })
							}
						/>
					)}

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
				<PanelBody title={__("Meta Fields", "carkeek-blocks")} initialOpen={false}>
					<div className="block-editor-repeater">
					<Repeater attribute="metaFields" allowReordering={true} addButton={__('Add Meta Field', 'carkeek-blocks')} removeButton={__('Remove Meta Field', 'carkeek-blocks')} label={__("Meta Fields", "carkeek-blocks")} emptyMessage={__("No meta fields added yet.", "carkeek-blocks")}>
						{( item, index, setItem, removeItem ) => (
							<>
								<div className="block-editor-repeater__item">
									<SelectControl
										label={__("Field Type", "carkeek-blocks")}
										value={item.type}
										onChange={(value) => setItem({ ...item, type: value })}
										options={[
											{ label: __("ACF Field", "carkeek-blocks"), value: "acf" },
											{ label: __("Custom Field", "carkeek-blocks"), value: "meta" },
											{ label: __("Post Meta", "carkeek-blocks"), value: "postmeta" },
											{ label: __("Taxonomy Terms", "carkeek-blocks"), value: "taxonomy" },
										]}
									/>
									<TextControl key={index} label={__('Field', 'carkeek-blocks')} value={item.fieldName} onChange={(value) => setItem({ ...item, fieldName: value })} />
									<Button
									icon='remove' label={__('Remove')} onClick={removeItem}/>
								</div>
							</>
						)}
					</Repeater>
					</div>


                </PanelBody>

            </InspectorControls>
        </>
    );
}

export default postsInspector;
