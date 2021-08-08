import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  useMutation
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Layout, Affix, Spin } from 'antd';
import {
  Home,
  Host,
  Listing,
  Listings,
  NotFound,
  User,
  Login,
  AppHeader
} from './section';
import { AppHeaderSkeleton, ErrorBanner } from './lib/components';

import './styles/index.css';

import { Viewer } from './lib/types';

import { LOG_IN } from './lib/graphql/mutations/';
import {
  LogIn as LogInData,
  LogInVariables
} from './lib/graphql/mutations/LogIn/__generated__/LogIn';
import reportWebVitals from './reportWebVitals';

const httpLink = createHttpLink({
  uri: '/api'
});

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem('token');

  console.log('token: ' + token);
  return {
    headers: {
      ...headers,
      'X-CSRF-TOKEN': token || ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: data => {
      if (data && data.logIn) setViewer(data.logIn);

      if (data.logIn.token) {
        sessionStorage.setItem('token', data.logIn.token);
      } else {
        sessionStorage.removeItem('token');
      }
    }
  });

  const logInref = useRef(logIn);

  useEffect(() => {
    logInref.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className='app-skeleton'>
        <AppHeaderSkeleton />
        <div className='app-skeleton__spin-section'>
          <Spin size='large' tip='launching Tinyhouse' />
        </div>
      </Layout>
    );
  }

  const logInErrorBannerElement = error && (
    <ErrorBanner description='we were not able to verify if you were logged in. Pleas try agan' />
  );
  return (
    <BrowserRouter>
      {logInErrorBannerElement}
      <Layout id='app'>
        <Affix offsetTop={0} className='app__affix-header'>
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/host' component={Host} />
          <Route
            exact
            path='/login'
            render={props => <Login {...props} setViewer={setViewer} />}
          />
          <Route exact path='/listing/:id' component={Listing} />
          <Route exact path='/listing/:location?' component={Listings} />
          <Route exact path='/user/:id' component={User} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
