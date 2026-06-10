/**
 * Professional EN/AR product copy for export beverage machinery (EU/US market tone).
 */
const cfg = require('./seo-config');

const BRAND = 'Medium Beverage Machinery';

const SECTION = {
  overview: { en: 'Overview', ar: 'نظرة عامة' },
  features: { en: 'Key Features', ar: 'الميزات الرئيسية' },
  applications: { en: 'Applications', ar: 'مجالات الاستخدام' },
  productDescription: { en: 'Product Description', ar: 'وصف المنتج' },
  technicalSpecs: { en: 'Technical Specifications', ar: 'المواصفات الفنية' }
};

/** @type {Record<string, { overviewEn: string, overviewAr: string, featuresEn: string[], featuresAr: string[], applicationsEn: string, applicationsAr: string }>} */
const CATEGORY_COPY = {
  '5jialundatongshui': {
    overviewEn:
      'export-grade 5-gallon (18.9 L) barrel water filling line with decapping, internal rinsing, filling and capping stations',
    overviewAr: 'خط تعبئة مياه براميل 5 جالون (18.9 لتر) للتصدير مع فك الأغطية والشطف الداخلي والتعبئة والإغلاق',
    featuresEn: [
      'Automatic barrel decapping, multi-stage internal rinsing and hygienic filling sequence',
      'SS304/316 liquid-contact parts suitable for drinking-water production',
      'PLC control with production counter, alarm logging and easy operator interface',
      'Configurable output for 3–5 gallon PC barrels used in office and residential delivery',
      'Compact layout for water plants exporting to Middle East, Africa and Latin America'
    ],
    featuresAr: [
      'فك أغطية أوتوماتيكي وشطف داخلي متعدد المراحل وتسلسل تعبئة صحي',
      'أجزاء ملامسة للسوائل من SS304/316 مناسبة لإنتاج مياه الشرب',
      'تحكم PLC مع عداد إنتاج وتسجيل إنذارات وواجهة تشغيل سهلة',
      'طاقة إنتاج قابلة للضبط لبراميل PC 3–5 جالون المستخدمة في التوزيع',
      'تخطيط مدمج لمصانع المياه المصدرة إلى الشرق الأوسط وأفريقيا وأمريكا اللاتينية'
    ],
    applicationsEn:
      'Bottled water distributors, commercial hydration suppliers and export-oriented barrel water factories.',
    applicationsAr: 'موزعو المياه المعبأة وموردو الترطيب التجاري ومصانع مياه البراميل الموجهة للتصدير.'
  },
  chunjinshui: {
    overviewEn: 'purified water rinse-fill-cap monoblock for PET bottles from 200 ml to 2 L',
    overviewAr: 'خط غسل-تعبئة-إغلاق متكامل للمياه النقية في زجاجات PET من 200 مل إلى 2 لتر',
    featuresEn: [
      'Three-in-one design: rinsing, gravity filling and screw capping in one frame',
      'Neck-handling starwheel for fast bottle format changeover',
      'Fill-level accuracy suitable for retail purified water brands',
      'CIP-ready piping and sanitary valve arrangement',
      'Turnkey interface with water treatment, labeling and packaging equipment'
    ],
    featuresAr: [
      'تصميم ثلاثي الوظائف: الشطف والتعبئة بالجاذبية ولفع البراغي في إطار واحد',
      'نجمة نقل بالعنق لتغيير سريع لصيغة الزجاجة',
      'دقة مستوى تعبئة مناسبة لعلامات المياه النقية التجارية',
      'أنابيب جاهزة للتنظيف CIP وترتيب صمامات صحي',
      'واجهة متكاملة مع معالجة المياه والملصقات ومعدات التغليف'
    ],
    applicationsEn: 'Purified water bottlers, contract manufacturers and greenfield export water plants.',
    applicationsAr: 'معبئو المياه النقية والمصنعون بعقود التصنيع ومصانع المياه الجديدة للتصدير.'
  },
  kuangquanshui: {
    overviewEn: 'mineral water filling monoblock engineered for stable PET bottling capacity',
    overviewAr: 'خط تعبئة مياه معدنية متكامل مصمم لطاقة تعبئة PET مستقرة',
    featuresEn: [
      'Gentle filling valves protect mineral water characteristics and clarity',
      'Hygienic rinser with adjustable spray time for dust and particle removal',
      'Magnetic torque capping for consistent seal integrity',
      'Modular capacity from 2,000 to 36,000 bottles per hour (500 ml basis)',
      'Export documentation, installation support and spare-parts availability'
    ],
    featuresAr: [
      'صمامات تعبئة لطيفة تحافظ على خصائص ووضوح المياه المعدنية',
      'غسالة صحية مع زمن رش قابل للضبط لإزالة الغبار والجسيمات',
      'إغلاق عزم مغناطيسي لسلامة إحكام متسقة',
      'طاقة معيارية من 2000 إلى 36000 زجاجة/ساعة (أساس 500 مل)',
      'وثائق تصدير ودعم تركيب وتوفر قطع الغيار'
    ],
    applicationsEn: 'Natural mineral water brands, spring water producers and regional bottling groups.',
    applicationsAr: 'علامات المياه المعدنية الطبيعية ومنتجو المياه الينابيع ومجموعات التعبئة الإقليمية.'
  },
  shuiguanzhuangji: {
    overviewEn: 'PET water filling monoblock for high-speed still-water production',
    overviewAr: 'خط تعبئة مياه PET متكامل لإنتاج المياه الساكنة عالي السرعة',
    featuresEn: [
      'Integrated rinser-filler-capper with synchronized carousel drive',
      'Low-oxygen filling option for extended shelf-life water products',
      'Quick-change parts for 500 ml to 1.5 L mainstream formats',
      'Efficient utilities consumption for emerging-market plant economics',
      'Compatible with shrink sleeve, OPP and adhesive labeling lines'
    ],
    featuresAr: [
      'غسالة-معبئة-مغلقة متكاملة مع محرك دوار متزامن',
      'خيار تعبئة منخفض الأكسجين لمنتجات مياه طويلة الصلاحية',
      'قطع تغيير سريع لصيغ 500 مل إلى 1.5 لتر',
      'استهلاك مرافق فعال لاقتصاديات المصانع في الأسواق الناشئة',
      'متوافق مع خطوط الأكمام والملصقات اللاصقة'
    ],
    applicationsEn: 'Mainstream PET water lines, co-packers and capacity expansion projects.',
    applicationsAr: 'خطوط مياه PET الرئيسية والتعبئة التعاقدية ومشاريع توسعة الطاقة.'
  },
  dapinshui: {
    overviewEn: 'large-format PET water filling system for 3 L to 10 L bottles',
    overviewAr: 'نظام تعبئة مياه PET للزجاجات الكبيرة من 3 إلى 10 لتر',
    featuresEn: [
      'Heavy-bottle handling with reinforced conveyor and gripper design',
      '180° bottle rinsing option for large-format hygiene requirements',
      'Mass-flow or gravity filling based on bottle size and product',
      'Production flexibility for household and HoReCa large-bottle water',
      'Robust frame suitable for continuous multi-shift operation'
    ],
    featuresAr: [
      'مناولة زجاجات ثقيلة مع ناقل وماسك معزز',
      'خيار شطف 180° لمتطلبات النظافة للزجاجات الكبيرة',
      'تعبئة تدفق كتلي أو جاذبية حسب حجم الزجاجة والمنتج',
      'مرونة إنتاج لمياه الزجاجات الكبيرة المنزلية والمطاعم والفنادق',
      'إطار قوي مناسب للتشغيل المستمر متعدد الورديات'
    ],
    applicationsEn: 'Large-bottle drinking water, cooking water and regional bulk retail formats.',
    applicationsAr: 'مياه الشرب بالزجاجات الكبيرة ومياه الطهي وصيغ البيع بالتجزئة الإقليمية.'
  },
  datongshuiguanzhuangji: {
    overviewEn: 'barrel and large-container water filling equipment for distribution networks',
    overviewAr: 'معدات تعبئة مياه البراميل والحاويات الكبيرة لشبكات التوزيع',
    featuresEn: [
      'Designed for reusable PC barrels and large PET containers',
      'Sanitary filling head with drip-free shut-off',
      'Operator-safe guarding and step-by-step HMI prompts',
      'Integration with ozone or UV sanitation modules',
      'Field-proven components for tropical and dusty climates'
    ],
    featuresAr: [
      'مصمم لبراميل PC القابلة لإعادة الاستخدام وحاويات PET الكبيرة',
      'رأس تعبئة صحي مع إغلاق خالٍ من التسرب',
      'حماية آمنة للمشغل وتعليمات HMI خطوة بخطوة',
      'تكامل مع وحدات التعقيم بالأوزون أو الأشعة فوق البنفسجية',
      'مكونات ميدانية مجربة للمناخات الاستوائية والغبارية'
    ],
    applicationsEn: 'Water delivery companies, campus hydration and commercial dispenser supply.',
    applicationsAr: 'شركات توصيل المياه والترطيب الجامعي وتوريد موزعات المياه التجارية.'
  },
  guozhiyinliao: {
    overviewEn: 'juice and still-beverage PET filling line with hygienic processing layout',
    overviewAr: 'خط تعبئة عصير ومشروبات ساكنة PET مع تخطيط معالجة صحي',
    featuresEn: [
      'Hot-fill or ambient-fill configurations for NFC and concentrate-based juices',
      'CIP circuit and product recovery for flavor changeover',
      'Accurate fill tolerance for retail and private-label juice brands',
      'SS304/316 product path with FDA/EU food-contact compatible materials',
      'Line balancing support for labeling, date coding and secondary packaging'
    ],
    featuresAr: [
      'تكوينات تعبئة حارة أو بدرجة حرارة الغرفة للعصائر الطازجة والمركزة',
      'دائرة CIP واسترداد المنتج لتغيير النكهات',
      'تسامح تعبئة دقيق لعلامات العصير التجارية والخاصة',
      'مسار منتج SS304/316 بمواد متوافقة مع ملامسة الغذاء',
      'دعم موازنة الخط للملصقات وترميز التاريخ والتغليف الثانوي'
    ],
    applicationsEn: 'Fruit juice bottlers, nectar producers and beverage co-manufacturers.',
    applicationsAr: 'معبئو عصير الفاكهة ومنتجو الرحيق والتصنيع المشترك للمشروبات.'
  },
  guozhiguanzhuangji: {
    overviewEn: 'fruit juice rinse-fill-cap monoblock for medium-speed PET bottling',
    overviewAr: 'خط غسل-تعبئة-إغلاق متكامل لعصير الفاكهة لتعبئة PET متوسطة السرعة',
    featuresEn: [
      'RCGF-type monoblock integrating rinser, filler and capper in one base',
      'Fill valves suitable for low to medium viscosity juice products',
      'Automatic cap orienter and missing-cap detection',
      'Production data logging for QA traceability',
      'Compact footprint for existing beverage plant retrofits'
    ],
    featuresAr: [
      'خط RCGF متكامل يجمع الغسالة والمعبئة والمغلقة في قاعدة واحدة',
      'صمامات تعبئة مناسبة لعصائر اللزوجة المنخفضة إلى المتوسطة',
      'موجه أغطية أوتوماتيكي وكشف الأغطية المفقودة',
      'تسجيل بيانات الإنتاج لتتبع الجودة',
      'بصمة مدمجة لتعديلات مصانع المشروبات القائمة'
    ],
    applicationsEn: 'Juice filling plants, private-label beverage lines and export fruit-drink projects.',
    applicationsAr: 'مصانع تعبئة العصير وخطوط المشروبات الخاصة ومشاريع مشروبات الفاكهة للتصدير.'
  },
  hanqiyinliao: {
    overviewEn: 'carbonated soft drink (CSD) isobaric filling line for PET production',
    overviewAr: 'خط تعبئة متساوي الضغط للمشروبات الغازية PET',
    featuresEn: [
      'Isobaric filling technology for CO₂-saturated beverages',
      'Temperature and pressure management for stable carbonation',
      'Anti-foam filling valves for sparkling water and soft drinks',
      'Compatible with chiller, mixer and carbonator upstream equipment',
      'Safety interlocks and over-pressure protection for operator safety'
    ],
    featuresAr: [
      'تقنية تعبئة متساوية الضغط للمشروبات المشبعة بثاني أكسيد الكربون',
      'إدارة الحرارة والضغط لتثبيت التكربن',
      'صمامات تعبئة مضادة للرغوة للمياه الفوارة والمشروبات الغازية',
      'متوافق مع المبرد والخلاط والمكربن في خط الإنتاج',
      'أقفال أمان وحماية من الضغط الزائد لسلامة المشغل'
    ],
    applicationsEn: 'CSD bottlers, sparkling water brands and energy-drink co-packers.',
    applicationsAr: 'معبئو المشروبات الغازية وعلامات المياه الفوارة والتعبئة المشتركة لمشروبات الطاقة.'
  },
  hqylgzj: {
    overviewEn: 'isobaric carbonated beverage filler for high-efficiency CSD bottling',
    overviewAr: 'معبئة مشروبات غازية متساوية الضغط لتعبئة CSD عالية الكفاءة',
    featuresEn: [
      'Electronic or mechanical isobaric valves for precise fill levels',
      'Low product loss during start/stop and flavor changeover',
      'Robust crown-cap or sport-cap handling options',
      'Synchronized operation with air conveyor and cap feeder',
      'Designed for Middle East and African CSD market specifications'
    ],
    featuresAr: [
      'صمامات متساوية الضغط إلكترونية أو ميكانيكية لمستويات تعبئة دقيقة',
      'فقدان منتج منخفض عند البدء/الإيقاف وتغيير النكهة',
      'خيارات معالجة أغطية تاجية أو رياضية',
      'تشغيل متزامن مع ناقل الهواء ومغذي الأغطية',
      'مصمم لمواصفات سوق CSD في الشرق الأوسط وأفريقيا'
    ],
    applicationsEn: 'Carbonated beverage factories upgrading capacity or launching new SKUs.',
    applicationsAr: 'مصانع المشروبات الغازية التي ترفع الطاقة أو تطلق منتجات جديدة.'
  },
  yilaguanyinliao: {
    overviewEn: 'aseptic PET filling system for extended-shelf-life juice and dairy-style drinks',
    overviewAr: 'نظام تعبئة PET معقم لعصائر ومشروبات ألبان طويلة الصلاحية',
    featuresEn: [
      'Sterile filling zone with HEPA air filtration and positive pressure',
      'Suitable for ambient-distribution juice and UHT-compatible products',
      'Minimal manual intervention to maintain aseptic conditions',
      'Integrated CIP/SIP protocols for validated cleaning cycles',
      'Compliance-oriented design for export QA requirements'
    ],
    featuresAr: [
      'منطقة تعبئة معقمة مع ترشيح HEPA وضغط إيجابي',
      'مناسب لعصائر التوزيع بدرجة حرارة الغرفة ومنتجات متوافقة مع UHT',
      'تدخل يدوي محدود للحفاظ على الظروف المعقمة',
      'بروتوكولات CIP/SIP متكاملة لدورات تنظيف معتمدة',
      'تصميم موجه للامتثال لمتطلبات الجودة للتصدير'
    ],
    applicationsEn: 'Aseptic juice producers, ambient logistics chains and sterile beverage exporters.',
    applicationsAr: 'منتجو العصير المعقم وسلاسل اللوجستيات بدرجة حرارة الغرفة ومصدرو المشروبات المعقمة.'
  },
  bolipinyinliao: {
    overviewEn: 'glass bottle beverage filling line for wine, spirits and premium drinks',
    overviewAr: 'خط تعبئة مشروبات بالزجاجات للنبيذ والمشروبات الروحية والمشروبات الفاخرة',
    featuresEn: [
      'Gentle bottle handling to protect glass containers on high-speed lines',
      'Vacuum or level filling for still and lightly carbonated products',
      'Crown, ROPP or screw-cap capping solutions',
      'Explosion-proof options available for alcoholic beverages',
      'Classic European-style engineering for established drink categories'
    ],
    featuresAr: [
      'مناولة لطيفة للزجاجات لحماية الحاويات على الخطوط عالية السرعة',
      'تعبئة تفريغ أو مستوى للمنتجات الساكنة وقليلة التكربن',
      'حلول إغلاق تاجية أو ROPP أو لولبية',
      'خيارات مقاومة للانفجار متاحة للمشروبات الكحولية',
      'هندسة أوروبية كلاسيكية لفئات المشروبات الراسخة'
    ],
    applicationsEn: 'Wineries, distilleries, glass-bottle juice and premium beverage producers.',
    applicationsAr: 'مصانع النبيذ والتقطير وعصائر الزجاج والمشروبات الفاخرة.'
  },
  pijiuguanzhuangji: {
    overviewEn: 'beer filling machine for glass and PET brewery bottling applications',
    overviewAr: 'آلة تعبئة بيرة لتطبيقات تعبئة المصانع بالزجاج وPET',
    featuresEn: [
      'Foam control and oxygen pickup reduction for beer quality',
      'Isobaric or counter-pressure filling for carbonated beer',
      'CIP-ready design aligned with brewery sanitation standards',
      'Configurable for longneck, steinie and specialty bottle formats',
      'Installation and commissioning support for greenfield breweries'
    ],
    featuresAr: [
      'التحكم في الرغوة وتقليل امتصاص الأكسجين لجودة البيرة',
      'تعبئة متساوية الضغط أو مضادة للضغط للبيرة المكربنة',
      'تصميم جاهز CIP متوافق مع معايير نظافة المصانع',
      'قابل للتكوين لصيغ الزجاجات الطويلة والخاصة',
      'دعم التركيب والتشغيل للمصانع الجديدة'
    ],
    applicationsEn: 'Craft and industrial breweries expanding bottled beer distribution.',
    applicationsAr: 'مصانع البيرة الحرفية والصناعية التي توسع توزيع البيرة المعبأة.'
  },
  gzjscx: {
    overviewEn: 'turnkey beverage production line covering filling, labeling and end-of-line packaging',
    overviewAr: 'خط إنتاج مشروبات متكامل يشمل التعبئة والملصقات والتغليف النهائي',
    featuresEn: [
      'Line engineering from bottle feeding to palletizing',
      'Synchronized control across filler, labeler, shrink wrapper and case packer',
      'Capacity studies and layout drawings for greenfield plants',
      'Utility planning for compressed air, water and electrical loads',
      'Single-source project management for international buyers'
    ],
    featuresAr: [
      'هندسة الخط من تغذية الزجاجات إلى التحميل على المنصات',
      'تحكم متزامن عبر المعبئة والملصق والتغليف بالتقلص ومحزم الصناديق',
      'دراسات الطاقة ومخططات التخطيط للمصانع الجديدة',
      'تخطيط المرافق للهواء المضغوط والمياه والأحمال الكهربائية',
      'إدارة مشروع من مصدر واحد للمشترين الدوليين'
    ],
    applicationsEn: 'Turnkey bottling investors, beverage groups and EPC contractors worldwide.',
    applicationsAr: 'مستثمرو التعبئة المتكاملة ومجموعات المشروبات ومقاولو EPC حول العالم.'
  },
  shuichulishebei: {
    overviewEn: 'water treatment and pre-treatment equipment for beverage and bottling plants',
    overviewAr: 'معدات معالجة المياه والمعالجة المسبقة لمصانع المشروبات والتعبئة',
    featuresEn: [
      'RO, multimedia filtration and UV/ozone sanitation modules',
      'Pre-treatment for purified, mineral and ingredient water streams',
      'Stainless skid mounting for hygienic plant environments',
      'Automation with conductivity, flow and pressure monitoring',
      'Sized for 1,000 to 50,000 L/h permeate capacity ranges'
    ],
    featuresAr: [
      'وحدات RO وترشيح متعدد الوسائط وتعقيم UV/أوزون',
      'معالجة مسبقة لتيارات المياه النقية والمعدنية ومياه المكونات',
      'تركيب على هيكل ستانلس لبيئات المصانع الصحية',
      'أتمتة مع مراقبة التوصيل والتدفق والضغط',
      'مقاس لنطاقات طاقة نفاذ 1000 إلى 50000 لتر/ساعة'
    ],
    applicationsEn: 'Bottled water plants, beverage concentrate dilution and utility water systems.',
    applicationsAr: 'مصانع المياه المعبأة وتخفيف مركزات المشروبات وأنظمة مياه المرافق.'
  },
  chuipingji: {
    overviewEn: 'PET stretch blow molding machine for in-house bottle production',
    overviewAr: 'آلة نفخ PET للإنتاج الداخلي للزجاجات',
    featuresEn: [
      'Two-step reheat blow process for crystal-clear PET bottles',
      'Mold quick-change for multiple bottle weights and neck finishes',
      'Energy-efficient infrared oven with zone temperature control',
      'Linkage ready for air conveyor to downstream filler',
      'Stable output for water, CSD and juice bottle formats'
    ],
    featuresAr: [
      'عملية نفخ إعادة تسخين ثنائية المرحلة لزجاجات PET شفافة',
      'تغيير قالب سريع لأوزان زجاجات وتشطيبات عنق متعددة',
      'فرن أشعة تحت الحمراء موفر للطاقة مع تحكم حراري بالمناطق',
      'جاهز للربط مع ناقل الهواء للمعبئة اللاحقة',
      'إنتاج مستقر لصيغ مياه ومشروبات غازية وعصير'
    ],
    applicationsEn: 'Integrated bottling plants reducing preform logistics and bottle costs.',
    applicationsAr: 'مصانع التعبئة المتكاملة لتقليل لوجستيات العبوات وتكاليف الزجاجات.'
  },
  tiebiaoji: {
    overviewEn: 'self-adhesive labeling machine for PET, glass and metal beverage containers',
    overviewAr: 'آلة ملصقات لاصقة لحاويات المشروبات PET والزجاج والمعدن',
    featuresEn: [
      'Wrap-around, front-back and multi-station labeling configurations',
      'Synchronized with filler speed for stable line efficiency',
      'Label missing and skew detection for quality assurance',
      'Quick adjustment for round, square and oval containers',
      'Suitable for export brands requiring multilingual labels'
    ],
    featuresAr: [
      'تكوينات ملصقات ملفوفة وأمامية-خلفية ومتعددة المحطات',
      'متزامن مع سرعة المعبئة لكفاءة خط مستقرة',
      'كشف الملصقات المفقودة والانحراف لضمان الجودة',
      'ضبط سريع للحاويات الدائرية والمربعة والبيضاوية',
      'مناسب للعلامات التصديرية التي تتطلب ملصقات متعددة اللغات'
    ],
    applicationsEn: 'Beverage labeling lines, rebranding projects and new SKU launches.',
    applicationsAr: 'خطوط ملصقات المشروبات ومشاريع إعادة العلامة وإطلاق منتجات جديدة.'
  },
  xipingji: {
    overviewEn: 'bottle rinsing machine for pre-fill cleaning in beverage lines',
    overviewAr: 'آلة شطف الزجاجات للتنظيف قبل التعبئة في خطوط المشروبات',
    featuresEn: [
      'Multiple spray zones for dust and particle removal before filling',
      'Optional sterile water or product rinsing modes',
      'Gripper or neck handling for PET and glass bottles',
      'Stainless construction with drip trays and enclosed guarding',
      'Easy integration upstream of monoblock fillers'
    ],
    featuresAr: [
      'مناطق رش متعددة لإزالة الغبار والجسيمات قبل التعبئة',
      'أوضاع شطف اختيارية بمياه معقمة أو بالمنتج',
      'مناولة بالماسك أو العنق لزجاجات PET والزجاج',
      'بناء ستانلس مع صواني التقطيط وحماية مغلقة',
      'تكامل سهل قبل المعبئات المتكاملة'
    ],
    applicationsEn: 'High-hygiene water and juice lines requiring verified bottle cleanliness.',
    applicationsAr: 'خطوط مياه وعصير عالية النظافة تتطلب نظافة زجاجات موثقة.'
  },
  mobaoji: {
    overviewEn: 'shrink wrapping machine for bundled PET bottle packs',
    overviewAr: 'آلة تغليف بالتقلص لحزم زجاجات PET',
    featuresEn: [
      'Film shrink tunnel with adjustable temperature profiles',
      'Handles 2×3, 3×4 and custom pack patterns',
      'PE film cost optimization with reliable seal bars',
      'Conveyor interfaces for case packer or palletizer',
      'Built for tropical warehouse and export logistics conditions'
    ],
    featuresAr: [
      'نفق تقلص فيلم مع ملفات حرارة قابلة للضبط',
      'يتعامل مع أنماط 2×3 و3×4 وحزم مخصصة',
      'تحسين تكلفة فيلم PE مع قضبان إحكام موثوقة',
      'واجهات ناقل لمحزم الصناديق أو الرافعة',
      'مصمم لظروف المستودعات الاستوائية ولوجستيات التصدير'
    ],
    applicationsEn: 'End-of-line packaging for water and CSD multi-packs.',
    applicationsAr: 'تغليف نهائي للحزم المتعددة للمياه والمشروبات الغازية.'
  },
  zhenkongxuangaiji: {
    overviewEn: 'vacuum capping machine for jars and specialty beverage containers',
    overviewAr: 'آلة إغلاق بالتفريغ للبرطمانات وحاويات المشروبات الخاصة',
    featuresEn: [
      'Vacuum sealing extends shelf life for sensitive products',
      'Adjustable torque and vacuum level per cap specification',
      'Automatic cap feeding and missing-cap reject system',
      'SS304 frame suitable for food production areas',
      'Compact design for SME bottling workshops'
    ],
    featuresAr: [
      'الإغلاق بالتفريغ يطيل الصلاحية للمنتجات الحساسة',
      'عزم ومستوى تفريغ قابلان للضبط حسب مواصفات الغطاء',
      'تغذية أغطية أوتوماتيكية ونظام رفض للأغطية المفقودة',
      'إطار SS304 مناسب لمناطق إنتاج الغذاء',
      'تصميم مدمج لورش التعبئة للشركات الصغيرة والمتوسطة'
    ],
    applicationsEn: 'Jam, sauce, functional drinks and specialty food-beverage products.',
    applicationsAr: 'مربى وصلصات ومشروبات وظيفية ومنتجات غذائية-مشروبات خاصة.'
  },
  cuogaiji: {
    overviewEn: 'ROPP aluminum cap sealing machine for glass beverage bottles',
    overviewAr: 'آلة إحكام أغطية ألومنيوم ROPP للزجاجات',
    featuresEn: [
      'Precise thread forming for tamper-evident aluminum caps',
      'Stable capping head pressure for high seal integrity',
      'Quick spindle change for multiple neck standards',
      'Synchronized with glass filler conveyor speed',
      'Low maintenance design for 24/7 production schedules'
    ],
    featuresAr: [
      'تشكيل دقيق للخيوط لأغطية ألومنيوم مضادة للعبث',
      'ضغط رأس إغلاق مستقر لسلامة إحكام عالية',
      'تغيير سريع للمحور لمعايير عنق متعددة',
      'متزامن مع سرعة ناقل معبئة الزجاج',
      'تصميم قليل الصيانة لجداول إنتاج 24/7'
    ],
    applicationsEn: 'Wine, spirits, premium juice and glass-bottle export lines.',
    applicationsAr: 'خطوط تصدير النبيذ والمشروبات الروحية والعصير الفاخر والزجاج.'
  },
  youguanzhuangji: {
    overviewEn: 'cooking oil and viscous liquid filling machine',
    overviewAr: 'آلة تعبئة زيت الطهي والسوائل اللزجة',
    featuresEn: [
      'Positive-displacement or piston fillers for consistent viscous dosing',
      'Drip-free nozzles and drip trays for clean production floors',
      'SS316 contact parts for edible oil compliance',
      'Dust-proof filling zone for long-running shifts',
      'Configurable for 0.5 L to 5 L retail oil bottles'
    ],
    featuresAr: [
      'معبئات إزاحة إيجابية أو مكبسية لجرعات لزجة متسقة',
      'فوهات خالية من التسرب وصواني لتشغيل نظيف',
      'أجزاء ملامسة SS316 متوافقة مع زيت الطهي',
      'منطقة تعبئة مقاومة للغبار لورديات طويلة',
      'قابل للتكوين لزجاجات زيت 0.5 إلى 5 لتر'
    ],
    applicationsEn: 'Edible oil bottlers, sauce producers and viscous food manufacturers.',
    applicationsAr: 'معبئو الزيوت ومنتجو الصلصات ومصنعو الأغذية اللزجة.'
  },
  fegnmiguanzhuangji: {
    overviewEn: 'honey and high-viscosity food filling machine',
    overviewAr: 'آلة تعبئة العسل والأغذية عالية اللزوجة',
    featuresEn: [
      'Gentle pumping system preserves honey texture and quality',
      'Heated hopper option for crystallized or dense products',
      'Accurate weight or volume dosing for retail jars',
      'Sanitary quick-disconnect fittings for cleaning',
      'Suitable for honey, syrup, jam and similar products'
    ],
    featuresAr: [
      'نظام ضخ لطيف يحافظ على قوام وجودة العسل',
      'خيار قادوس ساخن للمنتجات المتبلورة أو الكثيفة',
      'جرعات وزن أو حجم دقيقة للبرطمانات',
      'وصلات سريعة الفك صحية للتنظيف',
      'مناسب للعسل والشراب والمربى ومنتجات مشابهة'
    ],
    applicationsEn: 'Honey packers, specialty food exporters and gourmet product lines.',
    applicationsAr: 'معبئو العسل ومصدرو الأغذية الخاصة وخطوط المنتجات الفاخرة.'
  },
  'qing-jie-ji-guan-zhaung-ji': {
    overviewEn: 'automatic liquid detergent filling machine for bottles and jerrycans',
    overviewAr: 'آلة تعبئة منظفات سائلة أوتوماتيكية للزجاجات والعبوات',
    featuresEn: [
      'Corrosion-resistant wetted parts for alkaline detergents',
      'Drip-free filling nozzles with dive or sub-surface fill modes',
      'Explosion-proof electrical options on request',
      'PLC recipe storage for multiple product viscosities',
      'Export-ready documentation and commissioning support'
    ],
    featuresAr: [
      'أجزاء ملامسة مقاومة للتآكل للمنظفات القلوية',
      'فوهات تعبئة خالية من التسرب مع أوضاع غمر أو تحت السطح',
      'خيارات كهربائية مقاومة للانفجار عند الطلب',
      'تخزين وصفات PLC للزوجات منتجات متعددة',
      'وثائق جاهزة للتصدير ودعم التشغيل'
    ],
    applicationsEn: 'Household chemical fillers, contract packing and private-label detergent brands.',
    applicationsAr: 'معبئو المنظفات المنزلية والتعبئة التعاقدية وعلامات المنظفات الخاصة.'
  },
  'xi-shou-ye-guan-zhuang-ji': {
    overviewEn: 'hand sanitizer and personal-care liquid filling line',
    overviewAr: 'خط تعبئة معقم اليدين والسوائل للعناية الشخصية',
    featuresEn: [
      'Accurate small-volume dosing for 50 ml to 1 L bottles',
      'SS316 product path for hygiene product compliance',
      'Anti-drip nozzles for gel and low-viscosity liquids',
      'Compact monoblock or inline piston filler layouts',
      'Fast delivery configuration for urgent export orders'
    ],
    featuresAr: [
      'جرعات حجم صغير دقيقة لزجاجات 50 مل إلى 1 لتر',
      'مسار منتج SS316 متوافق مع منتجات النظافة',
      'فوهات مضادة للتسرب للجل والسوائل منخفضة اللزوجة',
      'تخطيطات معبئة مكبسية مدمجة أو خطية',
      'تكوين تسليم سريع للطلبات العاجلة للتصدير'
    ],
    applicationsEn: 'Hand sanitizer producers, hotel amenities and healthcare distributors.',
    applicationsAr: 'منتجو معقم اليدين ومستلزمات الفنادق وموزعو الرعاية الصحية.'
  },
  'xiao-du-ji-guan-zhuang-ji': {
    overviewEn: 'disinfectant and sanitizer liquid filling equipment',
    overviewAr: 'معدات تعبئة مطهرات ومعقمات سائلة',
    featuresEn: [
      'Chemical-resistant seals and piping for disinfectant formulas',
      'Peristaltic or piston dosing for accurate fill volumes',
      'Enclosed filling zone with fume management',
      'Batch traceability with PLC production records',
      'Designed for export to institutional and retail channels'
    ],
    featuresAr: [
      'أختام وأنابيب مقاومة للمواد الكيميائية لصيغ المطهرات',
      'جرعات تمعجية أو مكبسية لأحجام تعبئة دقيقة',
      'منطقة تعبئة مغلقة مع إدارة الأبخرة',
      'تتبع الدفعات مع سجلات إنتاج PLC',
      'مصمم للتصدير لقنوات المؤسسات والتجزئة'
    ],
    applicationsEn: 'Disinfectant manufacturers, cleaning product exporters and OEM filling.',
    applicationsAr: 'مصنعو المطهرات ومصدرو منتجات التنظيف والتعبئة OEM.'
  }
};

