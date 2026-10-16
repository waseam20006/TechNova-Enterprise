import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

export interface Translations {
  [key: string]: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Brand & Top Header
    deliverTo: 'Deliver to',
    allDepartments: 'All Departments',
    searchPlaceholder: 'Search high performance workstation laptops, displays, parts...',
    clearSearch: 'Clear search',
    search: 'Search',
    helloSignIn: 'Hello, Sign in',
    accountAndLists: 'Account & Lists',
    myAccount: 'My Account',
    adminPortal: 'Admin Portal',
    adminDashboard: 'Admin Dashboard',
    returnsAndOrders: 'Returns & Orders',
    cart: 'Cart',
    wishlist: 'Wishlist & Saved Items',
    signOut: 'Sign Out',
    signInCta: 'Sign in to TechNova',
    newCustomer: 'New enterprise customer?',
    startHere: 'Start here.',
    corpCustomer: 'Enterprise Customer',
    corpAdmin: 'Corporate Administrator',

    // Secondary Nav
    navAll: 'All',
    todaysDeals: "Today's Deals",
    customerService: 'Customer Service',
    registry: 'Registry',
    giftCards: 'Gift Cards',
    sell: 'Sell',
    laptopsComputers: 'Laptops & Computers',
    monitorsDisplays: 'Monitors & Displays',
    audioWearables: 'Audio & Wearables',
    enterpriseSolutions: 'Enterprise Solutions',
    bulkProcurement: 'Corporate Bulk Procurement Available',

    // Breadcrumbs & Sorting
    electronics: 'Electronics',
    computersAccessories: 'Computers & Accessories',
    highPerformanceWorkstations: 'High Performance Workstations',
    showingResults: 'Showing',
    resultsFor: 'results for',
    sortBy: 'Sort by:',
    featured: 'Featured',
    priceLowToHigh: 'Price: Low to High',
    priceHighToLow: 'Price: High to Low',
    avgCustomerReview: 'Avg. Customer Review',
    newestArrivals: 'Newest Arrivals',
    gridView: 'Grid view',
    listView: 'List view',

    // Filters Sidebar
    activeFilters: 'Active Filters',
    resetAll: 'Reset All',
    deliveryDay: 'Delivery Day',
    getItTomorrow: 'Get It Tomorrow',
    getItIn2Days: 'Get It in 2 Days',
    department: 'Department',
    brands: 'Brands',
    clear: 'Clear',
    price: 'Price',
    under500: 'Under $500',
    price500to1000: '$500 to $1,000',
    price1000to2000: '$1,000 to $2,000',
    price2000Above: '$2,000 & Above',
    go: 'Go',
    customerReviews: 'Customer Reviews',
    andUp: '& Up',
    systemMemoryRam: 'System Memory (RAM)',
    ram32Above: '32 GB & Above',
    ram64Above: '64 GB & Above',
    ram16: '16 GB',
    noMatchingProducts: 'No matching enterprise hardware found',
    noMatchingDesc: 'No products match the selected filters. Try unchecking criteria or resetting all filters.',
    resetAllFilters: 'Reset All Filters',
    previous: 'Previous',
    next: 'Next',

    // Product Card & Details
    addToCart: 'Add to Cart',
    addedToCart: 'Added to Cart',
    buyNow: 'Buy Now',
    freeOneDayDelivery: 'FREE One-Day Delivery',
    getItBy: 'Get it by',
    tomorrow: 'Tomorrow',
    inStock: 'In Stock',
    onlyLeft: 'Only {count} left in stock - order soon.',
    boughtInPastMonth: 'bought in past month',
    ratingsCount: 'ratings',
    save: 'Save',
    off: 'off',
    listPrice: 'List:',
    technicalSpecs: 'Technical Specifications',
    productOverview: 'Product Overview',
    certifiedHardware: 'Certified Enterprise Hardware',
    quantity: 'Quantity:',
    unit: 'unit',
    units: 'units',
    relatedProducts: 'Related Products in',
    seeAll: 'See all',
    secureSSL: 'Secure SSL 256-bit Transaction',
    shipsDirect: 'Ships directly from TechNova Regional Hub',
    hassleFreeReturn: '30-Day Hassle-Free Enterprise Return Policy',

