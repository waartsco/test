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

    //Search Clear
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    
    if (searchInput.value.length > 0) {
        clearSearchBtn.style.display = 'block';
    }

    // Add this function to script.js
    function populateDepartments() {
        const marketplace = marketplaceSelect.value;
        const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
        departmentSelect.innerHTML = '<option value="">All (no department)</option>';
        
        if (config.categories) {
            Object.keys(config.categories).forEach(deptKey => {
                const option = document.createElement('option');
                option.value = deptKey;
                option.textContent = config.categories[deptKey].displayName || deptKey;
                departmentSelect.appendChild(option);
            });
        }
        updateCategoryOptions();
    }

    // ZIP codes for different marketplaces
    const zipCodes = {
        'com': {
            zip: '90210',
            location: 'Beverly Hills, CA'
        },
        'co.uk': {
            zip: 'E1 6AN',
            location: 'London'
        },
        'de': {
            zip: '10115',
            location: 'Berlin'
        },
        'fr': {
            zip: '75001',
            location: 'Paris'
        },
        'it': {
            zip: '00100',
            location: 'Rome'
        },
        'es': {
            zip: '28001',
            location: 'Madrid'
        },
        'jp': {
            zip: '100-0001',
            location: 'Tokyo'
        }
    };
    
const productTypeToDepartment = {
  'KDP': 'stripbooks',
  'tshirt': 'fashion-novelty',
  'premtshirt': 'fashion-novelty',
  'tanktop': 'fashion-novelty',
  'longsleeve': 'fashion-novelty',
  'raglan': 'fashion-novelty',
  'sweatshirt': 'fashion-novelty',
  'hoodie': 'fashion-novelty',
  'ziphoodie': 'fashion-novelty',
  'popsocket': 'mobile',
  'case': 'mobile',
  'totebag': 'garden',
  'throwpillow': 'garden',
    'tumbler':'garden'
};

