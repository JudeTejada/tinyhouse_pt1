import { server, useQuery } from '../../lib/api';
import {
  ListingsData,
  DeleteListingData,
  DeleteListingVariables,

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
  const { data, refetch, loading,error } = useQuery<ListingsData>(LISTINGS);

  const deleteListing = async (id: string) => {
    await server.fetch<DeleteListingData, DeleteListingVariables>({
      query: DELETE_LISTING,
      variables: {
        id
      }
    });

    refetch();
  };

  const listings = data ? data.listings : [];

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

  if (loading) {
    return <h2>loading...</h2>;
  }
  if(error){
    return <h2>Something went wrong</h2>
  }
  return (
    <div>
      <h2>{title}</h2>

      {listingsList}
    </div>
  );
};
