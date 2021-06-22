import { useState, useEffect } from 'react';

import { server } from '../../lib/api';
import {
  ListingsData,
  DeleteListingData,
  DeleteListingVariables,
  Listing
} from './type';

const LISTINGS = `
query Listings {
  listings{
    id
    title
    image
    address
    price
    numOfGuests
    numOfBeds
    numOfBaths
    rating
  }
}

`;
const DELETE_LISTING = `

  mutation DeleteListing ($id: ID!) {
    deleteListing(id:  $id) {
      id
    }
  }
`;

interface ListingsProps {
  title: string;
}

export const Listings = ({ title }: ListingsProps) => {
  const [listings, setListings] = useState<Listing[] | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const { data } = await server.fetch<ListingsData>({ query: LISTINGS });

    setListings(data.listings);
  };

  const deleteListing = async (id: string) => {
    await server.fetch<DeleteListingData, DeleteListingVariables>({
      query: DELETE_LISTING,
      variables: {
        id
      }
    });

    fetchListings();
  };

  const listingsList = listings ? (
    <ul>
      {listings.map(listing => (
        <>
          <li key={listing.id}>
            {listing.title}
            <button onClick={() => deleteListing(listing.id)}>delete</button>
          </li>
        </>
      ))}
    </ul>
  ) : null;

  return (
    <div>
      <h2>{title}</h2>

      {listingsList}
    </div>
  );
};
