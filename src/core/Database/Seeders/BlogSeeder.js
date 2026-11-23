import mongoose from 'mongoose';
import Blog from '../../Models/Blog.js';
import User from '../../Models/User.js';
import { USER_ROLES } from '../../Constants/index.js';

export const seedBlogs = async () => {
    try {
        console.log('[BlogSeeder] Checking for existing author...');
        let author = await User.findOne({ role: USER_ROLES.ADMIN });
        if (!author) {
            author = await User.findOne({});
        }

        const authorId = author ? author._id : null;

        const sampleBlogs = [
            {
                title: 'The Ultimate 7-Day Spiti Valley Road Trip Itinerary',
                slug: 'ultimate-7-day-spiti-valley-road-trip-itinerary',
                excerpt: 'A complete day-by-day road trip guide across Shimla, Kaza, Key Monastery, Chandratal Lake, and Kunzum Pass with local cab rental tips.',
                coverImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
                tags: ['Spiti Valley', 'Road Trip', 'Himachal', 'Adventure', 'Travel Guide'],
                status: 'published',
                publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                content: `# The Ultimate 7-Day Spiti Valley Road Trip Itinerary

Spiti Valley, known as the **"Middle Land"** between India and Tibet, is one of the most mesmerizing cold desert mountain valleys on Earth. Located at an altitude over 12,500 feet in Himachal Pradesh, this journey takes you through rugged moonscapes, ancient Buddhist monasteries, and turquoise alpine lakes.

---

## Trip Overview
- **Duration:** 7 Days / 6 Nights
- **Best Season:** June to October
- **Starting Point:** Shimla (Recommended for gradual acclimatization)
- **Ending Point:** Manali via Kunzum Pass
- **Ideal Vehicle:** High ground clearance SUV / 4x4 or verified local cab

---

## Day-by-Day Route Itinerary

### Day 1: Shimla to Kalpa (Kinnaur)
Start early morning from Shimla. Travel along the Hindustan-Tibet Highway (NH-05) alongside the rushing Sutlej river. Check into a traditional wooden homestay in Kalpa with panoramic views of the sacred **Kinner Kailash** range.

### Day 2: Kalpa to Tabo via Nako Lake
Cross the dramatic Khab confluence where Spiti and Sutlej rivers meet. Stop by the serene **Nako Lake** for lunch before continuing towards Tabo.
- *Highlight:* Visit the **Tabo Monastery**, established in 996 AD and recognized as a UNESCO World Heritage site.

### Day 3: Tabo to Kaza via Dhankar Monastery
Hike up to the cliff-hanging **Dhankar Monastery**, which overlooks the confluence of Spiti and Pin rivers. Arrive in Kaza by afternoon to explore the local market and cafes.

### Day 4: High-Altitude Villages of Spiti
Dedicate this day to exploring the highest inhabited hamlets:
1. **Key Monastery:** The iconic 11th-century fort-style Buddhist monastery.
2. **Kibber & Chicham Bridge:** Cross Asia's highest suspension bridge at 13,596 feet.
3. **Hikkim:** Send a postcard from the world's highest operational post office (14,567 ft).
4. **Komic:** One of the highest villages connected by a motorable road.

### Day 5: Kaza to Chandratal Lake via Kunzum Pass
Ascend the majestic **Kunzum Pass (14,931 ft)** where prayer flags flutter in mountain gales. Descend to the mystical, crescent-shaped **Chandratal Lake (Moon Lake)** and stay in luxury Swiss tents.

### Day 6: Chandratal to Manali via Atal Tunnel
Navigate the rugged boulder-strewn road from Batal through the Gramphu pass before connecting to the modern marvel of the **Atal Tunnel**, arriving in Manali by dusk.

### Day 7: Manali Departure
Relax, visit Old Manali cafes, and board your return Volvo or cab to Delhi/Chandigarh.

---

## Essential Packing Checklist
- Heavy windproof fleece jacket & thermal inners
- High SPF 50+ sunscreen & polarized UV sunglasses
- Diamox or camphor for high-altitude acclimatization
- Ample cash (ATMs in Kaza are frequently offline)`
            },
            {
                title: 'Kedarnath Yatra: Essential Guide, Trek Route & Helicopter Booking',
                slug: 'kedarnath-yatra-guide-trek-route-helicopter-booking',
                excerpt: 'Everything you need to know for the holy Kedarnath Yatra — biometric registration, Sonprayag to Gaurikund transport, pony vs trek options, and weather precautions.',
                coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
                tags: ['Kedarnath', 'Uttarakhand', 'Spiritual', 'Chardham', 'Trekking'],
                status: 'published',
                publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                content: `# Kedarnath Yatra: Essential Guide, Trek Route & Helicopter Booking

Perched at an elevation of 3,584 meters (11,759 ft) amidst snow-clad Garhwal Himalayan peaks, **Kedarnath Dham** is the most revered of the twelve Jyotirlingas of Lord Shiva.

---

## 1. Mandatory Biometric Registration
Before starting your journey, every pilgrim must register on the official Uttarakhand Tourism portal:
- Carry your original Aadhaar card and digital registration slip.
- Verify your medical fitness certificate if aged above 50.

---

## 2. The 16-km Trek Route: Gaurikund to Kedarnath
The physical trek begins from **Gaurikund**:
- **Sonprayag to Gaurikund:** 5 km by local shared Maxi Cabs (₹50 per seat).
- **Gaurikund to Jungle Chatti (4 km):** Paved stone path with gentle ascent.
- **Jungle Chatti to Bheembali (3 km):** Refreshment stops, medical aid posts.
- **Bheembali to Lincholi (4 km):** Steeper incline; temperature begins to drop noticeably.
- **Lincholi to Base Camp & Temple (5 km):** Panoramic view of the Kedarnath peak and Kedar dome.

---

## 3. Helicopter Services (IRCTC HeliYatra)
Helicopters operate from three primary helipads in Rudraprayag:
- **Phata Helipad**
- **Guptkashi Helipad**
- **Sirsi Helipad**

*Tip: Always book exclusively through the official IRCTC HeliYatra portal to protect against unauthorized touts.*

---

## 4. Best Weather Window
- **Pre-Monsoon (May - June):** Clear skies, ideal temperatures, heavy pilgrim rush.
- **Post-Monsoon (September - October):** Crisp mountain air, vibrant autumn colors, peaceful darshan.`
            },
            {
                title: 'Top 8 Hidden Homestays in Jibhi and Tirthan Valley',
                slug: 'top-8-hidden-homestays-jibhi-tirthan-valley',
                excerpt: 'Escape the crowded hill stations! Discover secluded wooden chalets, river-side cottages, and local Himachali hospitality in Banjar valley.',
                coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
                tags: ['Jibhi', 'Tirthan Valley', 'Homestays', 'Offbeat', 'Himachal'],
                status: 'published',
                publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
                content: `# Top 8 Hidden Homestays in Jibhi and Tirthan Valley

Tucked away in the Kullu district of Himachal Pradesh, **Jibhi** and the adjacent **Tirthan Valley** offer an idyllic sanctuary of cedar forests, freshwater streams, and traditional Kath-Kuni wooden architecture.

---

## Why Choose a Homestay Over a Hotel?
- **Organic Pahadi Meals:** Savor authentic Siddu, Makki ki Roti with fresh Sarson, and wild apricot chutney.
- **Local Guides:** Hosts frequently arrange guided hikes to Serolsar Lake and the Great Himalayan National Park (GHNP).
- **Peaceful Remote Work:** High-speed optical fiber connectivity amidst murmuring streams.

---

## Handpicked Stays Across the Valley

### 1. The Riverside Cedar Haven (Tirthan)
Built right on the banks of the glacial Tirthan river. Step out directly onto cobblestone riverbeds and enjoy evening bonfires with trout fishing.

### 2. Pine Wood Loft & Chalet (Jibhi)
A multi-tier wooden chalet featuring skylight glass ceilings for stargazing and private balconies overlooking apple orchards.

### 3. Jalori Heights Eco Retreat (Shoja)
Located 5 km before Jalori Pass at 8,500 feet, offering unobstructed views of snow-dusted Dhauladhar ridges.

---

## What to Do While in Jibhi
- Walk to the picturesque wooden **Jibhi Waterfall**.
- Trek to **Chehni Kothi**, an imposing 1,500-year-old multi-story wooden watchtower.
- Picnic at the emerald-green **Serolsar Lake** via Jalori Pass.`
            },
            {
                title: 'First-Time Himalayan Trekker? 10 Crucial Mistakes to Avoid',
                slug: 'first-time-himalayan-trekker-mistakes-to-avoid',
                excerpt: 'From improper layering and poor hydration to ignoring AMS symptoms, learn the essential rules of high-altitude survival in the Western Himalayas.',
                coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
                tags: ['Trekking', 'Travel Tips', 'Safety', 'Beginners', 'Himalayas'],
                status: 'published',
                publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
                content: `# First-Time Himalayan Trekker? 10 Crucial Mistakes to Avoid

The Indian Himalayas are breathtaking, but high-altitude terrain demands respect and preparation. Whether embarking on the Kedarkantha winter trek, Hampta Pass, or Har Ki Dun, avoid these 10 common mistakes.

---

## 1. Buying Cheap or Unbroken Trekking Shoes
Never start a 5-day mountain trek in brand-new, unbroken shoes or casual sneakers. Invest in waterproof boots with deep lug rubber outsoles and break them in 2 weeks prior.

## 2. Overpacking Your Rucksack
Your backpack should ideally weigh no more than 9 to 11 kg. Leave bulky cotton jeans behind and carry lightweight synthetic quick-dry gear.

## 3. Ignoring the 3-Layer System
Mountain weather fluctuates rapidly:
- **Base Layer:** Moisture-wicking merino wool or polyester.
- **Mid Layer:** Insulating fleece or lightweight down jacket.
- **Outer Shell:** Windproof and waterproof breathable hardshell jacket.

## 4. Neglecting Hydration
At high altitudes, dehydration accelerates Acute Mountain Sickness (AMS). Drink at least 3 to 4 liters of water daily, supplemented with electrolyte salts.

## 5. Never Ascend With Untreated Headaches
If experiencing persistent headaches, dizziness, or nausea above 9,000 feet, rest immediately and inform your trek leader. Never ascend with active AMS symptoms.`
            },
            {
                title: 'Complete Guide to Booking Inter-City Cabs in Himachal & Uttarakhand',
                slug: 'complete-guide-booking-cabs-himachal-uttarakhand',
                excerpt: 'Navigating mountain terrain safely — local taxi union regulations, route permits, commercial 4x4 options, and how to book verified drivers.',
                coverImage: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80',
                tags: ['Cab Booking', 'Transport', 'Himachal', 'Uttarakhand', 'Travel Tips'],
                status: 'published',
                publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                content: `# Complete Guide to Booking Inter-City Cabs in Himachal & Uttarakhand

Hiring a private cab is the most flexible and scenic way to explore the mountain roads of North India. However, regional taxi union boundaries and seasonal road conditions require smart planning.

---

## Understanding Local Taxi Union Rules
In states like Himachal Pradesh and Uttarakhand:
- A cab booked from Delhi or Chandigarh can drop you anywhere, but local sightseeing in regulated zones (e.g., Rohtang Pass, Spiti interior) may require a local union vehicle.
- Through Tripdhara, our fleet includes pre-certified multi-zone permits, saving travelers from middleman commissions.

---

## Recommended Vehicles by Terrain
- **Sedans (Dzire, Etios):** Perfect for highways and gentle climbs (Chandigarh to Shimla, Dehradun to Mussoorie).
- **MUVs (Innova Crysta, Ertiga):** Ideal for family trips with luggage across winding hill routes.
- **4x4 / AWD (Thar, Scorpio, Bolero Camper):** Essential for high mountain passes, Spiti winter tours, and water crossings (Nallahs).`
            },
            {
                title: 'Monsoon in Kasol: Why Parvati Valley is Magical in July & August',
                slug: 'monsoon-kasol-parvati-valley-travel-guide',
                excerpt: 'Lush pine forests, misty cloud formations, and riverside cafes. Learn why off-season monsoon trips to Tosh, Chalal, and Kasol are unforgettable.',
                coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
                tags: ['Kasol', 'Parvati Valley', 'Monsoon', 'Cafe Culture', 'Himachal'],
                status: 'draft',
                publishedAt: null,
                content: `# Monsoon in Kasol: Why Parvati Valley is Magical in July & August

While the monsoon season is considered low-season in the Himalayas, the **Parvati Valley** takes on a dreamlike, emerald-green aesthetic when rain blankets the cedar canopies.

---

## 1. Misty Landscapes & Roaring Rivers
The Parvati river swells into a thunderous white-water spectacle. Fog settles low over wooden footbridges connecting Chalal, Katagla, and Kasol.

## 2. Offbeat Cafe Vibes
Without peak summer tourist crowds, iconic cafes like Evergreen, Moon Dance, and Bhoj offer cozy seating by crackling wood stoves with fresh Israeli falafel and cinnamon apple pie.

## 3. Important Safety Rules
- Avoid camping directly on riverbeds.
- Check real-time road status between Bhuntar and Manikaran before driving.`
            },
            {
                title: 'Chopta Tungnath & Chandrashila: The Highest Shiva Temple Trek',
                slug: 'chopta-tungnath-chandrashila-trek-guide',
                excerpt: 'Experience a 360-degree panoramic view of Nanda Devi, Trishul, and Chaukhamba peaks from 13,123 feet. Complete trail notes, itinerary, homestays, and seasonal guidelines.',
                coverImage: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80',
                tags: ['Chopta', 'Tungnath', 'Uttarakhand', 'Trekking', 'Himalayas', 'Weekend Trip'],
                status: 'published',
                publishedAt: new Date(),
                content: `# Chopta Tungnath & Chandrashila: The Ultimate Himalayan Summit Trek Guide

Often celebrated as the **"Mini Switzerland of Uttarakhand"**, Chopta is an alpine jewel perched at an elevation of 8,790 feet (2,680 m) in the Rudraprayag district. Surrounded by dense forests of pine, deodar, and vibrant rhododendrons, Chopta serves as the launchpad for one of India's most rewarding short-duration summit climbs — the **Tungnath and Chandrashila Trek**.

Whether you are a seasoned mountaineer seeking a weekend conditioning climb or a beginner looking for your very first Himalayan summit above 13,000 feet, this detailed field guide covers every trail nuance, packing strategy, local homestay recommendation, and seasonal forecast.

---

## Trek Quick Factsheet

| Parameter | Specification |
| :--- | :--- |
| **Base Elevation** | Chopta (8,790 ft / 2,680 m) |
| **Highest Temple Altitude** | Tungnath Shrine (12,073 ft / 3,680 m) |
| **Summit Elevation** | Chandrashila Peak (13,123 ft / 4,000 m) |
| **Trek Distance** | 5 km one-way (10 km round trip) |
| **Trail Gradient** | Moderate (well-paved stone trail to Tungnath; rocky scree to summit) |
| **Best Season** | April to June (blooming bugyals) & September to November (crisp golden skies) |
| **Winter Snow Trek** | December to February (crampons & microspikes mandatory) |
| **Nearest Railhead** | Rishikesh Yog Nagari (205 km) / Haridwar (230 km) |
| **Nearest Airport** | Jolly Grant Airport, Dehradun (225 km) |

---

## 1. The Holy Tungnath: World's Highest Shiva Temple

Standing tall at 12,073 feet, **Tungnath** is the highest of all five sacred *Panch Kedar* shrines dedicated to Lord Shiva. According to Hindu epic lore from the *Mahabharata*, the Pandavas constructed this sanctuary of black stone to seek penance from Lord Shiva after the great Kurukshetra war. Shiva, having manifested in the form of a sacred bull (Nandi), vanished into the earth, with his arms (*Bahu*) appearing at Tungnath.

The architectural craftsmanship of the temple features ancient North Indian Nagara masonry designed to withstand centuries of heavy Himalayan snow loads. Directly outside the temple sanctum rests an ornate stone effigy of Nandi facing the inner sanctum.

> [!NOTE]
> The temple doors generally open in the first week of May and close during the first week of November after Diwali, with the deity idol descending to Makkumath village for the winter months. Even when the sanctum doors are closed during winter, the trail to the ridge remains open for trekkers with snow gear.

---

## 2. The Summit Push: Chandrashila Peak (13,123 ft)

From Tungnath Temple, the trail transforms from a paved path into a steep, zig-zag rocky ascent of approximately 1.5 kilometers (40 to 60 minutes of sustained hiking) leading to the summit of **Chandrashila** (*"Moon Rock"*).

According to local folklore, Lord Rama meditated on this crag after defeating Ravana, and Chandra (the Moon God) performed penance here. 

### The 360-Degree Panoramic Horizon
Upon reaching the summit cairn and the small Ganga temple perched on top, you are rewarded with one of the most comprehensive panoramic mountain vistas anywhere in the Garhwal and Kumaon Himalayas:
- **Nanda Devi (25,643 ft):** India's second-highest mountain standing majestic on the eastern horizon.
- **Trishul (23,360 ft):** The distinctive three-pronged trident massif.
- **Chaukhamba I, II, III, IV (23,419 ft):** The immense four-pillared wall dominating the north.
- **Kedar Dome & Kedarnath Peak:** The sacred peaks guarding the Mandakini valley.
- **Bandarpoonch & Black Peak (Kalanag):** Visible clearly to the far northwest on crisp cloudless mornings.

> [!TIP]
> Start your summit push from Chopta between **4:00 AM and 4:30 AM** with a headlamp. Reaching Chandrashila before sunrise allows you to witness the first rays of crimson alpenglow striking the snow-clad face of Chaukhamba and Nanda Devi.

---

## 3. Recommended 3-Day Itinerary

Here is the benchmark 3-day itinerary recommended by Tripdhara mountain guides for proper pacing and acclimatization:

### Day 1: Rishikesh to Chopta (205 km / 7-8 hrs drive)
- Depart early from Rishikesh along the Badrinath highway (NH 58).
- Marvel at the confluence of rivers at **Devprayag** (Bhagirathi meets Alaknanda to form the Ganga) and **Rudraprayag** (Alaknanda meets Mandakini).
- Pass through the picturesque temple town of **Ukhimath** before ascending through the Kedarnath Wildlife Sanctuary to Chopta.
- Check into an eco-homestay or alpine tented camp. Evening walk on the green bugyals to acclimatize.

### Day 2: Summit Day (Chopta to Tungnath & Chandrashila to Chopta)
- **4:30 AM:** Start hiking from the Chopta gate.
- **7:00 AM:** Arrive at Tungnath Temple, catch your breath, and hydrate.
- **8:15 AM:** Summit Chandrashila Peak (13,123 ft). Spend 45 minutes soaking in the 360-degree vista.
- **11:30 AM:** Descend safely back to Chopta for a hot lunch of Pahadi rajma-chawal.
- *Optional afternoon detour:* Drive 20 km to Sari village and do the short 2.5 km trek to the crystal-clear waters of **Deoriatal Lake**.

### Day 3: Chopta to Rishikesh / Dehradun (Drive back)
- Enjoy an organic Himalayan breakfast overlooking the valley.
- Depart Chopta by 8:30 AM, stopping by local cooperatives in Kund or Guptkashi for authentic rhododendron (*buransh*) squash and wild forest honey.
- Arrive at Rishikesh by 5:00 PM for onward transit.

---

## 4. Seasonal Weather & Trail Conditions

- **Spring (March to April):** The trails are lined with blooming scarlet and pink *Rhododendron arboreum* (Buransh). Temperatures range between 5°C and 18°C. Ideal for photography.
- **Summer (May to June):** Pleasant weather (10°C to 24°C), clear trails, and lush green meadows. Perfect for families, beginners, and students.
- **Autumn (September to November):** The best visibility of the year. The monsoon cleanses the atmosphere, yielding deep sapphire skies and razor-sharp peak views. Nights can dip to 0°C.
- **Winter (December to February):** Heavy snowfall blankets Chopta in 3 to 5 feet of snow. The trek transforms into a white wonderland. Microspikes, gaiters, and 4x4 mountain vehicles are recommended.

---

## 5. Homestays & Responsible Mountain Hospitality

At Tripdhara, we advocate for **community-owned village tourism**. Instead of choosing large concrete commercial hotels, we recommend staying at verified local homestays in **Sari Village**, **Baniyakund**, or **Ukhimath**.

Benefits of choosing a local Pahadi homestay:
- **Authentic Garhwali Cuisine:** Freshly milled *Mandua* (finger millet) rotis, *Gahat ki Dal* (horsegram soup), *Jhangora ki Kheer*, and organic mountain potatoes.
- **Direct Economic Impact:** 100% of your stay fees go directly into the hands of mountain families.
- **Local Route Intelligence:** Homestay hosts are veteran trek guides who know trail snow depths and weather shifts better than any digital forecast.

---

## 6. Essential Packing Checklist

1. **Footwear:** Sturdy mid-ankle trekking shoes with vibram or deep lug rubber soles. Avoid regular flat running sneakers.
2. **Layering System:**
   - 1 Moisture-wicking synthetic base layer
   - 1 Breathable fleece mid-layer
   - 1 Windproof and water-resistant outer jacket
   - 1 Down feather jacket (essential October through March)
3. **Gear:** 25-30L daypack with rain cover, lightweight aluminum trekking pole, UV-400 sunglasses, woollen beanie, and LED headlamp with spare batteries.
4. **Hydration & Safety:** Insulated water bottle (1.5L minimum), electrolyte sachets (ORS), lip balm with SPF, and basic first-aid kit with Diamox (consult your doctor for acclimatization).

---

## Mountain Ethics & Leave No Trace

The alpine meadows (*Bugyals*) around Chopta and Tungnath fall within the protected **Kedarnath Wildlife Sanctuary**, home to the elusive snow leopard, Himalayan monal, and musk deer. 

- **Zero Plastic Tolerance:** Carry all plastic wrappers, energy bar foils, and water bottles back to your homestay dustbins.
- **Stick to the Trail:** Avoid taking shortcuts across switchbacks, which triggers slope erosion in fragile high-altitude soil.
- **No Loud Speakers:** Respect the spiritual tranquility of Tungnath and the fragile mountain biosphere.`
            },
        ];

        let seededCount = 0;
        for (const blogData of sampleBlogs) {
            const existing = await Blog.findOne({ slug: blogData.slug });
            if (!existing) {
                await Blog.create({
                    ...blogData,
                    author: authorId
                });
                seededCount++;
            } else {
                // Update content to ensure rich formatting
                await Blog.updateOne({ slug: blogData.slug }, {
                    $set: {
                        ...blogData,
                        author: authorId
                    }
                });
            }
        }

        console.log(`[BlogSeeder] Successfully populated/updated ${sampleBlogs.length} blogs (New: ${seededCount}).`);
        return { total: sampleBlogs.length, newCount: seededCount };
    } catch (error) {
        console.error('[BlogSeeder] Seeding failed:', error);
        throw error;
    }
};

export default seedBlogs;
