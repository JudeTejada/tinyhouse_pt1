interface Listing {
  id: string;
  title: string;
  image: string;
  address: string;
  price: number;
  numOfGuests: number;
  numOfBeds: number;
  numOfBaths: number;
  rating: number;

}

// array of Listing object
export const listings: Listing[] = [
  {
    id: "001",
    title: " Clean and fully Furnished Apartment",
    image:
      "https://global-uploads.webflow.com/5cd1e68968db65ba07de7bfb/5ef278c38cde112248527a36_MC2A2593-p-1600.jpeg",
    address: "3210 Scotchmere Dr W, Toronto, ON, CA",
    price: 10000,
    numOfGuests: 2,
    numOfBeds: 2,
    numOfBaths: 2,
    rating: 5
  },
  {
    id: "002",
    title: " Luxurious home with private pool",
    image:
      "https://global-uploads.webflow.com/5cd1e68968db65ba07de7bfb/5ef278c38cde112248527a36_MC2A2593-p-1600.jpeghttps://global-uploads.webflow.com/5cd1e68968db65ba07de7bfb/605cca06007e331f2da86574_Cal%20Tiny%20Surf%20House.png",
    address: "California",
    price: 15000,
    numOfGuests: 5,
    numOfBeds: 1,
    numOfBaths: 3,
    rating: 1,
  },

  {
    id: "003",
    title: " Tiny House on Wheels",
    image:
      "https://global-uploads.webflow.com/5cd1e68968db65ba07de7bfb/5fee5e4e01923a939af5adcc_car_back-p-1600.jpeg",
    address: "Canada",
    price: 20000,
    numOfGuests: 2,
    numOfBeds: 2,
    numOfBaths: 2,
    rating: 3,
  },
];
