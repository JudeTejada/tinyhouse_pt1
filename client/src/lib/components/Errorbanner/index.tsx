import { Alert } from 'antd';

interface Props {
  message?: string;
  description?: string;
}

export const ErrorBanner = ({
  message = 'Uh oh, something went wrong',
  description = 'look like something went wrong. Please check your connection or try again later'
}: Props) => {
  return (
    <Alert
      banner
      closable
      message={message}
      description={description}
      type='error'
      className='error-banner'
    />
  );
};