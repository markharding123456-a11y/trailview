export interface SampleTrail {
  id: string;
  name: string;
  region: string;
  regionSlug: string;
  difficulty: "green" | "blue" | "black" | "expert";
  activityTypes: string[];
  distanceKm: number;
  elevationGainM: number;
  durationMin: number;
  description: string;
  highlights: string[];
  season: string;
  coordinates: [number, number, number][]; // [lat, lng, elevation]
}

// Helper to generate a trail path between two points with elevation changes
function generatePath(
  startLat: number, startLng: number, startEle: number,
  endLat: number, endLng: number, endEle: number,
  points: number, jitter: number = 0.002
): [number, number, number][] {
  const path: [number, number, number][] = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const lat = startLat + (endLat - startLat) * t + (Math.sin(t * Math.PI * 4) * jitter);
    const lng = startLng + (endLng - startLng) * t + (Math.cos(t * Math.PI * 3) * jitter);
    const ele = startEle + (endEle - startEle) * t + Math.sin(t * Math.PI * 6) * 40;
    path.push([Number(lat.toFixed(5)), Number(lng.toFixed(5)), Math.round(ele)]);
  }
  return path;
}

export const sampleTrails: SampleTrail[] = [
  {
    id: "top-of-the-world",
    name: "Top of the World",
    region: "Whistler / Squamish",
    regionSlug: "whistler",
    difficulty: "expert",
    activityTypes: ["MTB"],
    distanceKm: 8.4,
    elevationGainM: 142,
    durationMin: 32,
    description: "Whistler's crown jewel. A high-alpine descent starting above the treeline with massive exposure, technical rock rolls, and breathtaking views of the Whistler valley. One of the most iconic mountain bike trails in the world.",
    highlights: ["Alpine exposure", "Rock gardens", "Valley views", "Technical drops"],
    season: "Jun - Oct",
    coordinates: generatePath(50.0725, -122.9480, 1850, 50.0850, -122.9580, 670, 80, 0.003),
  },
  {
    id: "a-line",
    name: "A-Line",
    region: "Whistler / Squamish",
    regionSlug: "whistler",
    difficulty: "black",
    activityTypes: ["MTB"],
    distanceKm: 3.2,
    elevationGainM: 15,
    durationMin: 8,
    description: "The most famous jump trail on Earth. A-Line is a perfectly sculpted ribbon of tabletops, step-downs, and berms that flows from top to bottom of Whistler Bike Park. A bucket-list ride for every mountain biker.",
    highlights: ["World-class jumps", "Perfect flow", "Tabletops", "Berms"],
    season: "Jun - Oct",
    coordinates: generatePath(50.0680, -122.9520, 1100, 50.0735, -122.9555, 650, 40, 0.001),
  },
  {
    id: "comfortably-numb",
    name: "Comfortably Numb",
    region: "Whistler / Squamish",
    regionSlug: "whistler",
    difficulty: "blue",
    activityTypes: ["MTB"],
    distanceKm: 14.2,
    elevationGainM: 380,
    durationMin: 55,
    description: "A cross-country classic linking Whistler to Squamish through old-growth forest. Flowy singletrack, wooden bridges, and perfect intermediate terrain with stunning coastal mountain views.",
    highlights: ["Old-growth forest", "Wooden bridges", "Flow trail", "Mountain views"],
    season: "May - Nov",
    coordinates: generatePath(50.0600, -122.9600, 900, 49.9500, -123.0800, 450, 100, 0.008),
  },
  {
    id: "expresso",
    name: "Expresso",
    region: "North Shore Vancouver",
    regionSlug: "north-shore",
    difficulty: "blue",
    activityTypes: ["MTB"],
    distanceKm: 5.8,
    elevationGainM: 95,
    durationMin: 22,
    description: "Mt Fromme's most popular trail. Fast, flowy, with perfectly placed berms and small jumps. The gold standard for intermediate riding on the North Shore.",
    highlights: ["Perfect berms", "Small jumps", "Flow trail", "Forest canopy"],
    season: "Apr - Nov",
    coordinates: generatePath(49.3780, -123.0750, 780, 49.3550, -123.0650, 220, 60, 0.003),
  },
  {
    id: "cbc-trail",
    name: "CBC Trail",
    region: "North Shore Vancouver",
    regionSlug: "north-shore",
    difficulty: "black",
    activityTypes: ["MTB"],
    distanceKm: 3.1,
    elevationGainM: 45,
    durationMin: 18,
    description: "Classic North Shore technical singletrack. Root-laden, rocky, with mandatory skinny log rides and natural features. The trail that defined freeride mountain biking.",
    highlights: ["Technical roots", "Log rides", "Rock drops", "Freeride history"],
    season: "Apr - Nov",
    coordinates: generatePath(49.3650, -123.0850, 650, 49.3500, -123.0720, 180, 45, 0.002),
  },
  {
    id: "seven-summits",
    name: "Seven Summits",
    region: "Kootenays",
    regionSlug: "kootenays",
    difficulty: "blue",
    activityTypes: ["MTB", "Hiking"],
    distanceKm: 22.5,
    elevationGainM: 820,
    durationMin: 120,
    description: "Rossland's epic backcountry traverse. Linking seven peaks through alpine meadows, old-growth cedar forest, and technical rock sections with panoramic views of the Columbia Mountains.",
    highlights: ["Alpine meadows", "Seven peaks", "Cedar forest", "Panoramic views"],
    season: "Jun - Oct",
    coordinates: generatePath(49.0850, -117.8100, 1950, 49.0550, -117.7650, 1100, 120, 0.005),
  },
  {
    id: "kettle-valley-rail-trail",
    name: "Kettle Valley Rail Trail",
    region: "Okanagan",
    regionSlug: "okanagan",
    difficulty: "green",
    activityTypes: ["MTB", "Hiking", "ATV/UTV"],
    distanceKm: 18.6,
    elevationGainM: 210,
    durationMin: 90,
    description: "Historic railway converted to multi-use trail through the Myra Canyon. Cross 18 trestle bridges and 2 tunnels with sweeping views of Okanagan Lake below. Gentle grades perfect for all skill levels.",
    highlights: ["18 trestle bridges", "2 tunnels", "Okanagan Lake views", "Historic railway"],
    season: "Apr - Nov",
    coordinates: generatePath(49.8200, -119.3800, 1240, 49.8650, -119.4200, 1080, 90, 0.004),
  },
  {
    id: "grand-forks-phoenix",
    name: "Phoenix Mountain Loop",
    region: "Kootenays",
    regionSlug: "kootenays",
    difficulty: "black",
    activityTypes: ["Motorcycle", "ATV/UTV"],
    distanceKm: 35.2,
    elevationGainM: 1150,
    durationMin: 150,
    description: "A rugged backcountry loop climbing through the historic Phoenix ghost town site. Rocky doubletrack, creek crossings, and demanding elevation changes through remote Boundary Country terrain.",
    highlights: ["Ghost town ruins", "Creek crossings", "Remote backcountry", "Mountain passes"],
    season: "Jun - Oct",
    coordinates: generatePath(49.0800, -118.4500, 620, 49.1300, -118.3800, 1520, 100, 0.006),
  },
  {
    id: "revelstoke-frisby-ridge",
    name: "Frisby Ridge",
    region: "Kootenays",
    regionSlug: "kootenays",
    difficulty: "expert",
    activityTypes: ["Snowmobile"],
    distanceKm: 28.0,
    elevationGainM: 1400,
    durationMin: 180,
    description: "World-class snowmobile terrain above Revelstoke. Deep powder bowls, steep chutes, and endless alpine meadows at 2,400m. Regularly featured in sled films for its extreme terrain and reliable snowpack.",
    highlights: ["Deep powder", "Alpine bowls", "2,400m elevation", "Extreme terrain"],
    season: "Dec - Apr",
    coordinates: generatePath(51.0200, -118.1500, 900, 51.0700, -118.0800, 2400, 80, 0.005),
  },
  {
    id: "sun-peaks-descent",
    name: "Sun Peaks Descent",
    region: "Kamloops",
    regionSlug: "kamloops",
    difficulty: "blue",
    activityTypes: ["Skiing"],
    distanceKm: 5.5,
    elevationGainM: 30,
    durationMin: 15,
    description: "A perfectly groomed intermediate run from the summit of Tod Mountain. Wide open cruiser with stunning views of the Thompson Plateau, transitioning into gladed tree skiing lower down.",
    highlights: ["Summit views", "Groomed corduroy", "Gladed trees", "Thompson Plateau"],
    season: "Dec - Apr",
    coordinates: generatePath(50.8950, -119.9100, 2060, 50.8750, -119.9000, 1250, 55, 0.002),
  },
  {
    id: "vedder-mountain",
    name: "Vedder Mountain",
    region: "Fraser Valley",
    regionSlug: "fraser-valley",
    difficulty: "black",
    activityTypes: ["Motorcycle", "ATV/UTV"],
    distanceKm: 15.8,
    elevationGainM: 680,
    durationMin: 90,
    description: "A network of steep logging roads and singletrack in Chilliwack's backyard. Technical climbs, loose rock descents, and tight switchbacks through second-growth forest with Fraser Valley views.",
    highlights: ["Technical climbs", "Switchbacks", "Valley views", "Mixed terrain"],
    season: "Mar - Nov",
    coordinates: generatePath(49.0850, -121.9800, 120, 49.1200, -121.9400, 800, 70, 0.004),
  },
  {
    id: "sea-to-sky-trail",
    name: "Sea to Sky Trail",
    region: "Whistler / Squamish",
    regionSlug: "whistler",
    difficulty: "green",
    activityTypes: ["Hiking", "MTB"],
    distanceKm: 12.0,
    elevationGainM: 350,
    durationMin: 75,
    description: "A scenic coastal trail connecting Squamish to Whistler along Howe Sound. Gentle grades through temperate rainforest with ocean viewpoints, waterfalls, and wildlife viewing opportunities.",
    highlights: ["Ocean views", "Waterfalls", "Rainforest", "Wildlife"],
    season: "Year-round",
    coordinates: generatePath(49.7000, -123.1500, 30, 49.7800, -123.1200, 380, 80, 0.005),
  },
];

export const regions = [
  { name: "Whistler / Squamish", slug: "whistler", trailCount: 4, lat: 50.07, lng: -122.95 },
  { name: "North Shore Vancouver", slug: "north-shore", trailCount: 2, lat: 49.37, lng: -123.08 },
  { name: "Kootenays", slug: "kootenays", trailCount: 3, lat: 49.08, lng: -118.20 },
  { name: "Okanagan", slug: "okanagan", trailCount: 1, lat: 49.82, lng: -119.40 },
  { name: "Kamloops", slug: "kamloops", trailCount: 1, lat: 50.89, lng: -119.91 },
  { name: "Fraser Valley", slug: "fraser-valley", trailCount: 1, lat: 49.10, lng: -121.96 },
];

export const activityTypes = ["MTB", "Motorcycle", "ATV/UTV", "Skiing", "Snowmobile", "Hiking"];

export const difficultyColors: Record<string, string> = {
  green: "#22c55e",
  blue: "#3b82f6",
  black: "#1e293b",
  expert: "#ef4444",
};

export const difficultyLabels: Record<string, string> = {
  green: "Easy",
  blue: "Intermediate",
  black: "Advanced",
  expert: "Expert",
};
