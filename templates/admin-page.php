<div class="wrap wp-enhanced-categories">

	<div class="wp-enhanced-categories__container">

		<!-- Category Form Section -->
		<div class="wp-enhanced-categories__form-section">
			<h2><?php _e('Add/Edit Category', 'wp-enhanced-categories'); ?></h2>
			<form id="category-form" class="category-form">
				<input type="hidden" id="category-id" name="category_id" value="">
				
				<div class="form-field">
					<label for="category-name"><?php _e('Name', 'wp-enhanced-categories'); ?> *</label>
					<div class="input-wrapper">
						<input type="text" id="category-name" name="name" required>
						<button type="button" class="clear-field" tabindex="-1">
							<span class="dashicons dashicons-no-alt"></span>
						</button>
					</div>
				</div>

				<div class="form-field">
					<label for="category-description"><?php _e('Description', 'wp-enhanced-categories'); ?></label>
					<div class="input-wrapper">
						<textarea id="category-description" name="description"></textarea>
						<button type="button" class="clear-field" tabindex="-1">
							<span class="dashicons dashicons-no-alt"></span>
						</button>
					</div>
				</div>

				<div class="form-field">
					<label for="category-slug"><?php _e('Slug', 'wp-enhanced-categories'); ?></label>
					<div class="input-wrapper">
						<input type="text" id="category-slug" name="slug">
						<button type="button" class="clear-field" tabindex="-1">
							<span class="dashicons dashicons-no-alt"></span>
						</button>
					</div>
					<p class="description"><?php _e('Optional. Will be generated from the name if left empty. When editing a category, clear this field to have it auto-generated from the new name.', 'wp-enhanced-categories'); ?></p>
				</div>

				<div class="form-field">
					<label><?php _e('Parent Category', 'wp-enhanced-categories'); ?></label>
					<div class="category-parent-selector">
						<input type="hidden" id="category-parent" name="parent" value="0">
						<div class="selected-parent">
							<span id="selected-parent-name" class="description"><?php _e('No parent selected', 'wp-enhanced-categories'); ?></span>
						</div>
						<button type="button" id="select-parent-btn" class="button">
							<span class="dashicons dashicons-category"></span>
							<?php _e('Browse Categories', 'wp-enhanced-categories'); ?>
						</button>
					</div>
				</div>

				<div class="form-submit">
					<button type="submit" class="button button-primary">
						<?php _e('Save Category', 'wp-enhanced-categories'); ?>
					</button>
					<button type="button" id="reset-form" class="button">
						<?php _e('Clear Form', 'wp-enhanced-categories'); ?>
					</button>
				</div>
			</form>
		</div>

		<!-- Categories Tree View Section -->
		<div class="wp-enhanced-categories__tree-section">
			<h2>
				<?php _e('Categories Hierarchy', 'wp-enhanced-categories'); ?>
				<span class="description"><?php _e('Click folders to expand/collapse', 'wp-enhanced-categories'); ?></span>
			</h2>
			<div class="tree-controls">
				<button type="button" class="button expand-all-btn">
					<span class="dashicons dashicons-plus-alt2"></span>
					<?php _e('Expand All', 'wp-enhanced-categories'); ?>
				</button>
				<button type="button" class="button collapse-all-btn">
					<span class="dashicons dashicons-minus"></span>
					<?php _e('Collapse All', 'wp-enhanced-categories'); ?>
				</button>
			</div>
			<div id="categories-tree" class="categories-tree"></div>
		</div>
	</div>

	<!-- Parent Category Selection Modal -->
	<div id="parent-category-modal" class="modal">
		<div class="modal-content">
			<div class="modal-header">
				<h3><?php _e('Select Parent Category', 'wp-enhanced-categories'); ?></h3>
				<button type="button" class="modal-close" aria-label="<?php esc_attr_e('Close modal', 'wp-enhanced-categories'); ?>">
					<span class="dashicons dashicons-no-alt"></span>
				</button>
			</div>
			<div class="modal-body">
				<div class="tree-controls">
					<button type="button" class="button expand-all-btn">
						<span class="dashicons dashicons-plus-alt2"></span>
						<?php _e('Expand All', 'wp-enhanced-categories'); ?>
					</button>
					<button type="button" class="button collapse-all-btn">
						<span class="dashicons dashicons-minus"></span>
						<?php _e('Collapse All', 'wp-enhanced-categories'); ?>
					</button>
				</div>
				<div id="parent-categories-tree" class="parent-categories-tree"></div>
			</div>
			<div class="modal-footer">
				<button type="button" class="button" id="modal-cancel">
					<?php _e('Cancel', 'wp-enhanced-categories'); ?>
				</button>
				<button type="button" class="button button-primary" id="modal-select">
					<?php _e('Select', 'wp-enhanced-categories'); ?>
				</button>
			</div>
		</div>
	</div>
</div>