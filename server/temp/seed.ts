import * as dotenv from 'dotenv';
dotenv.config();
import {ObjectId} from 'mongodb';

import { connectDatabase } from '../src/database';
import {Listing} from '../src/lib/types';

// function to add mock data into mongodb
const seed = async () => {
  try {
    const db = await connectDatabase();

    const listings: Listing[] = [
      {
        _id: new ObjectId(),
        title: ' Clean and fully Furnished Apartment',
        image:
          'https://global-uploads.webflow.com/5cd1e68968db65ba07de7bfb/5ef278c38cde112248527a36_MC2A2593-p-1600.jpeg',
        address: '3210 Scotchmere Dr W, Toronto, ON, CA',
        price: 10000,
        numOfGuests: 2,
        numOfBeds: 2,
        numOfBaths: 2,
        rating: 5
      },
      {
        _id: new ObjectId(),
        title: ' Luxurious home with private pool',
        image:
          'https://global-uploads.webflow.com/5cd1e68968db65ba07de7bfb/5ef278c38cde112248527a36_MC2A2593-p-1600.jpeghttps://global-uploads.webflow.com/5cd1e68968db65ba07de7bfb/605cca06007e331f2da86574_Cal%20Tiny%20Surf%20House.png',
        address: 'California',
        price: 15000,
        numOfGuests: 5,
        numOfBeds: 1,
        numOfBaths: 3,
        rating: 1
      },

      {
        _id: new ObjectId(),
        title: ' Tiny House on Wheels',
        image:
          'https://global-uploads.webflow.com/5cd1e68968db65ba07de7bfb/5fee5e4e01923a939af5adcc_car_back-p-1600.jpeg',
        address: 'Canada',
        price: 20000,
        numOfGuests: 2,
        numOfBeds: 2,
        numOfBaths: 2,
        rating: 3
      }
    ];

   // insert array in listing collection
    await db.listings.insertMany(listings)

    console.log('[seed]: successfully added mock data')
  } catch {
    throw new Error('failed to seed database');
  }
};

seed();
