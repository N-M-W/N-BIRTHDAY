export interface Gift {
  id: string;
  name: string;
  image: string;
  claimedBy: string | null;
}

export const giftsData: Gift[] = [
  { id: "iphone", name: "iPhone 17 Pro Max", image: "/images/iphone.png", claimedBy: null },
  { id: "watch", name: "Apple Watch Ultra", image: "/images/watch.png", claimedBy: null },
  { id: "jewelry", name: "Bijoux en Or", image: "/images/jewelry.png", claimedBy: null },
  { id: "money", name: "Argent Cash 💸", image: "/images/money.png", claimedBy: null },
  { id: "earbuds", name: "Huawei FreeClip", image: "/images/earbuds.png", claimedBy: null },
  { id: "bag", name: "Sac Polène", image: "/images/bag.png", claimedBy: null },
  { id: "car", name: "Voiture 🚗", image: "/images/car.png", claimedBy: null },
  { id: "dior", name: "Maquillage Dior", image: "/images/dior.png", claimedBy: null },
  { id: "dyson", name: "Dyson Airwrap", image: "/images/dyson.png", claimedBy: null },
];
