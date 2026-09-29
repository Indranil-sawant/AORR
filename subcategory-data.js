/**
 * SUBCATEGORY METADATA STORAGE
 * Separated from main logic to keep data clean.
 * Maps subcategory keys (or top-level keys) to images/descriptions.
 */

const SUBCATEGORY_META = {
    // Top Level Defaults
    machinery_mechanical: {
        image: 'images/industrial-flow-valves.webp',
        description: 'High-precision pressure regulators and industrial valves for fluid control systems.'
    },
    artificial_jewellery: {
        image: 'images/export-garments-textiles.webp',
        description: 'Exquisite imitation jewellery including gold, silver, and stone-studded pieces.'
    },
    
    // Subcategories (Artificial Products)
    decorative: {
        image: 'images/export-garments-textiles.webp',
        description: 'Beautiful artificial flowers and decorative items to enhance any space.'
    },
    hair: {
        image: 'images/export-garments-textiles.webp',
        description: 'Premium quality artificial hair wigs and extensions.'
    },
    
    // Subcategories (Garments)
    knitted: {
        image: 'images/export-garments-textiles.webp',
        description: 'Comfortable knitted wear including t-shirts, leggings, and sweaters.'
    },
    woven: {
        image: 'images/export-garments-textiles.webp',
        description: 'Formal and casual woven garments including shirts and trousers.'
    },
    
    // Agriculture
    animal_products: {
        image: 'images/agri-spices-grains.webp',
        description: 'Quality meat, seafood, and dairy products sourced globally.'
    },
    vegetable_products: {
        image: 'images/agri-spices-grains.webp',
        description: 'Fresh vegetables, fruits, nuts, and spices from premium farms.'
    },
    
    // Marine
    raw_materials: {
        image: 'images/marine-plywood-timber.webp',
        description: 'Essential raw materials and marine plywood for fiberglass boat manufacturing.'
    },
    resins: {
        image: 'images/marine-resins-fiberglass.webp',
        description: 'High-performance polyester, epoxy, and vinyl ester resins.'
    },
    hardware: {
        image: 'images/marine-hardware-fasteners.webp',
        description: 'Stainless steel marine hardware, deck fittings, and fasteners.'
    },
    
    // Fallback
    default: {
        image: 'images/aorr-trade-hero.webp',
        description: 'Explore our premium catalog of industrial and commercial products.'
    }
};

export default SUBCATEGORY_META;
