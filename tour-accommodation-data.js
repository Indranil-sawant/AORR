/**
 * AORR Datta Chhaya Tourism — Centralized Tour Accommodation Data Dictionary
 * Defines authentic accommodation tiers, star categories, room categories, and trust amenities
 * for all Signature Tour Yatras.
 * 
 * Rules:
 * 1. Hotel star classification (1-5 stars) is distinct from guest review scores.
 * 2. guestRating is null unless backed by verified guest reviews (never faked).
 * 3. Supports star category ranges (e.g. 2 to 3 stars, 3 to 4 stars).
 */

const TOUR_ACCOMMODATION_DATA = {
  'dattatreya-guru': {
    itineraryName: 'Divine Dattatreya & Guru Pilgrimage (5D/4N)',
    economy: {
      nights: 4,
      hotelCategoryMin: 2,
      hotelCategoryMax: 3,
      hotelCategoryLabel: 'Standard Hotels',
      hotelName: null,
      roomType: 'Sanitised Standard AC Rooms',
      amenities: ['Attached Bath', 'Clean Linen', 'Temple Proximity'],
      guestRating: null,
      reviewCount: null,
      tier: 'economy'
    },
    business: {
      nights: 4,
      hotelCategoryMin: 3,
      hotelCategoryMax: 4,
      hotelCategoryLabel: 'Deluxe / Premium Hotels',
      hotelName: null,
      roomType: 'Premium / Deluxe AC Rooms',
      amenities: ['Spacious Layout', 'Elevator Access', 'Priority Assistance'],
      guestRating: null,
      reviewCount: null,
      tier: 'business'
    }
  },

  'divine-andhra': {
    itineraryName: 'Divine Andhra (5D/4N)',
    economy: {
      nights: 4,
      hotelCategoryMin: 2,
      hotelCategoryMax: 3,
      hotelCategoryLabel: 'Standard Hotels',
      hotelName: null,
      roomType: 'Air-Conditioned Standard Rooms',
      amenities: ['Attached Bath', 'Daily Housekeeping', 'Central Location'],
      guestRating: null,
      reviewCount: null,
      tier: 'economy'
    },
    business: {
      nights: 4,
      hotelCategoryMin: 3,
      hotelCategoryMax: 4,
      hotelCategoryLabel: 'Deluxe & City Hotels',
      hotelName: null,
      roomType: 'Deluxe AC Rooms',
      amenities: ['Prime Properties', 'Superior Comfort', 'Breakfast Included'],
      guestRating: null,
      reviewCount: null,
      tier: 'business'
    }
  },

  'datta-vitthal': {
    itineraryName: 'Divine Datta & Vitthal Pilgrimage (2D/3N)',
    economy: {
      nights: 2,
      hotelCategoryMin: 2,
      hotelCategoryMax: 3,
      hotelCategoryLabel: 'Standard Hotels',
      hotelName: null,
      roomType: 'Sanitised AC Standard Rooms',
      amenities: ['Attached Bath', 'Temple Vicinity', 'Family-Safe'],
      guestRating: null,
      reviewCount: null,
      tier: 'economy'
    },
    business: {
      nights: 2,
      hotelCategoryMin: 3,
      hotelCategoryMax: 4,
      hotelCategoryLabel: 'Deluxe / Premium Hotels',
      hotelName: null,
      roomType: 'Deluxe AC Family Rooms',
      amenities: ['Top-Rated Comfort', 'Spacious Layout', 'Priority Coordination'],
      guestRating: null,
      reviewCount: null,
      tier: 'business'
    }
  },

  'karnataka-heritage': {
    itineraryName: 'Karnataka Heritage Tour (5D/4N)',
    economy: {
      nights: 4,
      hotelCategoryMin: 2,
      hotelCategoryMax: 3,
      hotelCategoryLabel: 'Standard Heritage Hotels',
      hotelName: null,
      roomType: 'Clean AC Standard Rooms',
      amenities: ['Attached Bath', 'Circuit Proximity', 'Safe Parking'],
      guestRating: null,
      reviewCount: null,
      tier: 'economy'
    },
    business: {
      nights: 4,
      hotelCategoryMin: 3,
      hotelCategoryMax: 4,
      hotelCategoryLabel: 'Business / Deluxe Hotels',
      hotelName: null,
      roomType: 'Executive AC Rooms',
      amenities: ['Premium Hospete / Badami Hotels', 'Superior Facilities', 'Daily Breakfast'],
      guestRating: null,
      reviewCount: null,
      tier: 'business'
    }
  },

  'datta-kolhapur': {
    itineraryName: 'Divine Datta & Kolhapur Darshan (3D/2N)',
    economy: {
      nights: 2,
      hotelCategoryMin: 2,
      hotelCategoryMax: 3,
      hotelCategoryLabel: 'Standard Hotels',
      hotelName: null,
      roomType: 'Sanitised AC Standard Rooms',
      amenities: ['1N Wadi + 1N Kolhapur', 'Attached Bath', 'Clean Linen', 'Temple Proximity'],
      guestRating: null,
      reviewCount: null,
      tier: 'economy'
    },
    business: {
      nights: 2,
      hotelCategoryMin: 3,
      hotelCategoryMax: 4,
      hotelCategoryLabel: 'Deluxe / Premium Hotels',
      hotelName: null,
      roomType: 'Deluxe AC Family / Executive Rooms',
      amenities: ['1N Wadi + 1N Kolhapur', 'Spacious Layout', 'Prime Properties', 'Priority Coordination'],
      guestRating: null,
      reviewCount: null,
      tier: 'business'
    }
  }
};

