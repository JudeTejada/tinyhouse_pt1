import { Card, Layout, Typography, Spin } from 'antd';
import { Redirect } from 'react-router';
import { useApolloClient, useMutation } from '@apollo/client';
import { Viewer } from '../../lib/types';
import { AUTH_URL } from '../../lib/graphql/queries/AuthUrl/';
import { AuthUrl as AuthUrlData } from '../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl';
import { LOG_IN } from '../../lib/graphql/mutations';
import {
  LogIn as LogInData,
  LogInVariables
} from '../../lib/graphql/mutations/LogIn/__generated__/LogIn';

import { ErrorBanner } from '../../lib/components';
import {
  displaySuccessNotification,
  displayErrorMessage
} from '../../lib/utils';

//assets
import googleLogo from './assets/google_logo.png';
import { useEffect, useRef } from 'react';

interface Props {
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;
const { Text, Title } = Typography;

export const Login = ({ setViewer }: Props) => {
  const client = useApolloClient();
  const [logIn, { data: logInData, loading: logInLoading, error: logInError }] =
    useMutation<LogInData, LogInVariables>(LOG_IN, {
      onCompleted: data => {
        if (data && data.logIn && data.logIn.token) {
          setViewer(data.logIn);
          sessionStorage.setItem('token', data.logIn.token);
          displaySuccessNotification('succesfully, logged in.');
        }
      }
    });

  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');

    if (code) {
      try {
        logInRef.current({
          variables: {
            input: { code }
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({ query: AUTH_URL });

      window.location.href = data.authUrl;
    } catch {
      displayErrorMessage(
        'Sorry, we were not able to log you in. Please try again'
      );
    }
  };

  if (logInLoading) {
    return (
      <Content className='log-in'>
        <Spin size='large' tip='logging you inn....' />
      </Content>
    );
  }
  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn;
    return <Redirect to={`/user/${viewerId}`} />;
  }

  const logInErrorBannerElement = logInError && (
    <ErrorBanner description='Sorry, we were not able to log you in. Please try again' />
  );
  return (
    <Content className='log-in'>
      {logInErrorBannerElement}
      <Card className='log-in-card'>
        <div className='log-in-icard__intro'>
          <Title level={3} className='log-in-card__intro-title'>
            <span role='img' aria-label='wave'>
              👋
            </span>
          </Title>

          <Title level={3} className='log-in-card__intro-title'>
            Log in to Tinyhouse!
          </Title>
          <Text>Sign in with Google to start booking available rentals!</Text>
          <button
            className='log-in-card__google-button'
            onClick={handleAuthorize}
          >
            <img
              src={googleLogo}
              alt='Google Logo'
              className='log-in-card__google-button-logo'
            />
            <span className='log-in-card__google-button-text'>
              Sign in with Google
            </span>
          </button>
          <Text type='secondary'>
            Note: By signing in, you'll be redirected to google consent form to
            be sign it with google.
          </Text>
        </div>
      </Card>
    </Content>
  );
};
