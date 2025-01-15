jQuery(document).ready(function($) {
	// Core elements
	const modal = $('#parent-category-modal');
	const deleteModal = $('#delete-confirmation-modal');
	const categoriesTree = $('#categories-tree');
	const parentCategoriesTree = $('#parent-categories-tree');
	const backButton = $('.back-button');
	let categories = [];
	let categoryToDelete = null;

	// Global state for current view
	let currentCategoryId = 0;
	let modalCurrentCategoryId = 0;
	let navigationHistory = [];
	let modalNavigationHistory = [];

	// Icons for UI elements
	const folderIcons = {
		folder: '<svg viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z"/></svg>',
		empty: '<svg viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z"/></svg>'
	};


	function updateBreadcrumb() {
		const breadcrumbPath = [];
		let currentId = currentCategoryId;
		
		while (currentId !== 0) {
			const category = categories.find(cat => cat.term_id === currentId);
			if (category) {
				breadcrumbPath.unshift({
					name: category.name,
					id: category.term_id
				});
				currentId = category.parent;
			} else {
				break;
			}
		}
		
		const breadcrumbHtml = breadcrumbPath.map(item => 
			`<span class="breadcrumb-item" data-id="${item.id}">${item.name}</span>`
		).join('');
		
		$('.category-breadcrumb:not(.modal-breadcrumb) .breadcrumb-path').html(breadcrumbHtml);
	}

	function updateModalBreadcrumb() {
		const breadcrumbPath = [];
		let currentId = modalCurrentCategoryId;
		
		while (currentId !== 0) {
			const category = categories.find(cat => cat.term_id === currentId);
			if (category) {
				breadcrumbPath.unshift({
					name: category.name,
					id: category.term_id
				});
				currentId = category.parent;
			} else {
				break;
			}
		}
		
		const breadcrumbHtml = breadcrumbPath.map(item => 
			`<span class="breadcrumb-item" data-id="${item.id}">${item.name}</span>`
		).join('');
		
		$('.modal-breadcrumb .breadcrumb-path').html(breadcrumbHtml);
	}

	function initClearFields() {
		$('.clear-field').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			const $input = $(this).siblings('input, textarea');
			$input.val('').focus();
		});
	}





	// Initialize core functionality
	loadCategories();
	initClearFields();
	bindFolderActions();

	// Form submission handler
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
			beforeSend: () => {
				$(this).addClass('loading');
				$('.breadcrumb-path').empty();
			},
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




	function updateModalBackButtonState() {
		$('.modal-back-button').prop('disabled', modalNavigationHistory.length === 0);
	}

	function navigateModalToCategory(categoryId) {
		if (modalCurrentCategoryId !== categoryId) {
			modalNavigationHistory.push(modalCurrentCategoryId);
			modalCurrentCategoryId = categoryId;
			renderParentCategoriesTree();
			updateModalBackButtonState();
		}
	}

	$('.modal-back-button').on('click', function() {
		if (modalNavigationHistory.length > 0) {
			modalCurrentCategoryId = modalNavigationHistory.pop();
			renderParentCategoriesTree();
			updateModalBackButtonState();
		}
	});

	$('#select-parent-btn').on('click', function() {
		modalCurrentCategoryId = 0;
		modalNavigationHistory = []; // Reset modal navigation history
		renderParentCategoriesTree();
		updateModalBackButtonState();
		modal.fadeIn(200);
		$('body').addClass('modal-open');
	});

	$('.modal-close, #modal-cancel').on('click', function() {
		modal.fadeOut(200, function() {
			$('body').removeClass('modal-open');
			modalCurrentCategoryId = 0;
			modalNavigationHistory = []; // Reset modal navigation history
			updateModalBackButtonState();
		});
	});


	$('#modal-select').on('click', function() {
		const selectedRadio = parentCategoriesTree.find('input[name="parent_category"]:checked');
		if (selectedRadio.length) {
			const selectedId = selectedRadio.val();
			const selectedName = selectedRadio.closest('.folder-item').find('.folder-name').text().trim();
			$('#category-parent').val(selectedId);
			$('#selected-parent-name').text(selectedName);
		} else {
			$('#category-parent').val(0);
			$('#selected-parent-name').text('No parent selected');
		}
		modal.fadeOut(200, function() {
			$('body').removeClass('modal-open');
			modalCurrentCategoryId = 0;
			parentCategoriesTree.find('.folder-item').removeClass('selected');
		});
	});

	// Update parent tree navigation to maintain radio selection
	$('#parent-categories-tree').off('click').on('click', '.folder-item', function(e) {
		const $radio = $(this).find('input[type="radio"]');
		const categoryId = $(this).data('id');
		
		if ($(e.target).is('input[type="radio"]')) {
			e.stopPropagation();
			return;
		}
		
		if (!$(e.target).closest('.folder-actions').length) {
			if ($(e.target).closest('.folder-icon').length || hasChildren(categoryId)) {
				navigateModalToCategory(categoryId);
			} else {
				$radio.prop('checked', !$radio.prop('checked'));
			}
		}
	});


	function loadCategories() {
		$.ajax({
			url: wpEnhancedCategories.ajaxUrl,
			type: 'POST',
			data: {
				action: 'get_categories',
				nonce: wpEnhancedCategories.nonce
			},
			beforeSend: () => {
				categoriesTree.addClass('loading');
				parentCategoriesTree.addClass('loading');
			},
			success: (response) => {
				if (response.success) {
					categories = response.data;
					renderCategoriesTree();
					renderParentCategoriesTree();
				}
			},
			complete: () => {
				categoriesTree.removeClass('loading');
				parentCategoriesTree.removeClass('loading');
			}
		});
	}

	function renderCategoriesTree() {
		const currentCategories = categories.filter(item => item.parent === currentCategoryId);
		const hasChildren = (parentId) => categories.some(item => item.parent === parentId);
		
		const treeHtml = `<ul class="folder-tree">${currentCategories.map(item => `
			<li>
				<div class="folder-item ${hasChildren(item.term_id) ? 'has-children' : ''}" data-id="${item.term_id}">
					<div class="folder-icon">
						${hasChildren(item.term_id) ? folderIcons.folder : folderIcons.empty}
					</div>
					<span class="folder-name">
						${item.name}
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
			</li>
		`).join('')}</ul>`;

		categoriesTree.html(treeHtml);
		bindCategoryActions();
		updateBreadcrumb();
	}

	// Helper function for checking if category has children (global scope)
	function hasChildren(parentId) {
		return categories.some(item => item.parent === parentId);
	}

	function renderParentCategoriesTree() {
		const currentCategories = categories.filter(item => item.parent === modalCurrentCategoryId);
		const selectedParentId = $('#category-parent').val();
		
		const treeHtml = `<ul class="folder-tree">${currentCategories.map(item => `
			<li>
				<div class="folder-item ${hasChildren(item.term_id) ? 'has-children' : ''}" data-id="${item.term_id}">
					<input type="radio" name="parent_category" class="parent-category-radio" 
						   value="${item.term_id}" ${selectedParentId == item.term_id ? 'checked' : ''}>
					<div class="folder-icon">
						${hasChildren(item.term_id) ? folderIcons.folder : folderIcons.empty}
					</div>
					<span class="folder-name">
						${item.name}
					</span>
				</div>
			</li>
		`).join('')}</ul>`;

		parentCategoriesTree.html(treeHtml);
		updateModalBreadcrumb();
		updateModalBackButtonState();
	}

	// Initialize event handlers for folder navigation
	// Back button handler
	backButton.on('click', function() {
		if (navigationHistory.length > 0) {
			currentCategoryId = navigationHistory.pop();
			renderCategoriesTree();
			updateBackButtonState();
		}
	});

	function updateBackButtonState() {
		backButton.prop('disabled', navigationHistory.length === 0);
	}

	function navigateToCategory(categoryId) {
		if (currentCategoryId !== categoryId) {
			navigationHistory.push(currentCategoryId);
			currentCategoryId = categoryId;
			renderCategoriesTree();
			updateBackButtonState();
		}
	}

	function bindFolderActions() {
		// Main tree navigation
		$('#categories-tree').off('click').on('click', '.folder-item', function(e) {
			if (!$(e.target).closest('.folder-actions').length) {
				const categoryId = $(this).data('id');
				navigateToCategory(categoryId);
			}
		});

		// Modal tree navigation
		$('#parent-categories-tree').off('click').on('click', '.folder-item', function(e) {
			if (!$(e.target).is('input[type="radio"]')) {
				const categoryId = $(this).data('id');
				modalCurrentCategoryId = categoryId;
				renderParentCategoriesTree();
			}
		});

		// Breadcrumb navigation
		$('.category-breadcrumb:not(.modal-breadcrumb)').off('click').on('click', '.breadcrumb-item', function() {
			const categoryId = parseInt($(this).data('id'));
			// Clear history when using breadcrumb navigation
			navigationHistory = [];
			currentCategoryId = categoryId;
			renderCategoriesTree();
			updateBackButtonState();
		});

		$('.modal-breadcrumb').off('click').on('click', '.breadcrumb-item', function() {
			modalCurrentCategoryId = parseInt($(this).data('id'));
			renderParentCategoriesTree();
		});

		// Root navigation
		$('.category-breadcrumb:not(.modal-breadcrumb) .root-indicator').off('click').on('click', function() {
			navigationHistory = [];
			currentCategoryId = 0;
			renderCategoriesTree();
			updateBackButtonState();
		});

		$('.modal-breadcrumb .root-indicator').off('click').on('click', function() {
			modalNavigationHistory = [];
			modalCurrentCategoryId = 0;
			renderParentCategoriesTree();
			updateModalBackButtonState();
		});
	}

	// Add click handler for breadcrumb navigation
	$(document).off('click', '.breadcrumb-item').on('click', '.breadcrumb-item', function() {
		const id = $(this).data('id');
		const $item = $(`.folder-item[data-id="${id}"]`);
		if ($item.length) {
			$item.get(0).scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	});

	// Delete modal handlers
	$('#delete-confirmation-modal .modal-close, #cancel-delete').on('click', function() {
		deleteModal.fadeOut(200, function() {
			$('body').removeClass('modal-open');
			categoryToDelete = null;
		});
	});

	$('#confirm-delete').on('click', function() {
		if (!categoryToDelete) return;
		
		const $item = categoryToDelete.element;
		$item.addClass('loading');
		
		$.ajax({
			url: wpEnhancedCategories.ajaxUrl,
			type: 'POST',
			data: {
				action: 'delete_category',
				nonce: wpEnhancedCategories.nonce,
				category_id: categoryToDelete.id
			},
			success: (response) => {
				if (response.success) {
					$('.breadcrumb-path').empty();
					loadCategories();
				}
			},
			complete: () => {
				$item.removeClass('loading');
				deleteModal.fadeOut(200, function() {
					$('body').removeClass('modal-open');
					categoryToDelete = null;
				});
			}
		});
	});

	function bindCategoryActions() {
		// Remove previous bindings before adding new ones
		$('.edit-category, .delete-category').off('click');

		$('.edit-category').on('click', function(e) {
			e.stopPropagation();
			const data = $(this).data();
			$('#category-id').val(data.id);
			$('#category-name').val(data.name);
			$('#category-slug').val(data.slug);
			$('#category-description').val(data.description);
			$('#category-parent').val(data.parent);
			
			const parentName = categories.find(cat => cat.term_id === data.parent)?.name || 'No parent selected';
			$('#selected-parent-name').text(parentName.trim());
			
			$('.folder-item').removeClass('is-editing');
			$(this).closest('.folder-item').addClass('is-editing');
			
			// Show cancel button, hide clear form button
			$('.edit-mode-text').show();
			$('.add-mode-text').hide();
		});

		$('.delete-category').on('click', function(e) {
			e.stopPropagation();
			const $item = $(this).closest('.folder-item');
			const categoryName = $item.find('.folder-name').text().trim();
			const categoryId = $(this).data('id');
			const hasSubcategories = hasChildren(categoryId);
			
			let message = `Are you sure you want to delete "${categoryName}"?`;
			if (hasSubcategories) {
				message = `Warning: "${categoryName}" has subcategories that will also be deleted.\n\nAre you sure you want to delete this category and ALL its subcategories? This action cannot be undone.`;
			}
			
			$('#delete-message').text(message);
			categoryToDelete = {
				id: categoryId,
				element: $item
			};
			
			deleteModal.fadeIn(200);
			$('body').addClass('modal-open');
		});
	}


	function resetForm() {
		$('#category-form')[0].reset();
		$('#category-id').val('');
		$('#category-parent').val(0);
		$('#selected-parent-name').text('No parent selected');
		$('.folder-item').removeClass('selected is-editing');
		
		// Show clear form button, hide cancel button
		$('.edit-mode-text').hide();
		$('.add-mode-text').show();
		
		navigationHistory = [];
		currentCategoryId = 0;
		updateBreadcrumb();
		updateBackButtonState();
	}

});
