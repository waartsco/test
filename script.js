document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const searchForm = document.getElementById('searchForm');
    const copyUrlBtn = document.getElementById('copyUrlBtn');
    const resultUrlContainer = document.getElementById('resultUrlContainer');
    const generatedUrlEl = document.getElementById('generatedUrl');
    const visitUrlBtn = document.getElementById('visitUrlBtn');
    const marketplaceSelect = document.getElementById('marketplaceSelect');
    const copyZipBtn = document.querySelector('.copy_area');
    const copyMessage = document.querySelector('.copied-message');
    const productTypeSelect = document.getElementById('productTypeSelect');
    const departmentSelect = document.getElementById('department');
    const categorySelect = document.getElementById('category');
    const basicTeesCheckbox = document.getElementById('filterBasicTees');
    const cottonCheckbox = document.getElementById('filterCotton');
    const hiddenKeywordsContainer = document.getElementById('hiddenKeywordsContainer');
    const filterBasicTeesContainer = document.getElementById('filterBasicTeesContainer');
    const filterCottonContainer = document.getElementById('filterCottonContainer');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    
    // Product type hidden keyword mappings
    const productTypeKeywords = {
        'tshirt': 'Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-Vneck+-Tanktop',
        'premtshirt': 'Premium+shirt',
        'tanktop': 'Tank+Top%2C+Lightweight%2C+Classic+fit',
        'longsleeve': 'Long+sleeve%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem',
        'raglan': 'Raglan+sleeve%2C+Classic+fit',
        'sweatshirt': 'Sweatshirt+Fleece%2C+Classic+fit%2C+Twill-taped+neck',
        'hoodie': 'Hoodie+Fleece%2C+Classic+fit%2C+Twill-taped+neck',
        'ziphoodie': 'ZipHoodie+Fleece%2C+Classic+fit%2C+Twill-taped+neck',
        'popsocket': 'PopSockets+grip+and+stand+for+phones+and+tablets',
        'case': 'Slim-Fitting+Protective+Case+for+Phone',
        'totebag': 'Tote+Bag%2C+Double-sided+print',
        'throwpillow': 'Throw+Pillow+Cover%2C+Decorative',
        'tumbler': 'tumbler+Cover%2C+Decorative'
    };
    
    // ZIP codes for different marketplaces
    const zipCodes = {
        'com': { zip: '90210', location: 'Beverly Hills, CA' },
        'co.uk': { zip: 'E1 6AN', location: 'London' },
        'de': { zip: '10115', location: 'Berlin' },
        'fr': { zip: '75001', location: 'Paris' },
        'it': { zip: '00100', location: 'Rome' },
        'es': { zip: '28001', location: 'Madrid' },
        'jp': { zip: '100-0001', location: 'Tokyo' }
    };

    // Define marketplace-specific parameters
    const marketplaceConfig = {
    'com': { // USA
        timeFilters: {
            '30days': 'p_n_date_first_available_absolute%3A15196852011',
            '90days': 'p_n_date_first_available_absolute%3A15196853011'
        },
        sellerFilter: 'p_6%3AATVPDKIKX0DER',
        reviewsFilter: 'p_72%3A2661618011'
    },
    'co.uk': { // UK
        timeFilters: {
            '30days': 'p_n_date_first_available_absolute%3A15196852011',
            '90days': 'p_n_date_first_available_absolute%3A15196853011'
        },
        sellerFilter: 'p_6%3AA3P5ROKL5A1OLE',
        reviewsFilter: 'p_72%3A419153031'
    },
    'de': { // Germany
        timeFilters: {
            '30days': 'p_n_date_first_available_absolute%3A15196852011',
            '90days': 'p_n_date_first_available_absolute%3A15196853011'
        },
        sellerFilter: 'p_6%3AA3JWKAKR8XB7XF',
        reviewsFilter: 'p_72%3A419117031'
    },
    'fr': { // France
        timeFilters: {
            '30days': 'p_n_date_first_available_absolute%3A15196852011',
            '90days': 'p_n_date_first_available_absolute%3A15196853011'
        },
        sellerFilter: 'p_6%3AA1X6FK5RDHNB96',
        reviewsFilter: 'p_72%3A437873031'
    },
    'it': { // Italy
        timeFilters: {
            '30days': 'p_n_date_first_available_absolute%3A15196852011',
            '90days': 'p_n_date_first_available_absolute%3A15196853011'
        },
        sellerFilter: 'p_6%3AA11IL2PNWYJU7H',
        reviewsFilter: 'p_72%3A490298031'
    },
    'es': { // Spain
        timeFilters: {
            '30days': 'p_n_date_first_available_absolute%3A15196852011',
            '90days': 'p_n_date_first_available_absolute%3A15196853011'
        },
        sellerFilter: 'p_6%3AA1AT7YVPFBWXBL',
        reviewsFilter: 'p_72%3A831271031'
    },
    'jp': { // Japan
        timeFilters: {
            '30days': 'p_n_date_first_available_absolute%3A15196852011',
            '90days': 'p_n_date_first_available_absolute%3A15196853011'
        },
        sellerFilter: 'p_6%3AAN1VRQENFRJN5',
        reviewsFilter: 'p_72%3A2240292051'
    }
};

    // Define Amazon categories structure
    const amazonCategories = {
        'fashion': [
            { value: '7141123011', text: 'Men\'s Clothing' },
            { value: '1040660', text: 'Women\'s Clothing' },
            { value: '9056922011', text: 'Women\'s Novelty Tops & Tees' },
            { value: '12035955011', text: 'Men\'s Novelty T-Shirts' },
            { value: '1040658', text: 'Boys\' Clothing' },
            { value: '1040664', text: 'Girls\' Clothing' }
        ],
        'fashion-novelty': [] // No specific categories for Novelty & More
    };