const departmentToProductType = {
  'stripbooks': 'KDP',
  'fashion-novelty': 'tshirt',
  'mobile': 'case',
  'garden': 'totebag'
};

    // Define marketplace-specific parameters
    // Replace the current marketplaceConfig object with this expanded version
    const marketplaceConfig = {
        'com': { // USA
            timeFilters: {
                '30days': 'p_n_date_first_available_absolute%3A15196852011',
                '90days': 'p_n_date_first_available_absolute%3A15196853011'
            },
            sellerFilter: 'p_6%3AA3P5ROKL5A1OLE',
            reviewsFilter: 'p_72%3A419153031',
            // Add product type keywords specific to USA
            productTypeKeywords: {
                'tshirt': 'Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'premtshirt': 'Fit%3A+Men’s+fit+runs+small%2C+size+up+for+a+looser+fit.+Women’s+fit+is+true+to+size%2C+order+usual+size.+is+made+of+lightweight+fine+jersey+fabric+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'tanktop': '"tank top" Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-V-neck',
                'longsleeve': 'Long+sleeve%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-premium+-Raglan+-Vneck+-sweathshirt+-tanktop',
                'raglan': '"raglan" Lightweight, Classic fit, Double-needle sleeve and bottom hem+-Longsleeve+-Vneck+-Tanktop',
                'sweatshirt': '"sweatshirt" 8.5 oz, Classic fit, Twill-taped neck+-Raglan+-Vneck+-Tanktop+-hoodie',
                'hoodie': '"pullover hoodie" 8.5 oz, Classic fit, Twill-taped neck+-Raglan+-Vneck+-Tanktop+-zip',
                'ziphoodie': '"zip hoodie" 8.5 oz, Classic fit, Twill-taped neck+-Raglan+-Vneck+-Tanktop',
                'popsocket': '"Popsocket" Printed top is swappable with other compatible PopGrip models. Just press flat, turn 90 degrees until you hear a click and remove to swap.',
                'case': '"case" "Two-part protective case made from a premium scratch-resistant polycarbonate shell and shock absorbent TPU liner protects against drops"',
                'totebag': '"Tote+Bag"+Made+of+a+lightweight%2C+spun+polyester+canvas-like+fabric.+All+seams+and+stress+points+are+double-stitched+for+durability%2C+and+the+reinforced+bottom+flattens+to+fit+more+items+and+hold+larger+objects.',
                'throwpillow': '"Throw Pillow" Filled with 100% polyester and sewn closed',
                'tumbler': '"Tumbler" "Merch on Demand"',
                'KDP': "independently+published"
            },
            // Add supported sort orders for USA
            sortOrders: [{
                    value: '',
                    text: 'Default (none)'
                },
                {
                    value: 'date-desc-rank',
                    text: 'Newest Arrivals'
                },
                {
                    value: 'featured',
                    text: 'Featured'
                },
                {
                    value: 'most-purchased-rank',
                    text: 'Most Purchased (Best Sellers)'
                },
                {
                    value: 'exact-aware-popularity-rank',
                    text: 'Best Selling Sort'
                },
                {
                    value: 'review-rank',
                    text: 'Top Rated (Review Rank)'
                },
                {
                    value: 'review-count-rank',
                    text: 'Most Reviews Count Rank'
                },
                {
                    value: 'price-desc-rank',
                    text: 'Price High to Low'
                },
                {
                    value: 'price-asc-rank',
                    text: 'Price Low to High'
                },
                {
                    value: 'date-asc-rank',
                    text: 'Oldest First'
                },
                {
                    value: 'relevancerank',
                    text: 'Relevance Rank'
                },
                {
                    value: 'relevanceblender',
                    text: 'Relevance Blender'
                },
                {
                    value: 'featured-rank',
                    text: 'Featured (featured-rank)'
                },
                {
                    value: 'most-wished-for-rank',
                    text: 'Most Wished For Rank'
                }
            ],
            // Departments and categories for USA
            categories: {
                'fashion-novelty': {
                    displayName: 'Fashion Novelty & More',
                    categories: []
                },
                'fashion': {
                    displayName: 'Fashion',
                    categories: [
                        {value: '7147441011', text: 'Men\'s Clothing'},
                        {value: '7147440011', text: 'Women\'s Clothing'},
                        {value: '9056921011', text: 'Women\'s Novelty Tops & Tees'},
                        {value: '9056985011', text: 'Men\'s Novelty T-Shirts'},
                        {value: '1040666', text: 'Boys\' Clothing'},
                        {value: '1040664', text: 'Girls\' Clothing'}
                    ]
                },
                'mobile': {
                    displayName: 'Cell Phones & Accessories',
                    categories: []
                },
                'garden': {
                    displayName: 'Home & Kitchen',
                    categories: []
                },
                // 'stripbooks-intl-ship' MRB uses this
                'stripbooks': {
                    displayName: 'Books (KDP)',
                    categories: [
                        {value: '3248857011', text: 'Calendars'},
                        {value: '4', text: 'Children\'s Books'},
                        {value: '48', text: 'Crafts, Home & Hobbies'}
                    ]
                }
            },
            // Brands to exclude for USA
            excludeBrands: '-Officially+-Licensed+-LyricLyfe+-Disney+-Marvel+-StarWars+-Mademark+-HarryPotter+-Pixar+-SANRIO+-EliteAuthentics+-Barbie+-BATMAN+-JeffDunham+-CJGrips+-BreakingT+-SpongebobSquarePants+-BallparkMVP+-DCComics+-LooneyTunes+-SUPERMARIO+-Pokemon+-STARTREK+-StrangerThings+-Fallout+-MTV+-Beetlejuice+-SouthPark+-HelloKitty+-Jeep+-GypsyQueen+-TheRollingStones+-NEWLINECINEMA+-SagittariusGallery+-ScoobyDoo+-OfficialHighSchoolFanGear+-PinkFloyd+-Nickelodeon+-CareBears+-Popfunk+-FanPrint+-WarnerBros+-WWE+-DrSeuss+-NBC+-CuriousGeorge+-MeanGirls+-CartoonNetwork+-SesameStreet+-Hasbro+-CocaCola+-RickMorty+-Nintendo+-DespicableMe+-JurassicPark+-TMNT+-MyLittlePony+-AmericanKennelClub+-AnnoyingOrange+-BeerNuts+-BillNye+-Booba+-Buckedup+-CarlyMartina+-ComradeDetective+-Daria+-DippinDots+-DramaLlama+-Dunkin+-HannahHart+-IMOMSOHARD+-ImpracticalJokers+-JaneAusten+-JaneGoodall+-JennMcAllister+-JoJoSiwa+-Kabillion+-LoveIsland+-LyricVerse+-ModPodge+-NashGrier+-NeildeGrasseTyson+-RickyDillon+-ROBLOX+-ShibSibs+-SpongeBob+-TheDailyWire+-TheGrandTour+-Oddbods+-TheYoungTurks+-TheSoul+-TwinPeaks+-UglyDolls+-Mandalorian+-SpaceJam+-Aerosmith+-Bengals+-Rebelde+-BreakingBad+-FooFighters+-BlackSabbath+-SelenaQuintanilla+-CampusLab+-RobZombie+-Misfits+-Mattel+-Sheeran+-Zelda',
            departmentSettings: {
              'stripbooks': {
                timeFilters: {
                  '30days': 'BOOKp_n_date_first_available_absolute%3A15196852011',
                  '90days': 'BOOKp_n_date_first_available_absolute%3A15196853011'
                },
                sellerFilter: 'BOOKp_6%3AATVPDKIKX0DER',
                reviewsFilter: 'BOOKp_72%3A419115011',
                sortOrders: [
                  {value: '', text: 'Default (none)'},
                  {value: 'BOOKdate-desc-rank', text: 'Newest Arrivals'},
                  {value: 'BOOKsalesrank', text: 'Best Sellers'}
                ]
              }
            },
            productTypeMappings: {
              'stripbooks': 'KDP',
              'fashion-novelty': 'tshirt',
              'mobile': 'case'
            }
        },
        'co.uk': { // UK
            timeFilters: {
                '30days': 'COUKp_n_date_first_available_absolute%3A15196852011',
                '90days': 'COUKp_n_date_first_available_absolute%3A15196853011'
            },
            sellerFilter: 'COUKp_6%3AA3P5ROKL5A1OLE',
            reviewsFilter: 'COUKp_72%3A419153031',
            // UK-specific product keywords
            productTypeKeywords: {
                'tshirt': 'COUKLightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'premtshirt': 'COUKPremium+shirt',
                'tanktop': 'COUKTank+Top%2C+Lightweight%2C+Classic+fit',
                'longsleeve': 'COUKLong+sleeve%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem',
                'raglan': 'COUKRaglan+sleeve%2C+Classic+fit',
                'sweatshirt': 'COUKSweatshirt+Fleece%2C+Classic+fit%2C+Twill-taped+neck',
                'hoodie': 'COUKHoodie+Fleece%2C+Classic+fit%2C+Twill-taped+neck',
                'ziphoodie': 'COUKZipHoodie+Fleece%2C+Classic+fit%2C+Twill-taped+neck',
                'popsocket': 'COUKPopSockets+grip+and+stand+for+phones+and+tablets',
                'case': 'COUKSlim-Fitting+Protective+Case+for+Phone',
                'totebag': 'COUKTote+Bag%2C+Double-sided+print',
                'throwpillow': 'COUKThrow+Pillow+Cover%2C+Decorative',
                'tumbler': 'COUKtumbler+Cover%2C+Decorative'
            },
            // UK-specific sort orders
            sortOrders: [{
                    value: '',
                    text: 'Default'
                },
                {
                    value: 'COUKpopularity-rank',
                    text: 'COUKMost Popular'
                },
                {
                    value: 'COUKdate-desc-rank',
                    text: 'COUKNewest Arrivals'
                },
                {
                    value: 'COUKreview-rank',
                    text: 'COUKTop Rated'
                },
                {
                    value: 'COUKprice-desc-rank',
                    text: 'COUKPrice High to Low'
                },
                {
                    value: 'COUKprice-asc-rank',
                    text: 'COUKPrice Low to High'
                }
            ],
            // UK-specific categories
            categories: {
                'fashionUK': {
                    displayName: 'FashionUK8',
                    categories: [
                        {value: '7141123011', text: 'Men\'s Clothing'},
                        {value: '1040660', text: 'Women\'s Clothing'},
                        {value: '9056922011', text: 'Women\'s Novelty Tops & Tees'},
                        {value: '12035955011', text: 'Men\'s Novelty T-Shirts'},
                        {value: '1040658', text: 'Boys\' Clothing'},
                        {value: '1040664', text: 'Girls\' Clothing'}
                    ]
                },
                'fashion-noveltyUK': {
                    displayName: 'Fashion NoveltyUK8',
                    categories: []
                }
            },
            // Brands to exclude for UK
            excludeBrands: 'COUK-Disney+-Marvel+-Star Wars+-Harry Potter+-Pixar+-SANRIO+-Barbie+-BATMAN+-DC Comics+-Looney Tunes+-SUPER MARIO+-Pokemon+-BBC+-ITV+-Channel 4'
        },
        // Repeat for other marketplaces with their specific values
        'de': {
            timeFilters: {
                '30days': 'DEp_n_date_first_available_absolute%3A15196852011',
                '90days': 'DEp_n_date_first_available_absolute%3A15196853011'
            },
            sellerFilter: 'DEp_6%3AA3JWKAKR8XB7XF',
            reviewsFilter: 'DEp_72%3A419117031',
            productTypeKeywords: {
                'tshirt': 'DELeichtes%2C+Klassisch+geschnitten%2C+Doppelt+genähter+Saum+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'premtshirt': 'DEPremium+shirt',
                'tanktop': 'Tank+Top%2C+Leicht%2C+Klassische+Passform',
                'longsleeve': 'Langarm%2C+Klassische+Passform',
                'hoodie': 'Kapuzenpullover%2C+Fleece%2C+Klassische+Passform',
                'sweatshirt': 'Sweatshirt%2C+Fleece%2C+Klassische+Passform',
                'case': 'Schutzhülle+für+Handy',
                'totebag': 'Tragetasche%2C+Beidseitiger+Druck'
            },
            sortOrders: [{
                    value: '',
                    text: 'DEStandard'
                },
                {
                    value: 'DEpopularity-rank',
                    text: 'Beliebtheit'
                },
                {
                    value: 'date-desc-rank',
                    text: 'Neueste Zuerst'
                },
                {
                    value: 'review-rank',
                    text: 'Durchschnittliche Kundenbewertung'
                },
                {
                    value: 'price-desc-rank',
                    text: 'Preis: Hoch zu Niedrig'
                },
                {
                    value: 'price-asc-rank',
                    text: 'Preis: Niedrig zu Hoch'
                }
            ],
            categories: {
                'fashionDE': {
                    displayName: 'Fashion3DE',
                    categories: [
                        {value: '7141123011', text: 'Men\'s Clothing'},
                        {value: '1040660', text: 'Women\'s Clothing'},
                        {value: '9056922011', text: 'Women\'s Novelty Tops & Tees'},
                        {value: '12035955011', text: 'Men\'s Novelty T-Shirts'},
                        {value: '1040658', text: 'Boys\' Clothing'},
                        {value: '1040664', text: 'Girls\' Clothing'}
                    ]
                },
                'fashion-noveltyDE': {
                    displayName: 'Fashion Novelty3DE',
                    categories: []
                }
            },
            excludeBrands: 'DE-Disney+-Marvel+-Star Wars+-Harry Potter+-Pixar+-ARD+-ZDF+-RTL'
        },
        // Add the other marketplaces in the same format
        'fr': {
            // French marketplace config with French-specific values
            timeFilters: {
                '30days': 'p_n_date_first_available_absolute%3A15196852011',
                '90days': 'p_n_date_first_available_absolute%3A15196853011'
            },
            sellerFilter: 'p_6%3AA1X6FK5RDHNB96',
            reviewsFilter: 'p_72%3A437873031',
            productTypeKeywords: {
                'tshirt': 'Léger%2C+Coupe+classique%2C+Manches+à+double+couture+et+ourlet+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'premtshirt': 'T-shirt+Premium',
                'longsleeve': 'Manches+Longues%2C+Coupe+Classique',
                'hoodie': 'Sweat+à+Capuche%2C+Coupe+Classique',
                'case': 'Coque+de+Protection+pour+Téléphone'
            },
            sortOrders: [{
                    value: '',
                    text: 'Par défaut'
                },
                {
                    value: 'popularity-rank',
                    text: 'Popularité'
                },
                {
                    value: 'date-desc-rank',
                    text: 'Nouveautés'
                },
                {
                    value: 'review-rank',
                    text: 'Meilleures évaluations'
                },
                {
                    value: 'price-desc-rank',
                    text: 'Prix: décroissant'
                },
                {
                    value: 'price-asc-rank',
                    text: 'Prix: croissant'
                }
            ],
            categories: {
                'fashionFR': {
                    displayName: 'Fashion4FR',
                    categories: [
                        {value: '7141123011', text: 'Men\'s Clothing'},
                        {value: '1040660', text: 'Women\'s Clothing'},
                        {value: '9056922011', text: 'Women\'s Novelty Tops & Tees'},
                        {value: '12035955011', text: 'Men\'s Novelty T-Shirts'},
                        {value: '1040658', text: 'Boys\' Clothing'},
                        {value: '1040664', text: 'Girls\' Clothing'}
                    ]
                },
                'fashion-noveltyFR': {
                    displayName: 'Fashion Novelty4FR',
                    categories: []
                }
            },
            excludeBrands: '-Disney+-Marvel+-Star Wars+-Harry Potter+-TF1+-France Télévisions+-Canal+'
        },
        // Complete the other marketplaces similarly
        'it': {
            timeFilters: {
                '30days': 'p_n_date_first_available_absolute%3A15196852011',
                '90days': 'p_n_date_first_available_absolute%3A15196853011'
            },
            sellerFilter: 'p_6%3AA11IL2PNWYJU7H',
            reviewsFilter: 'p_72%3A490298031',
            productTypeKeywords: {
                'tshirt': 'Leggero%2C+Vestibilità+classica%2C+Manica+doppia+cucita+e+orlo+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'premtshirt': 'Premium+shirt',
                'hoodie': 'Felpa+con+Cappuccio%2C+Vestibilità+Classica',
                'case': 'Cover+Protettiva+per+Telefono'
            },
            sortOrders: [{
                    value: '',
                    text: 'Predefinito'
                },
                {
                    value: 'popularity-rank',
                    text: 'Più popolari'
                },
                {
                    value: 'date-desc-rank',
                    text: 'Novità'
                },
                {
                    value: 'review-rank',
                    text: 'Recensioni migliori'
                },
                {
                    value: 'price-desc-rank',
                    text: 'Prezzo: da alto a basso'
                },
                {
                    value: 'price-asc-rank',
                    text: 'Prezzo: da basso ad alto'
                }
            ],
            categories: {
                'fashion': {
                    displayName: 'Fashion',
                    categories: [
                        {value: '7141123011', text: 'Men\'s Clothing'},
                        {value: '1040660', text: 'Women\'s Clothing'},
                        {value: '9056922011', text: 'Women\'s Novelty Tops & Tees'},
                        {value: '12035955011', text: 'Men\'s Novelty T-Shirts'},
                        {value: '1040658', text: 'Boys\' Clothing'},
                        {value: '1040664', text: 'Girls\' Clothing'}
                    ]
                },
                'fashion-novelty': {
                    displayName: 'Fashion Novelty',
                    categories: []
                }
            },
            excludeBrands: '-Disney+-Marvel+-Star Wars+-Harry Potter+-Mediaset+-RAI'
        },
        'es': {
            timeFilters: {
                '30days': 'p_n_date_first_available_absolute%3A15196852011',
                '90days': 'p_n_date_first_available_absolute%3A15196853011'
            },
            sellerFilter: 'p_6%3AA1AT7YVPFBWXBL',
            reviewsFilter: 'p_72%3A831271031',
            productTypeKeywords: {
                'tshirt': 'Ligero%2C+Corte+clásico%2C+Manga+de+doble+costura+y+dobladillo+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'premtshirt': 'Camiseta+Premium',
                'hoodie': 'Sudadera+con+Capucha%2C+Corte+Clásico',
                'case': 'Funda+Protectora+para+Teléfono'
            },
            sortOrders: [{
                    value: '',
                    text: 'Predeterminado'
                },
                {
                    value: 'popularity-rank',
                    text: 'Más populares'
                },
                {
                    value: 'date-desc-rank',
                    text: 'Novedades'
                },
                {
                    value: 'review-rank',
                    text: 'Mejor valorados'
                },
                {
                    value: 'price-desc-rank',
                    text: 'Precio: de mayor a menor'
                },
                {
                    value: 'price-asc-rank',
                    text: 'Precio: de menor a mayor'
                }
            ],
            categories: {
                'fashion': {
                    displayName: 'Fashion',
                    categories: [
                        {value: '7141123011', text: 'Men\'s Clothing'},
                        {value: '1040660', text: 'Women\'s Clothing'},
                        {value: '9056922011', text: 'Women\'s Novelty Tops & Tees'},
                        {value: '12035955011', text: 'Men\'s Novelty T-Shirts'},
                        {value: '1040658', text: 'Boys\' Clothing'},
                        {value: '1040664', text: 'Girls\' Clothing'}
                    ]
                },
                'fashion-novelty': {
                    displayName: 'Fashion Novelty',
                    categories: []
                }
            },
            excludeBrands: '-Disney+-Marvel+-Star Wars+-Harry Potter+-Telecinco+-Antena 3'
        },
        'jp': {
            timeFilters: {
                '30days': 'p_n_date_first_available_absolute%3A15196852011',
                '90days': 'p_n_date_first_available_absolute%3A15196853011'
            },
            sellerFilter: 'p_6%3AAN1VRQENFRJN5',
            reviewsFilter: 'p_72%3A2240292051',
            productTypeKeywords: {
                'tshirt': '軽量%2C+クラシックフィット%2C+ダブルニードル袖と裾+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'premtshirt': 'プレミアムシャツ',
                'hoodie': 'パーカー%2C+クラシックフィット',
                'case': 'スマートフォン用保護ケース'
            },
            sortOrders: [{
                    value: '',
                    text: 'デフォルト'
                },
                {
                    value: 'popularity-rank',
                    text: '人気順'
                },
                {
                    value: 'date-desc-rank',
                    text: '新着順'
                },
                {
                    value: 'review-rank',
                    text: '評価の高い順'
                },
                {
                    value: 'price-desc-rank',
                    text: '価格が高い順'
                },
                {
                    value: 'price-asc-rank',
                    text: '価格が安い順'
                }
            ],
            categories: {
                'fashion': {
                    displayName: 'Fashion',
                    categories: [
                        {value: '7141123011', text: 'Men\'s Clothing'},
                        {value: '1040660', text: 'Women\'s Clothing'},
                        {value: '9056922011', text: 'Women\'s Novelty Tops & Tees'},
                        {value: '12035955011', text: 'Men\'s Novelty T-Shirts'},
                        {value: '1040658', text: 'Boys\' Clothing'},
                        {value: '1040664', text: 'Girls\' Clothing'}
                    ]
                },
                'fashion-novelty': {
                    displayName: 'Fashion Novelty',
                    categories: []
                }
            },
            excludeBrands: '-Disney+-Marvel+-Star Wars+-Harry Potter+-ドラゴンボール+-ワンピース+-鬼滅の刃'
        }
};

    // Update time filter radio values based on marketplace
    // Modified updateMarketplaceFilters function