/** Product-specific overview overrides (relative path -> {en, ar}) */
const PRODUCT_OVERRIDES = {
  '2017/dapinshui_0926/119.html': {
    en: 'Rotary large-bottle water filling machine for 3–10 L PET and plastic bottles, designed for stable multi-shift production.',
    ar: 'آلة تعبئة مياه دوارة للزجاجات الكبيرة 3–10 لتر PET والبلاستيك، مصممة لإنتاج مستقر متعدد الورديات.'
  },
  '2017/dapinshui_0926/120.html': {
    en: 'Linear large-bottle filling line with photoelectric bottle detection and PLC start/stop control.',
    ar: 'خط تعبئة خطي للزجاجات الكبيرة مع كشف زجاجات ضوئي وتحكم PLC للبدء والإيقاف.'
  },
  '2018/dapinshui_1024/195.html': {
    en: 'Rinse-fill-cap monoblock for large-bottle purified and mineral water in PET bottles.',
    ar: 'خط غسل-تعبئة-إغلاق متكامل للمياه النقية والمعدنية بالزجاجات الكبيرة PET.'
  },
  '2018/dapinshui_1024/196.html': {
    en: 'Fully automatic rinse-fill-cap line for large-bottle purified and mineral water production.',
    ar: 'خط غسل-تعبئة-إغلاق أوتوماتيكي بالكامل لإنتاج المياه النقية والمعدنية بالزجاجات الكبيرة.'
  },
  '2018/dapinshui_1024/197.html': {
    en: 'Automatic large-bottle line integrating rinsing, filling and capping in one synchronized frame.',
    ar: 'خط أوتوماتيكي للزجاجات الكبيرة يدمج الشطف والتعبئة والإغلاق في إطار متزامن واحد.'
  },
  '2018/dapinshui_1024/198.html': {
    en: 'Large-bottle three-in-one machine for rinsing, filling and capping mineral or purified water.',
    ar: 'آلة ثلاثية الوظائف للزجاجات الكبيرة لشطف وتعبئة وإغلاق المياه المعدنية أو النقية.'
  },
  '2018/dapinshui_1008/164.html': {
    en: 'Large-bottle water filler with integrated rinsing, filling and capping for PET bottles.',
    ar: 'معبئة مياه للزجاجات الكبيرة مع شطف وتعبئة وإغلاق متكامل لزجاجات PET.'
  },
  '2019/dapinshui_0925/269.html': {
    en: '3–10 L bottle line: bottles rotate 180° for rinsing, then transfer to the filling station.',
    ar: 'خط زجاجات 3–10 لتر: تدور الزجاجات 180° للشطف ثم تنتقل إلى محطة التعبئة.'
  },
  '2019/dapinshui_0925/270.html': {
    en: '5 L rinse-fill-cap monoblock with 180° bottle rinsing and automatic indexing.',
    ar: 'خط غسل-تعبئة-إغلاق 5 لتر مع شطف 180° وفهرسة أوتوماتيكية.'
  },
  '2019/dapinshui_0925/271.html': {
    en: '5 L rotary filler with rinser gripper, 180° sanitizing rotation and PLC control.',
    ar: 'معبئة دوارة 5 لتر مع ماسك شطف ودوران تعقيم 180° وتحكم PLC.'
  },
  '2024/gzjscx_1218/284.html': {
    en: 'Rotary blow-fill-cap monoblock integrating blow molding and filling for water and CSD applications up to 54,000 BPH.',
    ar: 'خط نفخ-تعبئة-غطاء دوار يدمج النفخ والتعبئة لتطبيقات المياه والمشروبات الغازية حتى 54000 زجاجة/ساعة.'
  },
  '2024/gzjscx_1218/285.html': {
    en: 'Isobaric beverage filling line with mechanical or electronic filling valves for juice and carbonated drinks.',
    ar: 'خط تعبئة مشروبات متساوي الضغط بصمامات ميكانيكية أو إلكترونية للعصير والمشروبات الغازية.'
  },
  '2024/gzjscx_1218/286.html': {
    en: 'Ultra-clean rinse-fill-cap monoblock production line, 18,000–54,000 bottles per hour.',
    ar: 'خط إنتاج غسل-تعبئة-إغلاق فائق النظافة، 18000–54000 زجاجة في الساعة.'
  },
  '2024/gzjscx_1218/287.html': {
    en: 'Automatic labeling machine for glass, PET and metal containers in high-speed beverage lines.',
    ar: 'آلة ملصقات أوتوماتيكية لحاويات الزجاج وPET والمعدن في خطوط المشروبات عالية السرعة.'
  },
  '2024/gzjscx_1218/288.html': {
    en: 'Shrink wrapping, case packing and palletizing systems for end-of-line bottle packaging.',
    ar: 'أنظمة تغليف بالتقلص وحزم الصناديق والتحميل على المنصات للتغليف النهائي.'
  },
  '2024/gzjscx_1218/289.html': {
    en: 'Beverage pre-treatment and processing systems for hot-fill and carbonated drink production.',
    ar: 'أنظمة المعالجة المسبقة والمعالجة للمشروبات للتعبئة الحارة وإنتاج المشروبات الغازية.'
  },
  '2020/qing-jie-ji-guan-zhaung-ji_1016/281.html': {
    en: 'Automatic detergent filling machine for bottles and containers with corrosion-resistant product path.',
    ar: 'آلة تعبئة منظفات أوتوماتيكية للزجاجات والحاويات مع مسار منتج مقاوم للتآكل.'
  },
  '2020/xi-shou-ye-guan-zhuang-ji_1016/282.html': {
    en: 'Hand sanitizer filling machine with accurate volume control for retail and institutional packs.',
    ar: 'آلة تعبئة معقم اليدين مع تحكم دقيق بالحجم للعبوات التجارية والمؤسسية.'
  },
  '2020/xiao-du-ji-guan-zhuang-ji_1016/283.html': {
    en: 'Disinfectant filling machine for bottles and containers with enclosed hygienic filling zone.',
    ar: 'آلة تعبئة مطهرات للزجاجات والحاويات مع منطقة تعبئة صحية مغلقة.'
  },
  '2017/chunjinshui_0926/93.html': {
    en: '8-8-3 purified water monoblock with neck-handling conveyor for fast bottle format changeover.',
    ar: 'خط مياه نقية 8-8-3 مع ناقل مناولة بالعنق لتغيير سريع لصيغة الزجاجة.'
  },
  '2017/5jialundatongshui_0926/113.html': {
    en: '5-gallon barrel water filling production line with decapping, rinsing, filling and pressing stations.',
    ar: 'خط إنتاج تعبئة مياه براميل 5 جالون مع محطات فك الأغطية والشطف والتعبئة والضغط.'
  }
};