/**
 * Generates lightweight accessible Gold Star SVG markup
 * @param {number} count Number of full gold stars to render
 * @returns {string} SVG HTML
 */
function renderGoldStars(count) {
  const starSvg = `<svg class="star-icon-svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
  return Array(Math.max(1, Math.min(count, 5))).fill(starSvg).join('');
}

/**
 * Reusable HotelAccommodation Component
 * Generates semantic, accessible accommodation list-item HTML
 * @param {Object} config Accommodation configuration object
 * @returns {string} HTML markup for the package card
 */
function renderHotelAccommodation(config) {
  if (!config) return '';

  const nights = config.nights || 2;
  const nightsText = `${nights} Night${nights > 1 ? 's' : ''} Accommodation`;
  const tier = config.tier || 'economy';
  const minStars = config.hotelCategoryMin || 2;
  const maxStars = config.hotelCategoryMax || minStars;
  
  // Format Star Classification
  const starCountToRender = maxStars >= 4 ? 4 : (maxStars >= 3 ? 3 : 2);
  const starsMarkup = renderGoldStars(starCountToRender);
  const starLabel = minStars === maxStars 
    ? `${minStars}★ ${config.hotelCategoryLabel || 'Hotel'}`
    : `${minStars}★–${maxStars}★ ${config.hotelCategoryLabel || 'Hotels'}`;
  
  const roomType = config.roomType || 'Standard AC Room';
  const amenities = Array.isArray(config.amenities) ? config.amenities : [];
  
  // Guest Rating (Only rendered if authentic and verified)
  let guestRatingMarkup = '';
  if (config.guestRating && typeof config.guestRating === 'number') {
    const reviewsText = config.reviewCount ? ` (${config.reviewCount}+ verified reviews)` : '';
    guestRatingMarkup = `
      <div class="guest-review-badge" title="Verified Guest Review Rating">
        <span class="review-star" aria-hidden="true">★</span>
        <span class="review-score">${config.guestRating.toFixed(1)}/5</span>
        <span class="review-label">Excellent Guest Feedback${reviewsText}</span>
      </div>
    `;
  }

  const amenitiesHtml = amenities.map(a => `<span class="stay-amenity-chip">${a}</span>`).join('');

  return `
    <li class="price-feature-stay">
        <span class="feature-check" aria-hidden="true">✓</span>
        <div class="stay-info-wrapper">
            <div class="stay-primary-line">
                <strong>Stay:</strong> ${nightsText}
                <span class="hotel-star-badge ${tier}" title="${starLabel}">
                    <span class="star-icons" aria-label="${starLabel}">${starsMarkup}</span>
                    <span class="category-text">${starLabel}</span>
                </span>
            </div>
            <div class="stay-secondary-meta">
                <span class="room-type-pill">${roomType}</span>
                ${amenitiesHtml}
            </div>
            ${guestRatingMarkup}
        </div>
    </li>
  `.trim();
}

// Attach globally for in-page hydration and exports
if (typeof window !== 'undefined') {
  window.TourAccommodation = {
    data: TOUR_ACCOMMODATION_DATA,
    render: renderHotelAccommodation,
    renderGoldStars: renderGoldStars
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TOUR_ACCOMMODATION_DATA,
    renderHotelAccommodation,
    renderGoldStars
  };
}
