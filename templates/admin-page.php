<div class="wrap wp-enhanced-categories">

	<div class="wp-enhanced-categories__container">

		<!-- Category Form Section -->
		<div class="wp-enhanced-categories__form-section">
			<h2><?php _e('Add/Edit Category', 'wp-enhanced-categories'); ?></h2>
			<form id="category-form" class="category-form">
				<div class="form-fields-container">
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
					<p class="description"><?php _e('Optional. Enter your own slug or leave empty to have it automatically generated from the name.', 'wp-enhanced-categories'); ?></p>
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
						<span class="edit-mode-text" style="display: none;"><?php _e('Cancel', 'wp-enhanced-categories'); ?></span>
						<span class="add-mode-text"><?php _e('Clear Form', 'wp-enhanced-categories'); ?></span>
					</button>
				</div>

				<div class="form-footer">
					<a href="https://github.com/Pimzino/wp-enhanced-categories" target="_blank" class="social-button github-button">
						<svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
						</svg>
						<span>GitHub</span>
					</a>
					<a href="https://buymeacoffee.com/pimzino" target="_blank" class="social-button coffee-button">
						<svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
							<path d="M11.5 22.1c-1.9 0-3.8-.4-5.5-1.2-.6-.3-1-.9-1-1.6v-1c0-.5.2-1 .6-1.4.4-.4.9-.6 1.4-.6h9c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v1c0 .7-.4 1.3-1 1.6-1.7.8-3.6 1.2-5.5 1.2zm5-3.2H7.5v.4c0 .2.1.3.2.4 1.6.7 3.2 1.1 4.9 1.1s3.3-.4 4.9-1.1c.1-.1.2-.2.2-.4v-.4h-1.2zm-9-1.3c-.3 0-.5.1-.7.3-.2.2-.3.4-.3.7v1c0 .4.2.7.5.8 1.8.9 3.8 1.3 5.8 1.3s4-.4 5.8-1.3c.3-.1.5-.4.5-.8v-1c0-.3-.1-.5-.3-.7-.2-.2-.4-.3-.7-.3h-9zM20 8.1c-.3-.7-.8-1.3-1.4-1.7-.3-.2-.7-.3-1-.5-.5-.2-1-.3-1.5-.4-.7-.1-1.4-.2-2.1-.2H8c-.7 0-1.4.1-2.1.2-.5.1-1 .2-1.5.4-.4.2-.7.3-1 .5-.6.4-1.1 1-1.4 1.7-.2.4-.2.9-.1 1.3.1.5.3.9.6 1.2.3.4.7.7 1.2.8.4.1.8.2 1.3.2h12c.4 0 .9-.1 1.3-.2.5-.1.9-.4 1.2-.8.3-.3.5-.7.6-1.2.1-.4.1-.9-.1-1.3zm-1 1c-.1.3-.2.5-.4.7-.2.2-.4.4-.7.5-.3.1-.6.1-.9.1H7c-.3 0-.6 0-.9-.1-.3-.1-.5-.3-.7-.5-.2-.2-.3-.4-.4-.7-.1-.3 0-.5.1-.8.2-.4.5-.8 1-1 .2-.1.5-.2.7-.3.4-.1.8-.2 1.2-.3.6-.1 1.2-.1 1.8-.1h6c.6 0 1.2 0 1.8.1.4.1.8.2 1.2.3.3.1.5.2.7.3.5.2.8.6 1 1 .1.3.1.5.1.8z"/>
						</svg>
						<span>Buy me a coffee</span>
					</a>
				</div>
				</div>
			</form>
		</div>

		<!-- Categories Tree View Section -->
		<div class="wp-enhanced-categories__tree-section">
			<h2>
				<?php _e('Categories Hierarchy', 'wp-enhanced-categories'); ?>
				<span class="description"><?php _e('Click folders to navigate categories', 'wp-enhanced-categories'); ?></span>
			</h2>
			<div class="category-breadcrumb">
				<span class="root-indicator"><?php _e('Root', 'wp-enhanced-categories'); ?></span>
				<div class="breadcrumb-path"></div>
			</div>
			<button type="button" class="back-button" disabled>
				<span class="dashicons dashicons-arrow-left-alt"></span>
				<?php _e('Back', 'wp-enhanced-categories'); ?>
			</button>
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
				<div class="category-breadcrumb modal-breadcrumb">
					<span class="root-indicator"><?php _e('Root', 'wp-enhanced-categories'); ?></span>
					<div class="breadcrumb-path"></div>
				</div>
				<button type="button" class="back-button modal-back-button" disabled>
					<span class="dashicons dashicons-arrow-left-alt"></span>
					<?php _e('Back', 'wp-enhanced-categories'); ?>
				</button>
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

	<!-- Delete Confirmation Modal -->
	<div id="delete-confirmation-modal" class="modal">
		<div class="modal-content delete-modal">
			<div class="modal-header">
				<h3><?php _e('Delete Category', 'wp-enhanced-categories'); ?></h3>
				<button type="button" class="modal-close" aria-label="<?php esc_attr_e('Close modal', 'wp-enhanced-categories'); ?>">
					<span class="dashicons dashicons-no-alt"></span>
				</button>
			</div>
			<div class="modal-body">
				<div class="delete-warning">
					<span class="dashicons dashicons-warning"></span>
					<p id="delete-message"></p>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="button" id="cancel-delete">
					<?php _e('Cancel', 'wp-enhanced-categories'); ?>
				</button>
				<button type="button" class="button button-delete" id="confirm-delete">
					<?php _e('Delete', 'wp-enhanced-categories'); ?>
				</button>
			</div>
		</div>
	</div>
</div>