    // Cart
    shoppingCart: 'Shopping Cart',
    cartEmpty: 'Your TechNova Cart is empty',
    cartEmptyDesc: 'Browse our high-performance hardware inventory, workstation laptops, 5K monitors, and accessories.',
    exploreCatalog: 'Explore Tech Catalog',
    itemDetails: 'Item Details',
    clearAllItems: 'Clear all items from cart',
    orderSummary: 'Order Summary',
    itemsSubtotal: 'Items Subtotal:',
    shippingAndHandling: 'Shipping & Handling:',
    estimatedTax: 'Estimated Tax (8.5%):',
    enterpriseDiscount: 'Enterprise Discount:',
    orderTotal: 'Order Total:',
    promoCodeLabel: 'Enterprise Promo / Coupon Code',
    apply: 'Apply',
    proceedToCheckout: 'Proceed to Checkout',
    poNotice: 'Enterprise purchase orders and Net-30 available at checkout.',
    item: 'item',
    items: 'items',
    free: 'FREE',
    delete: 'Delete',

    // Checkout
    secureCheckout: 'Secure Enterprise Checkout',
    purchasingAs: 'Purchasing as:',
    deliveryDestination: 'Delivery & Corporate Destination',
    fullName: 'Full Contact Name *',
    companyName: 'Company / Organization *',
    streetAddress: 'Street Address / Suite / Floor *',
    city: 'City *',
    state: 'State *',
    zipCode: 'ZIP Code *',
    shippingMethod: 'Shipping Method',
    priorityGround: 'TechNova Priority Ground (Tomorrow, End of Day)',
    groundDesc: 'Fulfilled from regional warehouse with tracking',
    overnightCourier: 'Dedicated Direct Hardware Courier (Tomorrow by 10:30 AM)',
    overnightDesc: 'Includes white-glove pallet handling and signature verification',
    paymentMethod: 'Payment Method',
    net30Invoicing: 'Corporate Net-30 Invoicing',
    net30Desc: 'Pay within 30 days of shipment. Formal PO documentation auto-generated.',
    creditCard: 'Corporate Credit Card',
    wireTransfer: 'Corporate ACH / FedWire Transfer',
    wireDesc: 'Wire instructions sent immediately after order placement.',
    reviewAndPlaceOrder: 'Review & Place Order',
    placeOrderButton: 'Place Your Order',
    processingOrder: 'Processing Order...',
    orderSuccessTitle: 'Order Successfully Placed!',
    orderSuccessDesc: 'Thank you for ordering with TechNova Enterprise. A confirmation email and tax invoice receipt have been sent to',
    orderNumber: 'Order Number:',
    trackingNumber: 'Tracking Number:',
    estimatedDeliveryText: 'Estimated Delivery:',
    paymentTerm: 'Payment Term:',
    totalBilled: 'Total Billed:',
    viewOrders: 'View Your Orders',
    continueShopping: 'Continue Shopping',

    // Orders
    yourEnterpriseOrders: 'Your Enterprise Orders',
    orderHistoryDesc: 'Tracking, invoices, and shipment statuses for account',
    returnToStorefront: '← Return to Storefront',
    noOrdersYet: 'No Orders Placed Yet',
    noOrdersDesc: 'When you purchase workstation laptops, displays, or parts, your order history and tracking numbers will appear here.',
    startShopping: 'Start Shopping',
    orderPlaced: 'Order Placed',
    total: 'Total',
    shipTo: 'Ship To',
    buyItAgain: 'Buy It Again',
    viewItem: 'View Item',
    carrier: 'Carrier: FedEx Express Priority',

    // Wishlist
    savedWishlist: 'Your Saved Hardware Wishlist',
    savedWishlistDesc: 'Keep track of enterprise devices, workstation towers, and accessories for future purchase orders.',
    wishlistEmpty: 'Your wishlist is currently empty',
    wishlistEmptyDesc: 'Click the heart icon on any product card in the catalog to save it to your wishlist.',
    moveToCart: 'Move to Cart',
    remove: 'Remove',
    clearWishlist: 'Clear Wishlist',

    // Auth
    signInTitle: 'Sign in to TechNova',
    emailAddress: 'Email address',
    password: 'Password',
    forgotPassword: 'Forgot your password?',
    signInButton: 'Sign In',
    verifyingCredentials: 'Verifying Credentials...',
    createAccountTitle: 'Create Account',
    createAccountSubtitle: 'Set up your client profile for corporate orders, hardware warranties, and expedited delivery.',
    company: 'Company',
    confirmPassword: 'Re-enter Password *',
    createCustomerButton: 'Create Customer Account',
    creatingAccount: 'Creating Account...',
    alreadyHaveAccount: 'Already have an account?',
    signInLink: 'Sign in',
    termsNotice: "By continuing, you agree to TechNova's Conditions of Use and Privacy Notice.",

