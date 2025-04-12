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
    const departmentCategoryBox = document.getElementById('departmentCategoryBox');
    const departmentSelect = document.getElementById('department');
    const categorySelect = document.getElementById('category');
    const basicTeesCheckbox = document.getElementById('filterBasicTees');
    
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
    
    // Product type hidden keyword mappings
    // You can add more product type specific filters here
    const productTypeKeywords = {
        'tshirt': 'Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-Vneck+-Tanktop',
        'longsleeve': 'Long+sleeve%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem',
        'sweatshirt': 'Sweatshirt+Fleece%2C+Classic+fit%2C+Twill-taped+neck',
        'hoodie': 'Hoodie+Fleece%2C+Classic+fit%2C+Twill-taped+neck',
        'vneck': 'V-Neck%2C+Classic+fit%2C+Lightweight',
        'raglan': 'Raglan+sleeve%2C+Classic+fit',
        'tanktop': 'Tank+Top%2C+Lightweight%2C+Classic+fit',
        'popsocket': 'PopSockets+grip+and+stand+for+phones+and+tablets',
        'case': 'Slim-Fitting+Protective+Case+for+Phone',
        'throwpillow': 'Throw+Pillow+Cover%2C+Decorative',
        'totebag': 'Tote+Bag%2C+Double-sided+print'
        // Add more as needed
    };
    
    // ZIP codes for different marketplaces
    const zipCodes = {
        'com': { zip: '90210', location: 'Beverly Hills, CA' },
        'co.uk': { zip: 'E1 6AN', location: 'London' },
        'de': { zip: '10115', location: 'Berlin' },
        'fr': { zip: '75001', location: 'Paris' },
        'it': { zip: '00100', location: 'Rome' },
        'es': { zip: '28001', location: 'Madrid' },
        'jp': { zip: '100-0001', location: 'Tokyo' },
        'ca': { zip: 'M5V 2A8', location: 'Toronto, ON' }
    };
    
    // Initialize the UI
    init();
    
    function init() {
        // Update ZIP code display
        updateZipCode();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize product type specific settings
        updateProductTypeSettings();
        
        // Initialize department/category box visibility
        toggleDepartmentCategoryBox();
    }
    
    function setupEventListeners() {
        // Form submission
        searchForm.addEventListener('submit', handleFormSubmit);
        
        // Copy URL button
        copyUrlBtn.addEventListener('click', handleCopyUrl);
        
        // Copy ZIP code
        copyZipBtn.addEventListener('click', handleCopyZip);
        
        // Marketplace change
        marketplaceSelect.addEventListener('change', updateZipCode);
        
        // Product type change
        productTypeSelect.addEventListener('change', function() {
            updateProductTypeSettings();
            toggleDepartmentCategoryBox();
        });
        
        // Department change
        departmentSelect.addEventListener('change', updateCategoryOptions);
        
        // Listen for changes on all form elements
        const formElements = document.querySelectorAll('input, select');
        formElements.forEach(element => {
            element.addEventListener('change', updateUrlIfVisible);
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
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Generate and display the URL
        const amazonUrl = generateAmazonUrl();
        generatedUrlEl.textContent = amazonUrl;
        resultUrlContainer.style.display = 'block';
        visitUrlBtn.href = amazonUrl;
        
        // Scroll to the result
        resultUrlContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    function handleCopyUrl() {
        const urlText = generatedUrlEl.textContent;
        navigator.clipboard.writeText(urlText).then(function() {
            copyUrlBtn.textContent = 'Copied!';
            setTimeout(function() {
                copyUrlBtn.textContent = 'Copy URL';
            }, 2000);
        });
    }
    
    function updateUrlIfVisible() {
        if (resultUrlContainer.style.display !== 'none') {
            const amazonUrl = generateAmazonUrl();
            generatedUrlEl.textContent = amazonUrl;
            visitUrlBtn.href = amazonUrl;
        }
    }
    
    function toggleDepartmentCategoryBox() {
        const isCustom = productTypeSelect.value === 'custom';
        departmentCategoryBox.style.display = isCustom ? 'block' : 'none';
        
        // Reset and disable category select if not custom
        if (!isCustom) {
            departmentSelect.value = "";
            categorySelect.innerHTML = '<option value="">No Category Filter</option>';
            categorySelect.disabled = true;
        }
    }
    
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
    }
    
    function updateProductTypeSettings() {
        const productType = productTypeSelect.value;
        
        // Auto-check "Basic Tees Only" for t-shirts
        if (productType === 'tshirt') {
            basicTeesCheckbox.checked = true;
        } else {
            basicTeesCheckbox.checked = false;
        }
        
        // Set custom hidden keywords based on product type
        const customHiddenKeywordsField = document.getElementById('customHiddenKeywords');
        // Clear existing custom hidden keywords
        customHiddenKeywordsField.value = '';
        
        // Set product-type specific keywords if needed
        // You could implement additional logic here
    }
    
    function generateAmazonUrl() {
        // Get base marketplace
        const marketplace = marketplaceSelect.value;
        let baseUrl = `https://amazon.${marketplace}`;
        
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
        
        // Add category filter if Custom product type and category is selected
        if (productTypeSelect.value === 'custom') {
            const category = document.getElementById('category').value;
            if (category) {
                rhParams.push(`n%3A${category}`);
            }
        }
        
        // Add hidden keywords filters
        let hiddenKeywords = [];
        
        // Product type specific keywords (for t-shirt, auto-select "Basic Tees Only")
        const productType = productTypeSelect.value;
        if (productType !== 'custom' && productTypeKeywords[productType]) {
            if (productType === 'tshirt' && basicTeesCheckbox.checked) {
                hiddenKeywords.push(productTypeKeywords[productType]);
            }
        }
        
        // Get all checked preset hidden keywords
        document.querySelectorAll('.hidden-keyword-preset:checked').forEach(checkbox => {
            // Skip filterBasicTees if already added product specific keywords for tshirt
            if (!(checkbox.id === 'filterBasicTees' && productType === 'tshirt')) {
                hiddenKeywords.push(checkbox.value);
            }
        });
        
        // Add custom hidden keywords if provided
        const customKeywords = document.getElementById('customHiddenKeywords').value.trim();
        if (customKeywords) {
            hiddenKeywords.push(customKeywords);
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
        
        // Add department only if custom product type is selected
        if (productTypeSelect.value === 'custom') {
            const department = document.getElementById('department').value;
            if (department) {
                paramParts.push(`i=${department}`);
            }
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
