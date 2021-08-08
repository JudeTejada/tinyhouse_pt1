import { IResolvers } from 'apollo-server-express';
import { Request } from 'express';

import { Database, User } from '../../../lib/types';
import { authorize } from '../../../lib/util/index';

import {
  UserArgs,
  UserBookingArgs,
  UserBookingsData,
  UserListingsArgs,
  UserListingData
} from './types';

export const userResolvers: IResolvers = {
  Query: {
    user: async (
      _root: undefined,
      { id }: UserArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<User> => {
      try {
        const user = await db.users.findOne({ _id: id });

        if (!user) {
          throw new Error("user can't be found");
        }

        const viewer = await authorize(db, req);
        // check if the user that's requeesting is the user that  is signed in
        if (viewer && viewer._id === user._id) {
          user.authorized = true;
        }

        return user;
      } catch (error) {
        throw new Error(`Failed to query user: ${error}`);
      }
    }
  },
  User: {
    id: (user: User): string => {
      return user._id;
    },
    hasWallet: (user: User): boolean => {
      return Boolean(user.walletId);
    },
    income: (user: User): number | null => {
      return user.authorized ? user.income : null;
    },
    bookings: async (
      user: User,
      { limit, page }: UserBookingArgs,
      { db }: { db: Database }
    ): Promise<UserBookingsData | null> => {
      try {
        if (!user.authorized) {
          return null;
        }

        const data: UserBookingsData = {
          total: 0,
          result: []
        };

        //find bookings that is eqaul to the id we passed
        let cursor = await db.bookings.find({ _id: { $in: user.bookings } });

        /*
         * page is 0  then return the first bookings
         * page is 2 or greater skip the current values and return then ext one
         */
        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);

        cursor = cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`Failed to query user bookings : ${error}`);
      }
    },
    listings: async (
      user: User,
      { limit, page }: UserListingsArgs,
      { db }: { db: Database }
    ): Promise<UserListingData | null> => {
      try {
        const data: UserListingData = {
          total: 0,
          result: []
        };

        //find bookings that is eqaul to the id we passed
        let cursor = await db.listings.find({ _id: { $in: user.listings } });

        /*
         * page is 0  then return the first bookings
         * page is 2 or greater skip the current values and return then ext one
         */
        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);

        cursor = cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`Failed to query user listings : ${error}`);
      }
    }
  }
};