// Update time filter radio values based on marketplace
function updateMarketplaceFilters() {
    const marketplace = marketplaceSelect.value;
    const config = marketplaceConfig[marketplace] || marketplaceConfig['com']; // Fallback to US
    
    // Update time filter values
    document.getElementById('timeFilter30Days').value = config.timeFilters['30days'];
    document.getElementById('timeFilter90Days').value = config.timeFilters['90days'];
    
    // Update seller filter value
    document.getElementById('sellerAmazon').value = config.sellerFilter;
    
    // Update reviews filter value
    document.getElementById('reviewsFilter').value = config.reviewsFilter;
}

    // Ensure the result URL container is visible
    resultUrlContainer.style.display = 'block';
    
    // Generate initial URL
    updateGeneratedUrl();
    
    // Initialize the UI
    init();
    
// Make sure the URL container is visible by default
function init() {
    // Update ZIP code display
    updateZipCode();
    
    // Update marketplace-specific filters
    updateMarketplaceFilters();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize product type specific settings
    updateProductTypeSettings();
    
    // Set up department/category box visibility and state
    updateDepartmentCategoryState();
    
    // Set up price input constraints
    setupPriceInputs();
    
    // Initialize hidden keywords checkboxes
    updateProductTypeSpecificFilters();
    
    // Generate and display the initial URL
    updateGeneratedUrl();
    
    // Make sure the result URL container is visible
    resultUrlContainer.style.display = 'block';
}
    // Function to update the generated URL display
function updateGeneratedUrl() {
    const amazonUrl = generateAmazonUrl();
    generatedUrlEl.textContent = amazonUrl;
}

