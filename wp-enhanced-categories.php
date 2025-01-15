<?php
/**
 * Plugin Name: WP Enhanced Categories
 * Plugin URI: https://github.com/Pimzino/wp-enhanced-categories
 * Description: A modern and user-friendly way to manage WordPress categories with an enhanced UI/UX.
 * Version: 1.0.0
 * Requires at least: 5.0
 * Requires PHP: 7.2
 * Author: Pimzino
 * Author URI: https://github.com/Pimzino
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: wp-enhanced-categories
 */

if (!defined('ABSPATH')) {
	exit;
}

class WP_Enhanced_Categories {
	private static $instance = null;

	public static function get_instance() {
		if (null === self::$instance) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action('admin_menu', array($this, 'add_menu_page'));
		add_action('admin_enqueue_scripts', array($this, 'enqueue_assets'));
		add_action('wp_ajax_save_category', array($this, 'save_category'));
		add_action('wp_ajax_delete_category', array($this, 'delete_category'));
		add_action('wp_ajax_get_categories', array($this, 'get_categories'));
	}

	public function add_menu_page() {
		add_menu_page(
			__('WP Enhanced Categories', 'wp-enhanced-categories'),
			__('WP Enhanced Categories', 'wp-enhanced-categories'),
			'manage_categories',
			'wp-enhanced-categories',
			array($this, 'render_admin_page'),
			'dashicons-category',
			70
		);
	}

	public function enqueue_assets($hook) {
		if ('toplevel_page_wp-enhanced-categories' !== $hook) {
			return;
		}

		wp_enqueue_style(
			'wp-enhanced-categories-style',
			plugin_dir_url(__FILE__) . 'assets/css/style.css',
			array(),
			'1.0.0'
		);

		wp_enqueue_script(
			'wp-enhanced-categories-script',
			plugin_dir_url(__FILE__) . 'assets/js/script.js',
			array('jquery'),
			'1.0.0',
			true
		);

		wp_localize_script('wp-enhanced-categories-script', 'wpEnhancedCategories', array(
			'ajaxUrl' => admin_url('admin-ajax.php'),
			'nonce' => wp_create_nonce('wp_enhanced_categories_nonce')
		));
	}

	public function render_admin_page() {
		include plugin_dir_path(__FILE__) . 'templates/admin-page.php';
	}

	public function save_category() {
		check_ajax_referer('wp_enhanced_categories_nonce', 'nonce');

		if (!current_user_can('manage_categories')) {
			wp_send_json_error('Insufficient permissions');
		}

		$category_id = isset($_POST['category_id']) ? intval($_POST['category_id']) : 0;
		$name = sanitize_text_field($_POST['name']);
		$description = sanitize_textarea_field($_POST['description']);
		$slug = sanitize_title($_POST['slug']);
		$parent = isset($_POST['parent']) ? intval($_POST['parent']) : 0;

		if (empty($name)) {
			wp_send_json_error('Category name is required');
		}

		$args = array(
			'description' => $description,
			'parent' => $parent,
			'slug' => $slug
		);

		if ($category_id > 0) {
			$result = wp_update_term($category_id, 'category', array_merge(
				array('name' => $name),
				$args
			));
		} else {
			$result = wp_insert_term($name, 'category', $args);
		}

		if (is_wp_error($result)) {
			wp_send_json_error($result->get_error_message());
		}

		wp_send_json_success();
	}

	public function delete_category() {
		check_ajax_referer('wp_enhanced_categories_nonce', 'nonce');

		if (!current_user_can('manage_categories')) {
			wp_send_json_error('Insufficient permissions');
		}

		$category_id = isset($_POST['category_id']) ? intval($_POST['category_id']) : 0;

		if ($category_id <= 0) {
			wp_send_json_error('Invalid category ID');
		}

		$result = wp_delete_term($category_id, 'category');

		if (is_wp_error($result)) {
			wp_send_json_error($result->get_error_message());
		}

		wp_send_json_success();
	}

	public function get_categories() {
		check_ajax_referer('wp_enhanced_categories_nonce', 'nonce');

		if (!current_user_can('manage_categories')) {
			wp_send_json_error('Insufficient permissions');
		}

		$categories = get_categories(array(
			'hide_empty' => false,
			'orderby' => 'name',
			'order' => 'ASC'
		));

		$formatted_categories = array_map(function($category) {
			return array(
				'term_id' => $category->term_id,
				'name' => $category->name,
				'slug' => $category->slug,
				'description' => $category->description,
				'parent' => $category->parent
			);
		}, $categories);

		wp_send_json_success($formatted_categories);
	}
}

// Initialize the plugin
WP_Enhanced_Categories::get_instance();