function formatProductName(raw) {
  let n = (raw || 'Beverage Filling Machine')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .replace(/KIWL/gi, '')
    .trim();
  n = n.replace(/(\d)([A-Za-z])/g, '$1 $2');
  n = n.replace(/([a-z])([A-Z])/g, '$1 $2');
  n = n.replace(/\s+/g, ' ').trim();
  if (!/machine|line|monoblock|filler|equipment|system|plant/i.test(n)) {
    if (/RCGF|QGF|CGF|\d-\d+-\d+/i.test(n)) n += ' Filling Line';
    else n += ' Filling Machine';
  }
  return n;
}

function categorySlugFromRel(rel) {
  const m = rel.match(/\d{4}\/([^/]+)\/\d+\.html$/i);
  if (!m) return null;
  return m[1].replace(/_\d+$/, '');
}

function getCategoryName(slug) {
  if (slug && cfg.CATEGORY[slug]) return cfg.CATEGORY[slug].name;
  return 'Beverage Filling Equipment';
}

function buildContent(productName, slug, rel) {
  const tpl = CATEGORY_COPY[slug] || CATEGORY_COPY.chunjinshui;
  const override = PRODUCT_OVERRIDES[rel];
  const overviewBody = override
    ? override.en
    : `The ${productName} is a ${tpl.overviewEn} supplied by ${BRAND} for international bottling projects. Engineered for reliable daily output, it meets export requirements for hygiene, traceability and after-sales support.`;
  const overviewAr = override
    ? override.ar
    : `يُعد ${productName} ${tpl.overviewAr} توردها ${BRAND} لمشاريع التعبئة الدولية. مصمم لإنتاج يومي موثوق ويلبي متطلبات التصدير للنظافة والتتبع ودعم ما بعد البيع.`;

  const html = [
    `<p><strong>${SECTION.overview.en}</strong><br />${overviewBody}</p>`,
    `<p><strong>${SECTION.features.en}</strong></p>`,
    '<ul>',
    ...tpl.featuresEn.map((f) => `<li>${f}</li>`),
    '</ul>',
    `<p><strong>${SECTION.applications.en}</strong><br />${tpl.applicationsEn}</p>`
  ].join('');

  const i18n = {};
  i18n[SECTION.overview.en] = SECTION.overview.ar;
  i18n[SECTION.features.en] = SECTION.features.ar;
  i18n[SECTION.applications.en] = SECTION.applications.ar;
  i18n[SECTION.productDescription.en] = SECTION.productDescription.ar;
  i18n[overviewBody] = overviewAr;
  tpl.featuresEn.forEach((f, i) => {
    i18n[f] = tpl.featuresAr[i];
  });
  i18n[tpl.applicationsEn] = tpl.applicationsAr;

  return { html, i18n, productName, overviewEn: overviewBody };
}

module.exports = {
  BRAND,
  SECTION,
  CATEGORY_COPY,
  PRODUCT_OVERRIDES,
  formatProductName,
  categorySlugFromRel,
  getCategoryName,
  buildContent
};
