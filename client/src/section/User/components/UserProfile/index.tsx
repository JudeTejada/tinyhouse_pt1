import { Avatar, Card, Divider, Typography, Button } from 'antd';

import { User as UserData } from '../../../../lib/graphql/queries/User/__generated__/User';

interface Props {
  user: UserData['user'];
  viewerIsUser: boolean;
}

const { Paragraph, Text, Title } = Typography;

export const UserProfile = ({ user, viewerIsUser }: Props) => {



  const additionalDetailsSection = viewerIsUser && (
    <>
      <Divider />
      <div className='user-profile__details'>
        <Title level={4}>Additional Details</Title>
        <Paragraph>
          Interested in becoming a Tinyhouse host? register with your stripe
          account!
        </Paragraph>
        <Button type='primary' className='user-profile__details-cta'>
          Connect with Stripe
        </Button>
        <Paragraph type='secondary'>
          Tinyhouse uses{' '}
          <a
            href='https://stripe.com/en-US/connect'
            target='_blank'
            rel='noreferrer'
          >
            Stripe
          </a>{' '}
          to help transfer your earnings in a secure and trusted way
        </Paragraph>
      </div>
    </>
  );

  return (
    <div className='user-profile'>
      <Card className='user-profile__card'>
        <div className='user-profile__avatar'>
          <Avatar size={100} src={user.avatar} />
        </div>
        <Divider />

        <div className='user-profile__details'>
          <Title level={4}>Details</Title>
          <Paragraph>
            Name:<Text strong>{user.name}</Text>
          </Paragraph>

          <Paragraph>
            Contact:<Text strong>{user.contact}</Text>
          </Paragraph>
        </div>
        {additionalDetailsSection}
      </Card>
    </div>
  );
};
