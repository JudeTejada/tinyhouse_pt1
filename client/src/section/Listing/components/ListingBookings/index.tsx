import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Divider, List, Typography } from 'antd';
import { Listing } from '../../../../lib/graphql/queries/Listing/__generated__/Listing';

interface listingsBookingProps {
  listingsBooking: Listing['listing']['bookings'];
  page: number;
  limit: number;
  setBookingsPage: (page: number) => void;
}

const { Text, Title } = Typography;

export function ListingBookings({
  listingsBooking,
  page,
  limit,
  setBookingsPage
}: listingsBookingProps) {
  const total = listingsBooking ? listingsBooking.total : null;
  const result = listingsBooking ? listingsBooking.result : null;

  const listingBookingList = listingsBooking ? (
    <List
      grid={{
        gutter: 8,
        xs: 1,
        sm: 2,
        lg: 3
      }}
      dataSource={result || undefined}
      locale={{ emptyText: 'No bookings have been made yet' }}
      pagination={{
        position: 'top',
        current: page,
        total: total || undefined,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page: number) => setBookingsPage(page)
      }}
      renderItem={listingBookings => {
        const bookingHistory = (
          <div className='listing-bookings__history'>
            <div>
              Check in: <Text strong>{listingBookings.checkIn}</Text>
            </div>
            <div>
              Check out: <Text strong>{listingBookings.checkOut}</Text>
            </div>
          </div>
        );

        return (
          <List.Item className='listing-bookings__item'>
            {bookingHistory}
            <Link to={`/user/${listingBookings.tenant.id}`}>
              <Avatar
                src={listingBookings.tenant.avatar}
                size={64}
                shape='square'
              />
            </Link>
          </List.Item>
        );
      }}
    />
  ) : null;

  const listingBookingsElement = listingBookingList ? (
    <div className='user-bookings'>
      <Divider />
      <div className='listing-bookings__section'>
        <Title level={4} className='user-bookings__title'>
          Bookings
        </Title>
      </div>

      {listingBookingList}
    </div>
  ) : null;

  return listingBookingsElement;
}
