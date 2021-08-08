import { Button, Menu, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import {  useMutation } from '@apollo/client';


import { LOG_OUT } from '../../../../lib/graphql/mutations/';
import { LogOut as LogOutData } from '../../../../lib/graphql/mutations/LogOut/__generated__/LogOut';

import { Viewer } from '../../../../lib/types';

import {
  displaySuccessNotification,
  displayErrorMessage
} from '../../../../lib/utils/';

import { HomeOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
const { Item, SubMenu } = Menu;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: data => {
      if (data && data.logOut) {
        setViewer(data.logOut);
        sessionStorage.removeItem('token');
        displaySuccessNotification("You've succesfully logged out!");
      }
    },
    onError: data => {
      displayErrorMessage(
        "Sorry we weren't able to log you out, please try again later!"
      );
    }
  });

  const handleLogout = () => {
    logOut();
  };

  const subMenuLogin =
    viewer.id && viewer.avatar ? (
      <SubMenu title={<Avatar src={viewer.avatar} />}>
        <Item key='/user'>
          <Link to={`/user/${viewer.id}`}>
            <UserOutlined></UserOutlined>
            Profile
          </Link>
        </Item>
        <Item key='/logout'>
          <div onClick={handleLogout}>
            <LogoutOutlined></LogoutOutlined>
            Log out
          </div>
        </Item>
      </SubMenu>
    ) : (
      <Item>
        <Link to='/login'>
          <Button type='primary'>Sign In</Button>
        </Link>
      </Item>
    );

  return (
    <Menu mode='horizontal' selectable={false} className='menu'>
      <Item key='/host'>
        <Link to='/host'>
          <HomeOutlined />
          Host
        </Link>
      </Item>
      {subMenuLogin}
    </Menu>
  );
};
