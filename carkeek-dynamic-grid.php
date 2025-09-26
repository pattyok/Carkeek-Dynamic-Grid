<?php
/**
 * Plugin Name:       Carkeek Dynamic Grid
 * Description:       Make a filterable grid of posts
 * Version:           0.1.11
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Carkeek Studios
 * Author URI:        https://carkeekstudios.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * GitHub Plugin URI: https://github.com/pattyok/Carkeek-Dynamic-Grid
 * Text Domain:       carkeek-dynamic-grid
 * Primary Branch: 	  main
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_carkeek_dynamic_grid_block_init() {
	register_block_type( __DIR__ . '/build/carkeek-dynamic-grid' );
}
add_action( 'init', 'create_block_carkeek_dynamic_grid_block_init' );


/** add featured image url to rest api
 * https://studio-g-architects.local/wp-json/wp/v2/studiog_project?per_page=100&orderby=menu_order&order=DESC&_fields=fimg_url,id,title,excerpt,link,featured_media,project_categories
*/
add_action('rest_api_init', 'register_rest_images' );

function register_rest_images(){
	$post_types = get_post_types( array('public' => true), 'names' );
    register_rest_field( $post_types,
        'fimg_url',
        array(
            'get_callback'    => 'get_rest_featured_image',
            'update_callback' => null,
            'schema'          => null,
        )
    );
}
function get_rest_featured_image( $object, $field_name, $request ) {
    if( $object['featured_media'] ){
        $img = wp_get_attachment_image_src( $object['featured_media'], 'large' );
        return $img[0];
    }
    return false;
}

/** Add menu order to the rest api */
add_filter( 'rest_endpoints', function( $endpoints ) {
    foreach ( $endpoints as $route => &$endpoint ) {
        foreach ( $endpoint as &$handler ) {
            if ( is_array($handler) && isset($handler['args']) && isset( $handler['args']['orderby'] ) ) {
                $handler['args']['orderby']['enum'][] = 'menu_order';
            }
        }
    }
    return $endpoints;
});

