// define graphql resolvers
import { IResolvers } from 'apollo-server-express';
import { ObjectId } from 'mongodb';

import { Database, EmptyObject, Listing } from '../../../lib/types';

//setup a grap hql resolvers function
export const ListingResolvers: IResolvers = {
  Query: {
    listings: async (
      _root: undefined,
      _args: EmptyObject,
      { db }: { db: Database }
    ): Promise<Listing[]> => {
      return await db.listings.find({}).toArray();
    }
  },

  Mutation: {
    deleteListing: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing> => {
      const deleteResult = await db.listings.findOneAndDelete({
        _id: new ObjectId(id)
      });
      // if failed to delete return error
      if (!deleteResult.value) {
        throw new Error('failed to delete');
      }
      return deleteResult.value;
    }
  },
  Listing: {
    id: (listing: Listing): string => listing._id.toString()
  }
};