// Completely revised event listener setup
function setupEventListeners() {
    // Form submission
    searchForm.addEventListener('submit', handleFormSubmit);
    
    // Copy URL button
    copyUrlBtn.addEventListener('click', handleCopyUrl);
    
    // Copy ZIP code
    copyZipBtn.addEventListener('click', handleCopyZip);
    
    // Direct listeners for all form controls
    
    // Text inputs
    document.getElementById('searchInput').addEventListener('input', updateGeneratedUrl);
    document.getElementById('customHiddenKeywords').addEventListener('input', updateGeneratedUrl);
    
    // Price inputs
    document.getElementById('minPrice').addEventListener('input', updateGeneratedUrl);
    document.getElementById('maxPrice').addEventListener('input', updateGeneratedUrl);
    
    // Selects
    marketplaceSelect.addEventListener('change', function() {
        updateZipCode();
        updateMarketplaceFilters();
        updateGeneratedUrl();
    });
    
    productTypeSelect.addEventListener('change', function() {
        updateProductTypeSettings();
        updateDepartmentCategoryState();
        updateGeneratedUrl();
    });
    
    departmentSelect.addEventListener('change', function() {
        updateCategoryOptions();
        updateGeneratedUrl();
    });
    
    categorySelect.addEventListener('change', updateGeneratedUrl);
    document.getElementById('sortOrder').addEventListener('change', updateGeneratedUrl);
    
    // Radio buttons
    const timeFilters = document.querySelectorAll('input[name="timeFilter"]');
    timeFilters.forEach(radio => {
        radio.addEventListener('click', updateGeneratedUrl);
    });
    
    // Checkboxes
    document.getElementById('sellerAmazon').addEventListener('click', updateGeneratedUrl);
    document.getElementById('reviewsFilter').addEventListener('click', updateGeneratedUrl);
    document.getElementById('filterBasicTees').addEventListener('click', updateGeneratedUrl);
    document.getElementById('filterCotton').addEventListener('click', updateGeneratedUrl);
    document.getElementById('filterExcludeBrands').addEventListener('click', updateGeneratedUrl);
}
    
    function hideProductSpecificFilters() {
        // Hide the Basic Tees and Cotton filter options
        if (filterBasicTeesContainer) {
            filterBasicTeesContainer.style.display = 'none';
        }
        
        if (filterCottonContainer) {
            filterCottonContainer.style.display = 'none';
        }
    }
    
    function setupPriceInputs() {
        // Add input constraints for price fields
        [minPriceInput, maxPriceInput].forEach(input => {
            // Only allow digits and limit to 2 characters
            input.addEventListener('input', function(e) {
                // Remove any non-digit characters
                this.value = this.value.replace(/\D/g, '');
                
                // Limit to 2 digits
                if (this.value.length > 2) {
                    this.value = this.value.slice(0, 2);
                }
            });
        });
    }
    
    function updateZipCode() {
        const marketplace = marketplaceSelect.value;
        const zipInfo = zipCodes[marketplace];
        const zipHelper = document.querySelector('.plz_helper');
        
        if (zipInfo) {
            zipHelper.innerHTML = `.${marketplace.toUpperCase()}: <span class="copy_me">${zipInfo.zip}</span> (${zipInfo.location})`;
        }
    }
    
    function handleCopyZip() {
        const zipCode = document.querySelector('.copy_me').textContent;
        navigator.clipboard.writeText(zipCode).then(function() {
            copyMessage.style.display = 'inline';
            setTimeout(() => {
                copyMessage.style.display = 'none';
            }, 2000);
        });
    }
    
// Update the form submit handler to only open the URL
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Generate the URL
    const amazonUrl = generateAmazonUrl();
    
    // Open the URL in a new tab
    window.open(amazonUrl, '_blank');
}
    
    function handleCopyUrl() {
    const urlText = generatedUrlEl.textContent;
    navigator.clipboard.writeText(urlText).then(function() {
        // Visual feedback
        copyUrlBtn.classList.add('copy-success');
        setTimeout(function() {
            copyUrlBtn.classList.remove('copy-success');
        }, 1500);
    });
}
    
    function updateUrlIfVisible() {
    // Always update the URL if the result container is visible
    if (resultUrlContainer.style.display !== 'none') {
        const amazonUrl = generateAmazonUrl();
        generatedUrlEl.textContent = amazonUrl;
    }
}
    
    // Fix for Department & Category issue
function updateDepartmentCategoryState() {
    const department = departmentSelect.value;
    
    // Only disable category if no department is selected
    categorySelect.disabled = department === "";
    
    // If a department is selected, enable the category select
    if (department) {
        categorySelect.disabled = false;
    }
    
    // Update visual state of the filter box
    const departmentCategoryBox = document.getElementById('departmentCategoryBox');
    departmentCategoryBox.classList.remove('disabled-filter-box');
}
    
