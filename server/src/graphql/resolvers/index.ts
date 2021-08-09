import merge from 'lodash.merge';
import { viewerResolvers } from './Viewer';
import { userResolvers } from './User';
import { listingsResolvers } from './Listing';
import { bookingResolvers } from './Booking';

export const resolvers = merge(
  userResolvers,
  viewerResolvers,
  listingsResolvers,
  bookingResolvers
);