function updateMarketplaceFilters() {
  const marketplace = marketplaceSelect.value;
  const department = departmentSelect.value;
  const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
  
  // Get department-specific config if available
  const deptConfig = (department && config.departmentSettings && config.departmentSettings[department]) 
    ? config.departmentSettings[department] 
    : null;

  // Update time filters
  document.getElementById('timeFilter30Days').value = deptConfig?.timeFilters?.['30days'] || config.timeFilters['30days'];
  document.getElementById('timeFilter90Days').value = deptConfig?.timeFilters?.['90days'] || config.timeFilters['90days'];

  // Update seller filter
  document.getElementById('sellerAmazon').value = deptConfig?.sellerFilter || config.sellerFilter;
  
  // Update reviews filter
  document.getElementById('reviewsFilter').value = deptConfig?.reviewsFilter || config.reviewsFilter;

  // Update sort options
  updateSortOrderOptions();
  updateCategoryOptions();
}

    // Modified updateSortOrderOptions
function updateSortOrderOptions() {
  const marketplace = marketplaceSelect.value;
  const department = departmentSelect.value;
  const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
  
  // Get department-specific sort options if available
  const sortOptions = (department && config.departmentSettings?.[department]?.sortOrders)
    ? config.departmentSettings[department].sortOrders
    : config.sortOrders;

  const sortOrderSelect = document.getElementById('sortOrder');
  sortOrderSelect.innerHTML = '';
  
  sortOptions.forEach(option => {
    const optionEl = document.createElement('option');
    optionEl.value = option.value;
    optionEl.textContent = option.text;
    sortOrderSelect.appendChild(optionEl);
  });
}

    function updateDepartmentFromProductType() {
  const productType = productTypeSelect.value;
  const currentDept = departmentSelect.value;
  
  // If a department mapping exists for this product type, and department isn't already set
  if (productTypeToDepartment[productType]) {
    // Only suggest the department if it's available in the current marketplace
    const marketplace = marketplaceSelect.value;
    const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
    
    if (config.categories && config.categories[productTypeToDepartment[productType]]) {
      // Set the department select
      departmentSelect.value = productTypeToDepartment[productType];
      
      // Update dependent UI elements
      updateCategoryOptions();
      updateGeneratedUrl();
      updateMarketplaceFilters();
    }
  }
}

