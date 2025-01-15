// WP Enhanced Categories Plugin - Modern Folder-like Interface
jQuery(document).ready(function($) {
	const modal = $('#parent-category-modal');
	const categoriesTree = $('#categories-tree');
	const parentCategoriesTree = $('#parent-categories-tree');
	let categories = [];

	function initClearFields() {
		$('.clear-field').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			const $input = $(this).siblings('input, textarea');
			$input.val('').focus();
		});
	}

	function expandAll($container) {
		const items = $container.find('.folder-item').get();
		let delay = 0;
		
		items.forEach(item => {
			const $item = $(item);
			const folderIcon = $item.find('.folder-icon');
			const folderChildren = $item.next('.folder-children');
			
			if (folderIcon.hasClass('folder-collapsed')) {
				setTimeout(() => {
					folderIcon
						.html(folderIcons.expanded)
						.removeClass('folder-collapsed')
						.addClass('folder-expanded');
					
					folderChildren
						.css({height: 0, opacity: 0, display: 'block'})
						.animate({
							height: folderChildren[0].scrollHeight,
							opacity: 1
						}, 150, function() {
							$(this).css('height', '');
						});
				}, delay);
				delay += 50;
			}
		});
	}

	function collapseAll($container) {
		const items = $container.find('.folder-item').get().reverse();
		let delay = 0;
		
		items.forEach(item => {
			const $item = $(item);
			const folderIcon = $item.find('.folder-icon');
			const folderChildren = $item.next('.folder-children');
			
			if (folderIcon.hasClass('folder-expanded')) {
				setTimeout(() => {
					folderIcon
						.html(folderIcons.collapsed)
						.removeClass('folder-expanded')
						.addClass('folder-collapsed');
					
					folderChildren
						.css('height', folderChildren[0].scrollHeight)
						.animate({
							height: 0,
							opacity: 0
						}, 150, function() {
							$(this).css({
								display: 'none',
								height: ''
							});
						});
				}, delay);
				delay += 50;
			}
		});
	}

	// SVG icons for folders
	const folderIcons = {
		collapsed: '<svg viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z"/></svg>',
		expanded: '<svg viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-2 6h-2v2h2v2h-2v2h-2v-2h2v-2h-2v-2h2V8h-2V6h2v2h2v4z"/></svg>'
	};

	loadCategories();
	initClearFields();

	$('#category-form').on('submit', function(e) {
		e.preventDefault();
		const formData = new FormData(this);
		
		$.ajax({
			url: wpEnhancedCategories.ajaxUrl,
			type: 'POST',
			data: {
				action: 'save_category',
				nonce: wpEnhancedCategories.nonce,
				name: formData.get('name'),
				description: formData.get('description'),
				slug: formData.get('slug'),
				parent: formData.get('parent'),
				category_id: formData.get('category_id')
			},
			beforeSend: () => $(this).addClass('loading'),
			success: (response) => {
				if (response.success) {
					loadCategories();
					resetForm();
				}
			},
			complete: () => $(this).removeClass('loading')
		});
	});

	$('#reset-form').on('click', resetForm);

	// Expand/Collapse all buttons handlers
	$('.wp-enhanced-categories__tree-section .expand-all-btn').on('click', () => {
		expandAll(categoriesTree);
	});

	$('.wp-enhanced-categories__tree-section .collapse-all-btn').on('click', () => {
		collapseAll(categoriesTree);
	});

	$('.modal-body .expand-all-btn').on('click', () => {
		expandAll(parentCategoriesTree);
	});

	$('.modal-body .collapse-all-btn').on('click', () => {
		collapseAll(parentCategoriesTree);
	});

	$('#select-parent-btn').on('click', () => {
		renderParentCategoriesTree();
		modal.fadeIn(200);
		$('body').addClass('modal-open');
	});

	$('.modal-close, #modal-cancel').on('click', () => {
		modal.fadeOut(200);
		$('body').removeClass('modal-open');
	});

	$('#modal-select').on('click', () => {
		const selectedItem = parentCategoriesTree.find('.folder-item.selected');
		if (selectedItem.length) {
			const selectedId = selectedItem.data('id');
			// Get only the text content, excluding the subcategory indicator
			const selectedName = selectedItem.find('.folder-name').clone()
				.children()
				.remove()
				.end()
				.text()
				.trim();
			$('#category-parent').val(selectedId);
			$('#selected-parent-name').text(selectedName);
		} else {
			$('#category-parent').val(0);
			$('#selected-parent-name').text('No parent selected');
		}
		modal.fadeOut(200);
		$('body').removeClass('modal-open');
	});

	function loadCategories() {
		$.ajax({
			url: wpEnhancedCategories.ajaxUrl,
			type: 'POST',
			data: {
				action: 'get_categories',
				nonce: wpEnhancedCategories.nonce
			},
			beforeSend: () => categoriesTree.addClass('loading'),
			success: (response) => {
				if (response.success) {
					// Store expanded state before updating
					const expandedItems = {};
					$('.folder-item').each(function() {
						const $item = $(this);
						const id = $item.data('id');
						if ($item.find('.folder-icon').hasClass('folder-expanded')) {
							expandedItems[id] = true;
						}
					});
					
					categories = response.data;
					renderCategoriesTree();
					
					// Restore expanded state
					Object.keys(expandedItems).forEach(id => {
						const $item = $(`.folder-item[data-id="${id}"]`);
						if ($item.length) {
							const folderIcon = $item.find('.folder-icon');
							const folderChildren = $item.next('.folder-children');
							
							folderIcon
								.html(folderIcons.expanded)
								.removeClass('folder-collapsed')
								.addClass('folder-expanded');
							
							folderChildren.css({
								display: 'block',
								height: '',
								opacity: 1
							});
						}
					});
				}
			},
			complete: () => categoriesTree.removeClass('loading')
		});
	}

	function renderCategoriesTree() {
		const hasChildren = (items, parentId) => items.some(item => item.parent === parentId);
		
		const buildTree = (items, parent = 0) => {
			const children = items.filter(item => item.parent === parent);
			if (!children.length) return '';

			return `<ul class="folder-tree">${children.map(item => `
				<li>
					<div class="folder-item ${hasChildren(items, item.term_id) ? 'has-children' : ''}" data-id="${item.term_id}">
						<div class="folder-icon folder-collapsed">
							${folderIcons.collapsed}
						</div>
						<span class="folder-name">
							${item.name}
							${hasChildren(items, item.term_id) ? '<span class="subcategory-indicator">•</span>' : ''}
						</span>
						<div class="folder-actions">
							<button type="button" class="button edit-category" 
									data-id="${item.term_id}" 
									data-name="${item.name}"
									data-slug="${item.slug}"
									data-description="${item.description}"
									data-parent="${item.parent}">
								<span class="dashicons dashicons-edit"></span>
								Edit
							</button>
							<button type="button" class="button delete-category" data-id="${item.term_id}">
								<span class="dashicons dashicons-trash"></span>
								Delete
							</button>
						</div>
					</div>
					<div class="folder-children" style="display: none;">
						${buildTree(items, item.term_id)}
					</div>
				</li>
			`).join('')}</ul>`;
		};

		categoriesTree.html(buildTree(categories));
		bindCategoryActions();
		bindFolderActions();
		initClearFields();
	}

	function renderParentCategoriesTree() {
		const hasChildren = (items, parentId) => items.some(item => item.parent === parentId);
		
		const buildTree = (items, parent = 0) => {
			const children = items.filter(item => item.parent === parent);
			if (!children.length) return '';

			return `<ul class="folder-tree">${children.map(item => `
				<li>
					<div class="folder-item ${hasChildren(items, item.term_id) ? 'has-children' : ''}" data-id="${item.term_id}">
						<div class="folder-icon folder-collapsed">
							${folderIcons.collapsed}
						</div>
						<span class="folder-name">
							${item.name}
							${hasChildren(items, item.term_id) ? '<span class="subcategory-indicator">•</span>' : ''}
						</span>
					</div>
					<div class="folder-children" style="display: none;">
						${buildTree(items, item.term_id)}
					</div>
				</li>
			`).join('')}</ul>`;
		};

		parentCategoriesTree.html(buildTree(categories));
		bindFolderActions();
		initClearFields();

		parentCategoriesTree.find('.folder-item').on('click', function(e) {
			e.stopPropagation();
			parentCategoriesTree.find('.folder-item').removeClass('selected');
			$(this).addClass('selected');
		});
	}

	function bindFolderActions() {
		$('.folder-item').on('click', function(e) {
			e.stopPropagation();
			const $this = $(this);
			const folderIcon = $this.find('.folder-icon');
			const folderChildren = $this.next('.folder-children');
			
			if (folderIcon.hasClass('folder-collapsed')) {
				folderIcon
					.html(folderIcons.expanded)
					.removeClass('folder-collapsed')
					.addClass('folder-expanded');
				
				folderChildren
					.css({height: 0, opacity: 0, display: 'block'})
					.animate({
						height: folderChildren[0].scrollHeight,
						opacity: 1
					}, 200, function() {
						$(this).css('height', '');
					});
			} else {
				folderIcon
					.html(folderIcons.collapsed)
					.removeClass('folder-expanded')
					.addClass('folder-collapsed');
				
				folderChildren
					.css('height', folderChildren[0].scrollHeight)
					.animate({
						height: 0,
						opacity: 0
					}, 200, function() {
						$(this).css({
							display: 'none',
							height: ''
						});
					});
			}
		});
	}

	function bindCategoryActions() {
		$('.edit-category').on('click', function(e) {
			e.stopPropagation();
			const data = $(this).data();
			$('#category-id').val(data.id);
			$('#category-name').val(data.name);
			$('#category-slug').val(data.slug);
			$('#category-description').val(data.description);
			$('#category-parent').val(data.parent);
			
			// Clean parent name text when displaying
			const parentName = categories.find(cat => cat.term_id === data.parent)?.name || 'No parent selected';
			$('#selected-parent-name').text(parentName.trim());
			
			// Mark this item as being edited
			$('.folder-item').removeClass('is-editing');
			$(this).closest('.folder-item').addClass('is-editing');
		});

		$('.delete-category').on('click', function(e) {
			e.stopPropagation();
			const $item = $(this).closest('.folder-item');
			const categoryName = $item.find('.folder-name').text();
			
			if (!confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) return;

			const categoryId = $(this).data('id');
			$item.addClass('loading');
			
			$.ajax({
				url: wpEnhancedCategories.ajaxUrl,
				type: 'POST',
				data: {
					action: 'delete_category',
					nonce: wpEnhancedCategories.nonce,
					category_id: categoryId
				},
				success: (response) => {
					if (response.success) {
						loadCategories();
					}
				},
				complete: () => $item.removeClass('loading')
			});
		});
	}

	function resetForm() {
		$('#category-form')[0].reset();
		$('#category-id').val('');
		$('#category-parent').val(0);
		$('#selected-parent-name').text('No parent selected');
		
		// Remove editing and selected states but preserve expand/collapse
		$('.folder-item').removeClass('selected is-editing');
	}
});
