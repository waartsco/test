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
        // Add more product type specific filters as needed
        // 'product_type': 'corresponding hidden keywords',
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
        }
        
        // You could set other product type specific settings here
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
