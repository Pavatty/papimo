export type Neighborhood = string;

export interface City {
  name: string;
  neighborhoods: Neighborhood[];
}

export interface Region {
  name: string;
  cities: City[];
}

export interface Country {
  code: string;
  name_fr: string;
  name_en: string;
  name_ar: string;
  flag: string;
  currency: string;
  regions: Region[];
}

export const COUNTRIES: Country[] = [
  {
    code: "TN",
    name_fr: "Tunisie",
    name_en: "Tunisia",
    name_ar: "تونس",
    flag: "🇹🇳",
    currency: "TND",
    regions: [
      {
        name: "Tunis",
        cities: [
          {
            name: "Tunis Centre",
            neighborhoods: [
              "Bab Bhar",
              "Bab Souika",
              "Centre Ville",
              "Lafayette",
              "Bouchoucha",
              "Belvédère",
              "Mutuelleville",
              "Notre Dame",
              "El Omrane",
              "Cité Olympique",
              "El Menzah 1",
              "El Menzah 4",
              "El Menzah 5",
              "El Menzah 6",
              "El Menzah 7",
              "El Menzah 8",
              "El Menzah 9",
              "El Manar 1",
              "El Manar 2",
              "Bardo",
              "Borgel",
              "Mégrine",
            ],
          },
          {
            name: "La Marsa",
            neighborhoods: [
              "Marsa Plage",
              "Marsa Ville",
              "Sidi Daoud",
              "Marsa Corniche",
              "La Marsa Cité",
            ],
          },
          {
            name: "Carthage",
            neighborhoods: [
              "Carthage Présidence",
              "Carthage Salammbô",
              "Carthage Byrsa",
              "Carthage Hannibal",
              "Carthage Dermech",
            ],
          },
          {
            name: "Sidi Bou Said",
            neighborhoods: ["Sidi Bou Said Ville", "Sidi Bou Said Plage"],
          },
          { name: "Le Kram", neighborhoods: ["Le Kram Ouest", "Le Kram Est"] },
          {
            name: "La Goulette",
            neighborhoods: [
              "La Goulette Centre",
              "La Goulette Plage",
              "Khereddine",
            ],
          },
          {
            name: "Hammam Lif",
            neighborhoods: ["Hammam Lif Centre", "Boumhel"],
          },
          {
            name: "Ben Arous",
            neighborhoods: [
              "Ben Arous Centre",
              "Bou Mhel El Bassatine",
              "Radès",
            ],
          },
          { name: "Berges du Lac", neighborhoods: ["Lac 1", "Lac 2", "Lac 3"] },
          {
            name: "El Aouina",
            neighborhoods: ["El Aouina Centre", "El Aouina Cité"],
          },
        ],
      },
      {
        name: "Ariana",
        cities: [
          {
            name: "Ariana Ville",
            neighborhoods: [
              "Ariana Centre",
              "Ennasr 1",
              "Ennasr 2",
              "Ariana Soukra",
              "Borj Louzir",
              "Cité Ettahrir",
            ],
          },
          {
            name: "La Soukra",
            neighborhoods: ["Soukra Centre", "Soukra Cité"],
          },
          { name: "Raoued", neighborhoods: ["Raoued Centre", "Raoued Plage"] },
          { name: "Sidi Thabet", neighborhoods: ["Sidi Thabet"] },
          { name: "Kalâat el-Andalous", neighborhoods: ["Kalâat el-Andalous"] },
        ],
      },
      {
        name: "Ben Arous",
        cities: [
          { name: "Ben Arous Ville", neighborhoods: ["Centre", "Cité Ennasr"] },
          {
            name: "Hammam Chott",
            neighborhoods: ["Hammam Chott Plage", "Hammam Chott Cité"],
          },
          { name: "Ezzahra", neighborhoods: ["Ezzahra Centre"] },
          {
            name: "Mégrine",
            neighborhoods: ["Mégrine Coteaux", "Mégrine Riadh"],
          },
          { name: "Mornag", neighborhoods: ["Mornag Centre"] },
        ],
      },
      {
        name: "Manouba",
        cities: [
          {
            name: "Manouba Ville",
            neighborhoods: ["Manouba Centre", "Cité Erriadh"],
          },
          { name: "Den Den", neighborhoods: ["Den Den"] },
          { name: "Douar Hicher", neighborhoods: ["Douar Hicher"] },
          { name: "Oued Ellil", neighborhoods: ["Oued Ellil"] },
          { name: "Tebourba", neighborhoods: ["Tebourba"] },
        ],
      },
      {
        name: "Nabeul",
        cities: [
          {
            name: "Nabeul Ville",
            neighborhoods: ["Nabeul Centre", "Nabeul Plage", "Dar Chaabane"],
          },
          {
            name: "Hammamet",
            neighborhoods: [
              "Hammamet Yasmine",
              "Hammamet Sud",
              "Hammamet Nord",
              "Hammamet Centre",
            ],
          },
          { name: "Korba", neighborhoods: ["Korba Centre", "Korba Plage"] },
          {
            name: "Kelibia",
            neighborhoods: ["Kelibia Centre", "Kelibia Port"],
          },
          { name: "Menzel Temime", neighborhoods: ["Menzel Temime Centre"] },
          { name: "El Haouaria", neighborhoods: ["El Haouaria"] },
        ],
      },
      {
        name: "Zaghouan",
        cities: [
          { name: "Zaghouan Ville", neighborhoods: ["Zaghouan Centre"] },
          { name: "Zriba", neighborhoods: ["Zriba"] },
          { name: "Bir Mcherga", neighborhoods: ["Bir Mcherga"] },
          { name: "Fahs", neighborhoods: ["Fahs"] },
        ],
      },
      {
        name: "Bizerte",
        cities: [
          {
            name: "Bizerte Ville",
            neighborhoods: [
              "Bizerte Centre",
              "Bizerte Corniche",
              "Bizerte Plage",
            ],
          },
          { name: "Menzel Bourguiba", neighborhoods: ["Menzel Bourguiba"] },
          { name: "Mateur", neighborhoods: ["Mateur"] },
          { name: "Ras Jebel", neighborhoods: ["Ras Jebel"] },
        ],
      },
      {
        name: "Béja",
        cities: [
          { name: "Béja Ville", neighborhoods: ["Béja Centre"] },
          { name: "Téboursouk", neighborhoods: ["Téboursouk"] },
          { name: "Medjez El Bab", neighborhoods: ["Medjez El Bab"] },
        ],
      },
      {
        name: "Jendouba",
        cities: [
          { name: "Jendouba Ville", neighborhoods: ["Jendouba Centre"] },
          {
            name: "Tabarka",
            neighborhoods: ["Tabarka Centre", "Tabarka Plage"],
          },
          { name: "Aïn Draham", neighborhoods: ["Aïn Draham"] },
        ],
      },
      {
        name: "Le Kef",
        cities: [
          { name: "Le Kef Ville", neighborhoods: ["Le Kef Centre"] },
          { name: "Dahmani", neighborhoods: ["Dahmani"] },
          { name: "Tajerouine", neighborhoods: ["Tajerouine"] },
        ],
      },
      {
        name: "Siliana",
        cities: [
          { name: "Siliana Ville", neighborhoods: ["Siliana Centre"] },
          { name: "Gaafour", neighborhoods: ["Gaafour"] },
          { name: "Bou Arada", neighborhoods: ["Bou Arada"] },
        ],
      },
      {
        name: "Sousse",
        cities: [
          {
            name: "Sousse Ville",
            neighborhoods: [
              "Sousse Médina",
              "Sousse Centre",
              "Sousse Khezama",
              "Sousse Sahloul",
              "Sousse Riadh",
              "Sousse Corniche",
            ],
          },
          { name: "Hammam Sousse", neighborhoods: ["Hammam Sousse"] },
          { name: "Akouda", neighborhoods: ["Akouda"] },
          { name: "Kantaoui", neighborhoods: ["Port El Kantaoui"] },
          { name: "Msaken", neighborhoods: ["Msaken"] },
          { name: "Kalâa Kebira", neighborhoods: ["Kalâa Kebira"] },
        ],
      },
      {
        name: "Monastir",
        cities: [
          {
            name: "Monastir Ville",
            neighborhoods: ["Monastir Centre", "Monastir Marina"],
          },
          { name: "Skanès", neighborhoods: ["Skanès"] },
          { name: "Ksar Hellal", neighborhoods: ["Ksar Hellal"] },
          { name: "Moknine", neighborhoods: ["Moknine"] },
          { name: "Jemmal", neighborhoods: ["Jemmal"] },
        ],
      },
      {
        name: "Mahdia",
        cities: [
          {
            name: "Mahdia Ville",
            neighborhoods: ["Mahdia Centre", "Mahdia Plage"],
          },
          { name: "Bou Merdes", neighborhoods: ["Bou Merdes"] },
          { name: "Chebba", neighborhoods: ["Chebba"] },
          { name: "Ksour Essef", neighborhoods: ["Ksour Essef"] },
        ],
      },
      {
        name: "Sfax",
        cities: [
          {
            name: "Sfax Ville",
            neighborhoods: [
              "Sfax Médina",
              "Sfax Centre",
              "Sfax Sakiet Eddaier",
              "Sfax El Bostan",
              "Sfax Sfax Sud",
              "Sfax Sfax Nord",
            ],
          },
          { name: "Sakiet Ezzit", neighborhoods: ["Sakiet Ezzit"] },
          { name: "Thyna", neighborhoods: ["Thyna"] },
          { name: "El Aïn", neighborhoods: ["El Aïn"] },
        ],
      },
      {
        name: "Kairouan",
        cities: [
          {
            name: "Kairouan Ville",
            neighborhoods: ["Kairouan Médina", "Kairouan Centre"],
          },
          { name: "Sbikha", neighborhoods: ["Sbikha"] },
          { name: "Haffouz", neighborhoods: ["Haffouz"] },
        ],
      },
      {
        name: "Kasserine",
        cities: [
          { name: "Kasserine Ville", neighborhoods: ["Kasserine Centre"] },
          { name: "Sbeitla", neighborhoods: ["Sbeitla"] },
          { name: "Fériana", neighborhoods: ["Fériana"] },
        ],
      },
      {
        name: "Sidi Bouzid",
        cities: [
          { name: "Sidi Bouzid Ville", neighborhoods: ["Sidi Bouzid Centre"] },
          { name: "Regueb", neighborhoods: ["Regueb"] },
          { name: "Meknassi", neighborhoods: ["Meknassi"] },
        ],
      },
      {
        name: "Gabès",
        cities: [
          {
            name: "Gabès Ville",
            neighborhoods: ["Gabès Centre", "Gabès Mtorrech"],
          },
          { name: "Mareth", neighborhoods: ["Mareth"] },
          { name: "Matmata", neighborhoods: ["Matmata"] },
        ],
      },
      {
        name: "Médenine",
        cities: [
          { name: "Médenine Ville", neighborhoods: ["Médenine Centre"] },
          { name: "Djerba Houmt Souk", neighborhoods: ["Houmt Souk"] },
          { name: "Djerba Midoun", neighborhoods: ["Midoun"] },
          { name: "Djerba Ajim", neighborhoods: ["Ajim"] },
          { name: "Zarzis", neighborhoods: ["Zarzis Centre", "Zarzis Plage"] },
          { name: "Ben Gardane", neighborhoods: ["Ben Gardane"] },
        ],
      },
      {
        name: "Tataouine",
        cities: [
          { name: "Tataouine Ville", neighborhoods: ["Tataouine Centre"] },
          { name: "Ghomrassen", neighborhoods: ["Ghomrassen"] },
          { name: "Remada", neighborhoods: ["Remada"] },
        ],
      },
      {
        name: "Gafsa",
        cities: [
          { name: "Gafsa Ville", neighborhoods: ["Gafsa Centre"] },
          { name: "Métlaoui", neighborhoods: ["Métlaoui"] },
          { name: "Redeyef", neighborhoods: ["Redeyef"] },
        ],
      },
      {
        name: "Tozeur",
        cities: [
          {
            name: "Tozeur Ville",
            neighborhoods: ["Tozeur Centre", "Tozeur Médina"],
          },
          { name: "Nefta", neighborhoods: ["Nefta"] },
          { name: "Degache", neighborhoods: ["Degache"] },
        ],
      },
      {
        name: "Kébili",
        cities: [
          { name: "Kébili Ville", neighborhoods: ["Kébili Centre"] },
          { name: "Douz", neighborhoods: ["Douz Centre"] },
          { name: "Souk Lahad", neighborhoods: ["Souk Lahad"] },
        ],
      },
    ],
  },
  {
    code: "FR",
    name_fr: "France",
    name_en: "France",
    name_ar: "فرنسا",
    flag: "🇫🇷",
    currency: "EUR",
    regions: [
      {
        name: "Île-de-France",
        cities: [
          {
            name: "Paris",
            neighborhoods: [
              "1er",
              "2e",
              "3e",
              "4e",
              "5e",
              "6e",
              "7e",
              "8e",
              "9e",
              "10e",
              "11e",
              "12e",
              "13e",
              "14e",
              "15e",
              "16e",
              "17e",
              "18e",
              "19e",
              "20e",
            ],
          },
          { name: "Versailles", neighborhoods: ["Centre", "Notre-Dame"] },
          { name: "Boulogne-Billancourt", neighborhoods: ["Centre"] },
          { name: "Neuilly-sur-Seine", neighborhoods: ["Centre"] },
          { name: "Saint-Denis", neighborhoods: ["Centre"] },
        ],
      },
      {
        name: "Provence-Alpes-Côte d'Azur",
        cities: [
          {
            name: "Marseille",
            neighborhoods: ["1er", "2e", "5e", "6e", "8e", "13e"],
          },
          { name: "Nice", neighborhoods: ["Centre", "Cimiez", "Vieux Nice"] },
          { name: "Cannes", neighborhoods: ["Centre", "Croisette"] },
          { name: "Aix-en-Provence", neighborhoods: ["Centre", "Mazarin"] },
        ],
      },
      {
        name: "Auvergne-Rhône-Alpes",
        cities: [
          { name: "Lyon", neighborhoods: ["1er", "2e", "3e", "6e", "7e"] },
          { name: "Grenoble", neighborhoods: ["Centre"] },
          { name: "Saint-Étienne", neighborhoods: ["Centre"] },
        ],
      },
      {
        name: "Nouvelle-Aquitaine",
        cities: [
          { name: "Bordeaux", neighborhoods: ["Centre", "Chartrons"] },
          { name: "Toulouse", neighborhoods: ["Centre", "Capitole"] },
        ],
      },
      {
        name: "Occitanie",
        cities: [
          { name: "Montpellier", neighborhoods: ["Centre", "Antigone"] },
          { name: "Toulouse", neighborhoods: ["Centre"] },
        ],
      },
      {
        name: "Grand Est",
        cities: [
          { name: "Strasbourg", neighborhoods: ["Centre"] },
          { name: "Metz", neighborhoods: ["Centre"] },
        ],
      },
    ],
  },
  {
    code: "DZ",
    name_fr: "Algérie",
    name_en: "Algeria",
    name_ar: "الجزائر",
    flag: "🇩🇿",
    currency: "DZD",
    regions: [
      {
        name: "Alger",
        cities: [
          {
            name: "Alger Centre",
            neighborhoods: ["Alger Centre", "Bab El Oued", "Hydra", "El Biar"],
          },
          { name: "Hussein Dey", neighborhoods: ["Hussein Dey"] },
        ],
      },
      {
        name: "Oran",
        cities: [{ name: "Oran Ville", neighborhoods: ["Centre", "Es-Senia"] }],
      },
      {
        name: "Constantine",
        cities: [{ name: "Constantine Ville", neighborhoods: ["Centre"] }],
      },
    ],
  },
  {
    code: "MA",
    name_fr: "Maroc",
    name_en: "Morocco",
    name_ar: "المغرب",
    flag: "🇲🇦",
    currency: "MAD",
    regions: [
      {
        name: "Casablanca-Settat",
        cities: [
          {
            name: "Casablanca",
            neighborhoods: [
              "Maarif",
              "Anfa",
              "Ain Diab",
              "Bourgogne",
              "Gauthier",
            ],
          },
        ],
      },
      {
        name: "Rabat-Salé-Kénitra",
        cities: [
          { name: "Rabat", neighborhoods: ["Agdal", "Hassan", "Souissi"] },
          { name: "Salé", neighborhoods: ["Salé Centre"] },
        ],
      },
      {
        name: "Marrakech-Safi",
        cities: [
          {
            name: "Marrakech",
            neighborhoods: ["Médina", "Gueliz", "Hivernage"],
          },
        ],
      },
      {
        name: "Tanger-Tétouan",
        cities: [
          { name: "Tanger", neighborhoods: ["Centre", "Marshan"] },
          { name: "Tétouan", neighborhoods: ["Centre"] },
        ],
      },
    ],
  },
  {
    code: "CA",
    name_fr: "Canada",
    name_en: "Canada",
    name_ar: "كندا",
    flag: "🇨🇦",
    currency: "CAD",
    regions: [
      {
        name: "Québec",
        cities: [
          {
            name: "Montréal",
            neighborhoods: [
              "Centre-ville",
              "Plateau-Mont-Royal",
              "Outremont",
              "Westmount",
            ],
          },
          { name: "Québec", neighborhoods: ["Vieux-Québec", "Saint-Roch"] },
        ],
      },
      {
        name: "Ontario",
        cities: [
          { name: "Toronto", neighborhoods: ["Downtown", "North York"] },
          { name: "Ottawa", neighborhoods: ["Centre"] },
        ],
      },
    ],
  },
  {
    code: "BE",
    name_fr: "Belgique",
    name_en: "Belgium",
    name_ar: "بلجيكا",
    flag: "🇧🇪",
    currency: "EUR",
    regions: [
      {
        name: "Bruxelles-Capitale",
        cities: [
          {
            name: "Bruxelles",
            neighborhoods: ["Centre", "Ixelles", "Saint-Gilles"],
          },
        ],
      },
    ],
  },
  {
    code: "DE",
    name_fr: "Allemagne",
    name_en: "Germany",
    name_ar: "ألمانيا",
    flag: "🇩🇪",
    currency: "EUR",
    regions: [
      {
        name: "Berlin",
        cities: [
          {
            name: "Berlin",
            neighborhoods: ["Mitte", "Kreuzberg", "Prenzlauer Berg"],
          },
        ],
      },
    ],
  },
  {
    code: "AE",
    name_fr: "Émirats arabes unis",
    name_en: "United Arab Emirates",
    name_ar: "الإمارات العربية المتحدة",
    flag: "🇦🇪",
    currency: "AED",
    regions: [
      {
        name: "Dubaï",
        cities: [
          {
            name: "Dubaï",
            neighborhoods: ["Downtown", "Marina", "Jumeirah", "Deira"],
          },
        ],
      },
      {
        name: "Abu Dhabi",
        cities: [{ name: "Abu Dhabi", neighborhoods: ["Centre"] }],
      },
    ],
  },
  {
    code: "SA",
    name_fr: "Arabie saoudite",
    name_en: "Saudi Arabia",
    name_ar: "المملكة العربية السعودية",
    flag: "🇸🇦",
    currency: "SAR",
    regions: [
      {
        name: "Riyad",
        cities: [{ name: "Riyad", neighborhoods: ["Centre", "Olaya"] }],
      },
      {
        name: "La Mecque",
        cities: [
          { name: "La Mecque", neighborhoods: ["Centre"] },
          { name: "Djeddah", neighborhoods: ["Centre", "Corniche"] },
        ],
      },
    ],
  },
];

// Helpers
export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function getRegionsByCountry(code: string): Region[] {
  return getCountryByCode(code)?.regions ?? [];
}

export function getCitiesByRegion(
  countryCode: string,
  regionName: string,
): City[] {
  return (
    getRegionsByCountry(countryCode).find((r) => r.name === regionName)
      ?.cities ?? []
  );
}

export function getNeighborhoodsByCity(
  countryCode: string,
  regionName: string,
  cityName: string,
): string[] {
  return (
    getCitiesByRegion(countryCode, regionName).find((c) => c.name === cityName)
      ?.neighborhoods ?? []
  );
}
