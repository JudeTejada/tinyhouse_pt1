import { useQuery } from '@apollo/client';
import { useParams } from 'react-router';
import { Col, Layout, Row } from 'antd';
import { useState } from 'react';

import { UserProfile, UserListings, UserBookings } from './components';

import { USER } from '../../lib/graphql/queries/User/';
import {
  User as UserData,
  UserVariables
} from '../../lib/graphql/queries/User/__generated__/User';

import { Viewer } from '../../lib/types';
import { PageSkeleton, ErrorBanner } from '../../lib/components';

interface Props {
  viewer: Viewer;
}

interface MatchParams {
  id: string;
}
const { Content } = Layout;

const PAGE_LIMIT = 4;

export const User = ({ viewer }: Props) => {
  const [listingsPage, setListingsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);

  const { userId } = useParams();

  const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
    variables: {
      id: userId ?? '',
      bookingsPage,
      listingsPage,
      limit: PAGE_LIMIT
    }
  });

  if (loading) {
    return (
      <Content className='user'>
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className='user'>
        <ErrorBanner description="This user may not exist or we've encountered an error. Please try again!" />
        <PageSkeleton />
      </Content>
    );
  }

  const user = data ? data.user : null;

  const viewerIsUser = viewer.id === userId;

  const userListings = user ? user.listings : null;
  const userBookings = user ? user.bookings : null;

  const userProfleElement = user ? (
    <UserProfile user={user} viewerIsUser={viewerIsUser} />
  ) : null;

  const userListingsElement = userListings && (
    <UserListings
      userListings={userListings}
      listingsPage={listingsPage}
      limit={PAGE_LIMIT}
      setListingsPage={setListingsPage}
    />
  );

  const userBookingsElement = userBookings && (
    <UserBookings
      userBookings={userBookings}
      page={bookingsPage}
      limit={PAGE_LIMIT}
      setBookingsPage={setBookingsPage}
    />
  );

  return (
    <Content className='user'>
      <Row gutter={12} justify='space-between'>
        <Col xs={24}>{userProfleElement}</Col>
        <Col xs={24}>
          {userListingsElement}

          {userBookingsElement}
        </Col>
      </Row>
    </Content>
  );
};
