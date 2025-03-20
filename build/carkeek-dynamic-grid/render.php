<?php
/**
 * Template for rendering the Carkeek Grid.
 *
 * @package CarkeekDynamicGrid
 */

$tax = $attributes['taxonomySelected'] ? $attributes['taxonomySelected'] : 'category';
$post_type = $attributes['postTypeSelected'] ? $attributes['postTypeSelected'] : 'post';
$order_by = $attributes['sortPostsBy'] ? $attributes['sortPostsBy'] : 'date';
$order = $attributes['sortPostsOrder'] ? $attributes['sortPostsOrder'] : 'desc';
$tax_url = get_rest_url() . 'wp/v2/' . $tax . '?per_page=100';
$post_url = get_rest_url() . 'wp/v2/' . $post_type . '?per_page=100&fields=fimg_url,id,title,excerpt,link,featured_media,' . $tax . '&orderby=' . $order_by . '&order=' . $order;

$post_url = apply_filters( 'ck_dynamicgrid_dataurl', $post_url, $attributes );
$tax_url = apply_filters( 'ck_dynamicgrid_taxurl', $tax_url, $attributes );
$image_size = apply_filters( 'ck_dynamicgrid_imagesize', $attributes['imageSize'], $attributes );

$layout_style = $attributes['showMetaAsOverlay'] ? 'is-style-meta-overlay' : '';
?>

<div <?php echo get_block_wrapper_attributes( array('class' => $layout_style . ' post-type-' . $post_type)); ?>>
	<style>
		#carkeek-dynamic-grid {
			--cdg-img-aspect-ratio: <?php echo $attributes['imageOrientation']; ?>;
			--cdg-img-min-width: <?php echo $attributes['minImageWidth'] . 'px'; ?>;
		}
	</style>
	<div id="carkeek-dynamic-grid"
		data-posturl=<?php echo esc_attr( $post_url ); ?>
		data-taxurl=<?php echo esc_attr( $tax_url ); ?>
		data-tax=<?php echo esc_attr( $tax ); ?>
		data-imagesize=<?php echo esc_attr( $image_size ); ?>
	></div>
</div>