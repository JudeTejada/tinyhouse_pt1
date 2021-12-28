import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { Moment } from 'moment';
import { useParams } from 'react-router';
import { Layout, Col, Row } from 'antd';

import { PageSkeleton, ErrorBanner } from '../../lib/components';
import {
  ListingDetails,
  ListingBookings,
  ListingCreateBooking
} from './components';

import { LISTING } from '../../lib/graphql/queries';
import {
  Listing as ListingData,
  ListingVariables
} from '../../lib/graphql/queries/Listing/__generated__/Listing';

interface MatchParams {
  id: string;
}

const PAGE_LIMIT = 4;

const { Content } = Layout;

export const Listing = () => {
  const [bookingsPage, setBookingsPage] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);

  const { listingId } = useParams();

  const { loading, data, error } = useQuery<ListingData, ListingVariables>(
    LISTING,
    {
      variables: {
        id: listingId ?? '',
        bookingsPage,
        limit: PAGE_LIMIT
      }
    }
  );

  if (loading) {
    return (
      <Content className='listings'>
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className='listings'>
        <ErrorBanner description='This listing may not be exist or we encountered an error. Please try again' />
        <PageSkeleton />
      </Content>
    );
  }

  const listing = data ? data.listing : null;
  const listingBookings = listing ? listing.bookings : null;

  const listingDetailsElement = listing ? (
    <ListingDetails listing={listing} />
  ) : null;

  const listingBookingsElement = listingBookings ? (
    <ListingBookings
      listingsBooking={listingBookings}
      limit={PAGE_LIMIT}
      page={bookingsPage}
      setBookingsPage={setBookingsPage}
    />
  ) : null;

  const listingCreateBookingElement = listing && (
    <ListingCreateBooking
      price={listing.price}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      setCheckInDate={setCheckInDate}
      setCheckOutDate={setCheckOutDate}
    />
  );

  return (
    <Content className='listings'>
      <Row gutter={24} justify='space-between'>
        <Col xs={24} lg={14}>
          {listingDetailsElement}
          {listingBookingsElement}
        </Col>
        <Col xs={24} lg={10}>
          {listingCreateBookingElement}
        </Col>
      </Row>
    </Content>
  );
};