    // Admin Dashboard
    adminExecutiveOverview: 'Executive Overview',
    adminProductsCrud: 'Products CRUD',
    adminOrdersManagement: 'Orders Management',
    adminLiveStorefront: 'Live Storefront Preview',
    adminControlConsole: 'Enterprise Control Console',
    totalGrossRevenue: 'Total Gross Revenue',
    vsLastMonth: '+18.4% vs last calendar month',
    enterpriseOrders: 'Enterprise Orders',
    processedCheckout: 'Processed through checkout',
    activeCatalogProducts: 'Active Products',
    liveInStorefront: 'Live in customer storefront',
    lowStockAlerts: 'Low Stock Alerts',
    requireRestock: 'Requires immediate restock',
    allStocked: 'All warehouses fully stocked',
    recentEnterpriseOrders: 'Recent Enterprise Orders',
    viewAllOrders: 'View All',
    adminQuickActions: 'Admin Quick Actions',
    addNewHardwareProduct: 'Add New Hardware System',
    manageStoreCatalog: 'Manage Store Catalog',
    catalogByDepartment: 'Catalog by Department',
    actions: 'Actions',
    inventoryStock: 'Inventory Stock',
    priceCol: 'Price',
    hardwareItem: 'Hardware Item',
    orderIdDate: 'Order ID & Date',
    customerDetails: 'Customer Details',
    shipmentStatus: 'Shipment Status',
    invoice: 'Invoice',
    details: 'Details',
    resetCatalog: 'Reset Catalog',
    editProduct: 'Edit Enterprise Product',
    createProduct: 'Create Product',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',

    // Mobile specific
    mobileMenu: 'Menu',
    mobileFilters: 'Filters',
    close: 'Close',