// Replace departmentToProductType with marketplace-based handling
function updateProductTypeFromDepartment() {
  const department = departmentSelect.value;
  const marketplace = marketplaceSelect.value;
  const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
  
  if (config.productTypeMappings && department in config.productTypeMappings) {
    const suggestedProductType = config.productTypeMappings[department];
    if (productTypeSelect.querySelector(`option[value="${suggestedProductType}"]`)) {
      productTypeSelect.value = suggestedProductType;
      updateProductTypeSettings();
      updateGeneratedUrl();
    }
  }
}

    function setupClearSearchButton() {
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    
    // Show/hide clear button based on input content
    searchInput.addEventListener('input', function() {
                if (this.value.length > 0) {
                    clearSearchBtn.style.display = 'block';
                } else {
                    clearSearchBtn.style.display = 'none';
                }
            });
            
            // Clear the input when X is clicked
            clearSearchBtn.addEventListener('click', function() {
                searchInput.value = '';
                this.style.display = 'none';
                searchInput.focus();
                updateGeneratedUrl(); // Update the generated URL after clearing
            });
        }

    // Ensure the result URL container is visible
    resultUrlContainer.style.display = 'block';

    // Generate initial URL
    updateGeneratedUrl();

    // Initialize the UI
    init();

    // Make sure the URL container is visible by default
    function init() {
        // Populate departments first
        populateDepartments();

        // Update ZIP code display
        updateZipCode();

        // Update marketplace-specific filters
        updateMarketplaceFilters();

        // Update sort order options
        updateSortOrderOptions();

        // Set up event listeners
        setupEventListeners();

        // Search Form Clear Button
        setupClearSearchButton();

        // Set up department/category box visibility and state
        updateDepartmentCategoryState();

        // Set up price input constraints
        setupPriceInputs();

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
  // Keep all existing event listeners
  searchForm.addEventListener('submit', handleFormSubmit);
  searchForm.addEventListener('reset', function() {
    document.getElementById('clearSearchBtn').style.display = 'none';
    updateGeneratedUrl();
  });
  copyUrlBtn.addEventListener('click', handleCopyUrl);
  copyZipBtn.addEventListener('click', handleCopyZip);
  document.getElementById('searchInput').addEventListener('input', updateGeneratedUrl);
  document.getElementById('customHiddenKeywords').addEventListener('input', updateGeneratedUrl);
  document.getElementById('minPrice').addEventListener('input', updateGeneratedUrl);
  document.getElementById('maxPrice').addEventListener('input', updateGeneratedUrl);

  marketplaceSelect.addEventListener('change', function() {
    updateZipCode();
    updateMarketplaceFilters();
    populateDepartments();
    updateSortOrderOptions();
    updateGeneratedUrl();
  });

  productTypeSelect.addEventListener('change', function() {
    updateProductTypeSettings();
    updateDepartmentFromProductType();
    updateDepartmentCategoryState();
    updateGeneratedUrl();
  });

  departmentSelect.addEventListener('change', function() {
      updateCategoryOptions();
      updateMarketplaceFilters(); 
      updateProductTypeFromDepartment();
      updateGeneratedUrl();
    });

  categorySelect.addEventListener('change', updateGeneratedUrl);
  document.getElementById('sortOrder').addEventListener('change', updateGeneratedUrl);

  const timeFilters = document.querySelectorAll('input[name="timeFilter"]');
  timeFilters.forEach(radio => {
    radio.addEventListener('click', updateGeneratedUrl);
  });

  document.getElementById('sellerAmazon').addEventListener('click', updateGeneratedUrl);
  document.getElementById('reviewsFilter').addEventListener('click', updateGeneratedUrl);
  document.getElementById('filterExcludeBrands').addEventListener('click', updateGeneratedUrl);
}

    function setupPriceInputs() {
        // Add input constraints for price fields
        [minPriceInput, maxPriceInput].forEach(input => {
            // Only allow digits and limit to 2 characters
            input.addEventListener('input', function(e) {
                // Remove any non-digit characters
                this.value = this.value.replace(/\D/g, '');

                // Limit to 2 digits
                if (this.value.length > 6) {
                    this.value = this.value.slice(0, 6);
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
        const marketplace = marketplaceSelect.value;
        const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
        
        if (!department) {
            categorySelect.disabled = true;
        } else {
            const categories = config.categories && config.categories[department] ? config.categories[department] : [];
            if (categories.length === 0) {
                categorySelect.disabled = true;
                categorySelect.value = "";
            } else {
                categorySelect.disabled = false;
            }
        }
    }

    // Ensure category properly updates URL
    function updateCategoryOptions() {
        const marketplace = marketplaceSelect.value;
        const department = departmentSelect.value;
        const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
        categorySelect.innerHTML = '<option value="">No Category Filter</option>';
        
        if (!department) {
            categorySelect.disabled = true;
            return;
        }
        
        const categories = config.categories && config.categories[department] && config.categories[department].categories ? 
                           config.categories[department].categories : [];
        
        if (categories.length === 0) {
            categorySelect.disabled = true;
            categorySelect.value = "";
        } else {
            categorySelect.disabled = false;
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.value;
                option.textContent = category.text;
                categorySelect.appendChild(option);
            });
        }
        updateGeneratedUrl();
    }

    function updateProductTypeSettings() {
  // This function should handle product type specific UI updates
  // For now we can implement a basic version
  const productType = productTypeSelect.value;
  console.log('Product type updated:', productType);
  // Additional functionality can be added based on requirements
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

        let hiddenKeywords = [];
    const customKeywords = document.getElementById('customHiddenKeywords').value.trim();
    if (customKeywords) {
        hiddenKeywords.push(customKeywords);
    }
    
    const productType = productTypeSelect.value;
    if (productType !== 'custom' && config.productTypeKeywords && config.productTypeKeywords[productType]) {
        hiddenKeywords.push(config.productTypeKeywords[productType]);
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
