/**
 * SUBCATEGORY METADATA STORAGE
 * Separated from main logic to keep data clean.
 * Maps subcategory keys (or top-level keys) to images/descriptions.
 */

const SUBCATEGORY_META = {
    // Top Level Defaults
    machinery_mechanical: {
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
        description: 'High-precision pressure regulators and industrial valves for fluid control systems.'
    },
    artificial_jewellery: {
        image: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80&w=2070&auto=format&fit=crop',
        description: 'Exquisite imitation jewellery including gold, silver, and stone-studded pieces.'
    },
    
    // Subcategories (Artificial Products)
    decorative: {
        image: 'https://images.unsplash.com/photo-1534349762913-96c22b292f0f?q=80&w=2070&auto=format&fit=crop',
        description: 'Beautiful artificial flowers and decorative items to enhance any space.'
    },
    hair: {
        image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=2070&auto=format&fit=crop',
        description: 'Premium quality artificial hair wigs and extensions.'
    },
    
    // Subcategories (Garments)
    knitted: {
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2070&auto=format&fit=crop',
        description: 'Comfortable knitted wear including t-shirts, leggings, and sweaters.'
    },
    woven: {
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop',
        description: 'Formal and casual woven garments including shirts and trousers.'
    },
    
    // Agriculture
    animal_products: {
        image: 'https://images.unsplash.com/photo-1548550027-fa1c669689aa?q=80&w=2070&auto=format&fit=crop',
        description: 'Quality meat, seafood, and dairy products sourced globally.'
    },
    vegetable_products: {
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop',
        description: 'Fresh vegetables, fruits, nuts, and spices from premium farms.'
    },
    
    // Marine
    raw_materials: {
        image: 'https://images.unsplash.com/photo-1566847438217-76e82d383f84?q=80&w=2070&auto=format&fit=crop',
        description: 'Essential raw materials for fiberglass boat manufacturing.'
    },
    resins: {
        image: 'https://images.unsplash.com/photo-1595460838166-5743b1778cde?q=80&w=2070&auto=format&fit=crop',
        description: 'High-performance polyester, epoxy, and vinyl ester resins.'
    },
    
    // Fallback
    default: {
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop',
        description: 'Explore our premium catalog of industrial and commercial products.'
    }
};

export default SUBCATEGORY_META;