    // Product Comparison
    compare: 'Compare',
    compareProducts: 'Product Comparison',
    compareSubtitle: 'Side-by-side hardware specifications and pricing analysis',
    compareCount: 'Compare ({count}/3)',
    compareNow: 'Compare Now',
    clearCompare: 'Clear All',
    maxCompareWarning: 'You can compare up to 3 products at a time.',
    selectToCompare: 'Select to compare',
    noProductsInCompare: 'No products selected for comparison yet',
    addProductsToCompareDesc: 'Select "Compare" on up to 3 products across the catalog to analyze them side-by-side.',
    removeProduct: 'Remove',
    differencesOnly: 'Highlight Differences',
    allSpecs: 'All Specifications',
    brand: 'Brand',
    category: 'Category',
    stockStatus: 'Stock Status',
    pricing: 'Pricing',
    rating: 'Customer Rating',
    specsComparison: 'Specifications Comparison',
  },
  ar: {
    // Brand & Top Header
    deliverTo: 'التوصيل إلى',
    allDepartments: 'جميع الأقسام',
    searchPlaceholder: 'ابحث عن أجهزة العمل المحمولة، الشاشات، وقطع الغيار...',
    clearSearch: 'مسح البحث',
    search: 'بحث',
    helloSignIn: 'مرحباً، تسجيل الدخول',
    accountAndLists: 'الحساب والقوائم',
    myAccount: 'حسابي',
    adminPortal: 'بوابة الإدارة',
    adminDashboard: 'لوحة تحكم الإدارة',
    returnsAndOrders: 'المرتجعات والطلبات',
    cart: 'السلة',
    wishlist: 'قائمة الرغبات والمحفوظات',
    signOut: 'تسجيل الخروج',
    signInCta: 'تسجيل الدخول إلى تيك نوفا',
    newCustomer: 'عميل مؤسسي جديد؟',
    startHere: 'ابدأ من هنا.',
    corpCustomer: 'عميل شركات',
    corpAdmin: 'مسؤول النظام التنفيذي',

    // Secondary Nav
    navAll: 'الكل',
    todaysDeals: 'عروض اليوم',
    customerService: 'خدمة العملاء',
    registry: 'السجل المؤسسي',
    giftCards: 'بطاقات الهدايا',
    sell: 'البيع معنا',
    laptopsComputers: 'الحواسيب والمحمولة',
    monitorsDisplays: 'الشاشات والعرض',
    audioWearables: 'الصوتيات والملبوسات',
    enterpriseSolutions: 'حلول المؤسسات',
    bulkProcurement: 'خدمة التوريد المؤسسي بالجملة متاحة',

    // Breadcrumbs & Sorting
    electronics: 'إلكترونيات',
    computersAccessories: 'الحواسيب وملحقاتها',
    highPerformanceWorkstations: 'محطات عمل فائقة الأداء',
    showingResults: 'عرض',
    resultsFor: 'نتائج لـ',
    sortBy: 'ترتيب حسب:',
    featured: 'المميز',
    priceLowToHigh: 'السعر: من الأقل للأعلى',
    priceHighToLow: 'السعر: من الأعلى للأقل',
    avgCustomerReview: 'تقييمات العملاء',
    newestArrivals: 'وصل حديثاً',
    gridView: 'عرض شبكي',
    listView: 'عرض قائمة',

    // Filters Sidebar
    activeFilters: 'الفلاتر النشطة',
    resetAll: 'إعادة ضبط الكل',
    deliveryDay: 'يوم التوصيل',
    getItTomorrow: 'استلمه غداً',
    getItIn2Days: 'استلمه خلال يومين',
    department: 'القسم',
    brands: 'العلامات التجارية',
    clear: 'مسح',
    price: 'السعر',
    under500: 'أقل من 500$',
    price500to1000: '500$ إلى 1,000$',
    price1000to2000: '1,000$ إلى 2,000$',
    price2000Above: '2,000$ فأكثر',
    go: 'انتقال',
    customerReviews: 'تقييمات العملاء',
    andUp: 'فما فوق',
    systemMemoryRam: 'ذاكرة النظام (RAM)',
    ram32Above: '32 جيجابايت فأكثر',
    ram64Above: '64 جيجابايت فأكثر',
    ram16: '16 جيجابايت',
    noMatchingProducts: 'لم يتم العثور على أجهزة مطابقة',
    noMatchingDesc: 'لا توجد منتجات تطابق الفلاتر المحددة. جرب إزالة بعض المعايير أو إعادة ضبط الفلاتر.',
    resetAllFilters: 'إعادة ضبط جميع الفلاتر',
    previous: 'السابق',
    next: 'التالي',

    // Product Card & Details
    addToCart: 'أضف إلى السلة',
    addedToCart: 'تمت الإضافة للسلة',
    buyNow: 'شراء الآن',
    freeOneDayDelivery: 'توصيل مجاني خلال يوم واحد',
    getItBy: 'استلمه بحلول',
    tomorrow: 'غداً',
    inStock: 'متوفر بالمخزون',
    onlyLeft: 'متبقي {count} فقط في المخزون - اطلب قريباً.',
    boughtInPastMonth: 'تم شراؤها في الشهر الماضي',
    ratingsCount: 'تقييم',
    save: 'وفر',
    off: 'خصم',
    listPrice: 'السعر الأصلي:',
    technicalSpecs: 'المواصفات التقنية',
    productOverview: 'نظرة عامة على المنتج',
    certifiedHardware: 'عتاد معتمد للمؤسسات',
    quantity: 'الكمية:',
    unit: 'وحدة',
    units: 'وحدات',
    relatedProducts: 'منتجات ذات صلة في',
    seeAll: 'عرض الكل',
    secureSSL: 'معاملة آمنة بتشفير SSL 256-bit',
    shipsDirect: 'شحن مباشر من مركز تيك نوفا الإقليمي',
    hassleFreeReturn: 'سياسة إرجاع مؤسسي ميسرة خلال 30 يوماً',

    // Cart
    shoppingCart: 'سلة المشتريات',
    cartEmpty: 'سلة تيك نوفا فارغة حالياً',
    cartEmptyDesc: 'استعرض أجهزة العمل الفائقة، الشاشات بدقة 5K، ومستلزمات مراكز البيانات.',
    exploreCatalog: 'تصفح كتالوج الأجهزة',
    itemDetails: 'تفاصيل المنتج',
    clearAllItems: 'إفراغ جميع المنتجات من السلة',
    orderSummary: 'ملخص الطلب',
    itemsSubtotal: 'المجموع الفرعي للمنتجات:',
    shippingAndHandling: 'الشحن والمناولة:',
    estimatedTax: 'الضريبة التقديرية (8.5%):',
    enterpriseDiscount: 'خصم المؤسسات:',
    orderTotal: 'الإجمالي الكلي:',
    promoCodeLabel: 'رمز الخصم المؤسسي أو الكوبون',
    apply: 'تطبيق',
    proceedToCheckout: 'المتابعة لإتمام الطلب',
    poNotice: 'أوامر الشراء المؤسسية وفواتير Net-30 متاحة عند الدفع.',
    item: 'عنصر',
    items: 'عناصر',
    free: 'مجاناً',
    delete: 'حذف',

    // Checkout
    secureCheckout: 'إتمام الطلب المؤسسي الآمن',
    purchasingAs: 'الشراء بواسطة:',
    deliveryDestination: 'وجهة الشحن المؤسسية',
    fullName: 'اسم جهة الاتصال بالكامل *',
    companyName: 'اسم الشركة / المؤسسة *',
    streetAddress: 'عنوان الشارع / الجناح / الطابق *',
    city: 'المدينة *',
    state: 'الولاية / المنطقة *',
    zipCode: 'الرمز البريدي *',
    shippingMethod: 'طريقة الشحن',
    priorityGround: 'شحن تيك نوفا ذو الأولوية (غداً، نهاية اليوم)',
    groundDesc: 'يتم التجهيز مباشرة من المستودع الإقليمي مع رقم تتبع',
    overnightCourier: 'شحن عتاد سريع مباشر ومخصص (غداً قبل 10:30 صباحاً)',
    overnightDesc: 'يشمل مناولة البليتات المباشرة وتأكيد التوقيع الرسمي',
    paymentMethod: 'طريقة الدفع',
    net30Invoicing: 'فاتورة أجل Net-30 للشركات',
    net30Desc: 'السداد خلال 30 يوماً من الشحن. يتم توليد مستندات أمر الشراء تلقائياً.',
    creditCard: 'بطاقة ائتمان الشركات',
    wireTransfer: 'تحويل بنكي / ACH مباشر',
    wireDesc: 'يتم إرسال تعليمات التحويل البنكي فور تأكيد الطلب.',
    reviewAndPlaceOrder: 'مراجعة وتأكيد الطلب',
    placeOrderButton: 'تأكيد الطلب الآن',
    processingOrder: 'جاري معالجة الطلب...',
    orderSuccessTitle: 'تم تأكيد طلبك بنجاح!',
    orderSuccessDesc: 'شكراً لتعاملك مع تيك نوفا للمؤسسات. تم إرسال إشعار التأكيد والفاتورة الضريبية إلى',
    orderNumber: 'رقم الطلب:',
    trackingNumber: 'رقم التتبع:',
    estimatedDeliveryText: 'موعد التسليم المتوقع:',
    paymentTerm: 'شروط السداد:',
    totalBilled: 'إجمالي الفاتورة:',
    viewOrders: 'عرض طلباتك',
    continueShopping: 'متابعة التسوق',

    // Orders
    yourEnterpriseOrders: 'طلباتك المؤسسية',
    orderHistoryDesc: 'متابعة التتبع، الفواتير، وحالات الشحن للحساب',
    returnToStorefront: '← العودة للمتجر الرئيسي',
    noOrdersYet: 'لا توجد طلبات مسجلة بعد',
    noOrdersDesc: 'عند قيامك بشراء محطات العمل، الشاشات، أو القطع، ستظهر تفاصيل شحناتك وأرقام التتبع هنا.',
    startShopping: 'ابدأ التسوق الآن',
    orderPlaced: 'تاريخ الطلب',
    total: 'الإجمالي',
    shipTo: 'الشحن إلى',
    buyItAgain: 'إعادة الطلب',
    viewItem: 'عرض المنتج',
    carrier: 'شركة الشحن: فيديكس إكسبريس أولوية',

    // Wishlist
    savedWishlist: 'قائمة الأجهزة المحفوظة لديك',
    savedWishlistDesc: 'احفظ أجهزة العمل ومحطات التوريد للمراجعة مع الإدارة وأوامر الشراء المستقبلية.',
    wishlistEmpty: 'قائمة الرغبات فارغة حالياً',
    wishlistEmptyDesc: 'انقر على رمز القلب في أي بطاقة منتج بالكتالوج لحفظها في هذه القائمة.',
    moveToCart: 'نقل إلى السلة',
    remove: 'إزالة',
    clearWishlist: 'مسح القائمة',

    // Auth
    signInTitle: 'تسجيل الدخول إلى تيك نوفا',
    emailAddress: 'عنوان البريد الإلكتروني',
    password: 'كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    signInButton: 'تسجيل الدخول',
    verifyingCredentials: 'جاري التحقق من الاعتماد...',
    createAccountTitle: 'إنشاء حساب جديد',
    createAccountSubtitle: 'أنشئ ملف شركتك لطلبات التوريد، الضمان التجاري، والشحن المباشر السريع.',
    company: 'الشركة',
    confirmPassword: 'تأكيد كلمة المرور *',
    createCustomerButton: 'إنشاء حساب العميل',
    creatingAccount: 'جاري إنشاء الحساب...',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    signInLink: 'تسجيل الدخول',
    termsNotice: 'بمتابعتك، فإنك توافق على شروط الاستخدام وإشعار الخصوصية لـ TechNova.',

    // Admin Dashboard
    adminExecutiveOverview: 'نظرة عامة تنفيذية',
    adminProductsCrud: 'إدارة المنتجات (CRUD)',
    adminOrdersManagement: 'إدارة طلبات التوريد',
    adminLiveStorefront: 'معاينة المتجر المباشر',
    adminControlConsole: 'لوحة التحكم المؤسسية',
    totalGrossRevenue: 'إجمالي الإيرادات الكلية',
    vsLastMonth: '+18.4% مقارنة بالشهر السابق',
    enterpriseOrders: 'الطلبات المؤسسية',
    processedCheckout: 'تمت معالجتها عبر منصة الدفع',
    activeCatalogProducts: 'المنتجات النشطة',
    liveInStorefront: 'معروضة بالمتجر المباشر',
    lowStockAlerts: 'تنبيهات انخفاض المخزون',
    requireRestock: 'يتطلب إعادة تعبئة فورية',
    allStocked: 'جميع المستودعات ممتلئة بالكامل',
    recentEnterpriseOrders: 'أحدث طلبات التوريد المؤسسية',
    viewAllOrders: 'عرض الكل',
    adminQuickActions: 'إجراءات الإدارة السريعة',
    addNewHardwareProduct: 'إضافة نظام عتاد جديد',
    manageStoreCatalog: 'إدارة كتالوج المتجر',
    catalogByDepartment: 'الكتالوج حسب الأقسام',
    actions: 'الإجراءات',
    inventoryStock: 'مستوى المخزون',
    priceCol: 'السعر',
    hardwareItem: 'العتاد / النظام',
    orderIdDate: 'رقم وتاريخ الطلب',
    customerDetails: 'بيانات العميل',
    shipmentStatus: 'حالة الشحن',
    invoice: 'الفاتورة',
    details: 'التفاصيل',
    resetCatalog: 'إعادة ضبط الكتالوج',
    editProduct: 'تعديل منتج مؤسسي',
    createProduct: 'إنشاء المنتج',
    saveChanges: 'حفظ التعديلات',
    cancel: 'إلغاء',

    // Mobile specific
    mobileMenu: 'القائمة',
    mobileFilters: 'الفلاتر',
    close: 'إغلاق',

    // Product Comparison
    compare: 'مقارنة',
    compareProducts: 'مقارنة المنتجات',
    compareSubtitle: 'تحليل مقارن جنباً إلى جنب للمواصفات التقنية والأسعار',
    compareCount: 'مقارنة ({count}/3)',
    compareNow: 'قارن الآن',
    clearCompare: 'مسح الكل',
    maxCompareWarning: 'يمكنك مقارنة ما يصل إلى 3 منتجات فقط في المرة الواحدة.',
    selectToCompare: 'حدد للمقارنة',
    noProductsInCompare: 'لم يتم تحديد أي منتجات للمقارنة بعد',
    addProductsToCompareDesc: 'اختر "مقارنة" لما يصل إلى 3 أجهزة من الكتالوج لتحليلها جنباً إلى جنب.',
    removeProduct: 'إزالة',
    differencesOnly: 'تمييز الفروقات فقط',
    allSpecs: 'جميع المواصفات',
    brand: 'العلامة التجارية',
    category: 'القسم',
    stockStatus: 'حالة المخزون',
    pricing: 'السعر',
    rating: 'تقييم العملاء',
    specsComparison: 'مقارنة المواصفات التقنية',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const LANGUAGE_STORAGE_KEY = 'technova_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'ar' || saved === 'en') return saved;
    } catch {
      //
    }
    return 'en';
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      document.documentElement.setAttribute('lang', language);
      document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    } catch (e) {
      console.error(e);
    }
  }, [language, isRTL]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key: string, variables?: Record<string, string | number>): string => {
    let str = translations[language]?.[key] || translations.en[key] || key;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isRTL,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