// Ensure category properly updates URL
function updateCategoryOptions() {
    const department = departmentSelect.value;
    
    // Clear current options
    categorySelect.innerHTML = '<option value="">No Category Filter</option>';
    
    // Disable category if "All Departments" is selected
    if (!department) {
        categorySelect.disabled = true;
        return;
    }
    
    // Enable category and add options based on department
    categorySelect.disabled = false;
    
    const categories = amazonCategories[department] || [];
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.value;
        option.textContent = category.text;
        categorySelect.appendChild(option);
    });
    
    // Make sure URL updates
    updateGeneratedUrl();
}
    
    function updateProductTypeSettings() {
        const productType = productTypeSelect.value;
        
        // Automatically handle product type specific settings based on selection
        // These are now hidden from UI but still functional in the logic
        
        // Basic Tees filter is auto-checked for t-shirts
        if (productType === 'tshirt') {
            basicTeesCheckbox.checked = true;
        } else {
            basicTeesCheckbox.checked = false;
        }
        
        // 100% Cotton filter is auto-checked for specific product types
        if (['tshirt', 'longsleeve', 'vneck', 'raglan', 'tanktop'].includes(productType)) {
            cottonCheckbox.checked = true;
        } else {
            cottonCheckbox.checked = false;
        }
    }
    
    function generateAmazonUrl() {
    // Get base marketplace
    const marketplace = marketplaceSelect.value;
    let baseUrl = `https://amazon.${marketplace}`;
    
    // Get marketplace config
    const config = marketplaceConfig[marketplace] || marketplaceConfig['com']; // Fallback to US
    
    // Get search query
    const searchQuery = document.getElementById('searchInput').value.trim();
    
    // Initialize parameters array to join with & later
    let paramParts = [];
    
    // Add search term if provided
    if (searchQuery) {
        paramParts.push(`k=${encodeURIComponent(searchQuery)}`);
    }
    
    // Collection for rh parameters
    let rhParams = [];
    
    // Add time filter
    const timeFilter = document.querySelector('input[name="timeFilter"]:checked').value;
    if (timeFilter) {
        rhParams.push(timeFilter);
    }
    
    // Add seller filter
    const sellerAmazon = document.getElementById('sellerAmazon').checked;
    if (sellerAmazon) {
        rhParams.push(document.getElementById('sellerAmazon').value);
    }
    
    // Add reviews filter
    const reviewsFilter = document.getElementById('reviewsFilter').checked;
    if (reviewsFilter) {
        rhParams.push(document.getElementById('reviewsFilter').value);
    }
    
    // Add price filter
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    if (minPrice && maxPrice) {
        rhParams.push(`p_36%3A${minPrice}00-${maxPrice}00`);
    }
    
    // Always add department and category if selected (regardless of product type)
    const department = document.getElementById('department').value;
    if (department) {
        paramParts.push(`i=${department}`);
        
        // Add category filter if department and category are both selected
        const category = document.getElementById('category').value;
        if (category) {
            rhParams.push(`n%3A${category}`);
        }
    }
    
    // Add hidden keywords filters
    let hiddenKeywords = [];
    
    // First add any custom user-specified hidden keywords (priority #1)
    const customKeywords = document.getElementById('customHiddenKeywords').value.trim();
    if (customKeywords) {
        hiddenKeywords.push(customKeywords);
    }
    
    // Product type specific keywords (only apply if not "custom")
    const productType = productTypeSelect.value;
    if (productType !== 'custom' && productTypeKeywords[productType]) {
        hiddenKeywords.push(productTypeKeywords[productType]);
    }
    
    // Add 100% Cotton filter if applicable and not "custom"
    if (cottonCheckbox.checked && productType !== 'custom') {
        hiddenKeywords.push(cottonCheckbox.value);
    }
    
    // Add exclude brands filter - always add this at the end if selected
    const filterExcludeBrands = document.getElementById('filterExcludeBrands').checked;
    if (filterExcludeBrands) {
        hiddenKeywords.push(document.getElementById('filterExcludeBrands').value);
    }
    
    // Add hidden-keywords parameter if we have any
    if (hiddenKeywords.length > 0) {
        paramParts.push(`hidden-keywords=${hiddenKeywords.join('+')}`);
    }
    
    // Add sort order
    const sortOrder = document.getElementById('sortOrder').value;
    if (sortOrder) {
        paramParts.push(`s=${sortOrder}`);
    }
    
    // Combine all rh parameters with comma (%2C)
    if (rhParams.length > 0) {
        paramParts.push(`rh=${rhParams.join('%2C')}`);
    }
    
    // Build the final URL
    let url = baseUrl;
    
    // Always add /s for search
    url += '/s';
    
    // Add parameters if we have any
    if (paramParts.length > 0) {
        url += '?' + paramParts.join('&');
    }
    
    return url;
}
});
