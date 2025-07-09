<?php
/**
 * Template for rendering the Carkeek Grid.
 *
 * @package CarkeekDynamicGrid
 */

$tax = '';

$post_type = $attributes['postTypeSelected'] ? $attributes['postTypeSelected'] : 'post';
$order_by = $attributes['sortPostsBy'] ? $attributes['sortPostsBy'] : 'date';
$order = $attributes['sortPostsOrder'] ? $attributes['sortPostsOrder'] : 'desc';
$tax_urls = array();
// set in array as it may be possible to select one taxonomy for the filter and one to display on the grid.
if ( isset($attributes['taxonomySelected']) && $attributes['taxonomySelected'] !== 'none' ) {
	$tax = $attributes['taxonomySelected'];
	$tax_urls[$attributes['taxonomySelected']] = get_rest_url() . 'wp/v2/' . $tax . '?per_page=100&hide_empty=1';
}
if ( isset ($attributes['metaFields'])) {
	foreach ( $attributes['metaFields'] as $meta_field ) {
		if ( $meta_field['type'] === 'taxonomy' && $meta_field['fieldName'] !== $attributes['taxonomySelected']  ) {
			$tax_urls[$meta_field['fieldName']] = get_rest_url() . 'wp/v2/' . $meta_field['fieldName'] . '?per_page=100&hide_empty=1';
		}
	}
}


$post_url = get_rest_url() . 'wp/v2/' . $post_type . '?per_page=100&fields=acf,fimg_url,id,title,excerpt,link,featured_media,' . $tax . '&orderby=' . $order_by . '&order=' . $order;

$post_url = apply_filters( 'ck_dynamicgrid_dataurl', $post_url, $attributes );
$tax_urls = apply_filters( 'ck_dynamicgrid_taxurl', $tax_urls, $attributes );
$image_size = apply_filters( 'ck_dynamicgrid_imagesize', $attributes['imageSize'], $attributes );

$layout_style = $attributes['showMetaAsOverlay'] ? 'is-style-meta-overlay' : '';

if ( $attributes['showMetaOnHover'] ) {
	$layout_style .= ' is-style-meta-hover';
}

if ( isset( $attributes['layoutStyle'] ) ) {
	$layout_style .= ' is-style-' . $attributes['layoutStyle'];

	if ( $attributes['layoutStyle'] === 'tiles' ) {
		$layout_style .= ' is-tile-style-' . $attributes['tileLayout'];
	}
} else {
	$layout_style .= ' is-style-grid';
}

$grid_gap = '1.5rem';
if ( isset( $attributes['gridGap'] ) ){
	$grid_gap = 'var(--wp--preset--spacing--' . $attributes['gridGap'] . '0)';

}
?>

<div <?php echo get_block_wrapper_attributes( array('class' => $layout_style . ' post-type-' . $post_type)); ?>>

	<?php if ( $attributes['layoutStyle'] === 'grid' ) : ?>
		<style>
		#carkeek-dynamic-grid {
			--cdg-img-aspect-ratio: <?php echo $attributes['imageOrientation']; ?>;
			--cdg-img-min-width: <?php echo $attributes['minImageWidth'] . 'px'; ?>;
			--cdg-grid-gap: <?php echo $grid_gap; ?>;
		}
		</style>
	<?php else : ?>
		<style>
		#carkeek-dynamic-grid {
			--cdg-grid-gap: <?php echo $grid_gap; ?>;
		}
		</style>
	<?php endif; ?>
	<div id="carkeek-dynamic-grid"
		data-meta="<?php echo esc_attr( json_encode( $attributes['metaFields'] ) ); ?>"
		data-posturl="<?php echo esc_attr( $post_url ); ?>"
		data-taxurls="<?php echo esc_attr( json_encode( $tax_urls ) ); ?>"
		data-filter-tax="<?php echo esc_attr( $tax ); ?>"
		data-imagesize="<?php echo esc_attr( $image_size ); ?>"
	></div>
</div>