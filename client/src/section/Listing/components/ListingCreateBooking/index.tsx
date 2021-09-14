import React from 'react';
import { Button, Card, Divider, Typography, DatePicker } from 'antd';
import moment, { Moment } from 'moment';

import {
  formatListingPrice,
  displayErrorMessage
} from '../../../../lib/utils/';

const { Paragraph, Title } = Typography;

interface Props {
  price: number;
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (date: Moment | null) => void;
  setCheckOutDate: (date: Moment | null) => void;
}

export const ListingCreateBooking = ({
  price,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate
}: Props) => {
  const disabledDate = (currendDate: Moment) => {
    if (!currendDate) return false;

    // if checkoutDate is before CheckIn then return error
    const dateIsBeforeEndOFDate = currendDate.isBefore(moment().endOf('day'));

    return dateIsBeforeEndOFDate;
  };

  const verifyAndSetCheckOutDate = (checkOutDate: Moment | null) => {
    if (checkInDate && checkOutDate) {
      if (moment(checkOutDate).isBefore(checkInDate, 'days')) {
        return displayErrorMessage(
          "you can't book  date of check out to be prior to checkin!"
        );
      }
    }

    setCheckOutDate(checkOutDate);
  };

  const checkOutInputDisabled = !checkInDate;
  const butonDisabled = !checkInDate || !checkOutDate;
  return (
    <div className='listing-booking'>
      <Card className='listing-booking__card'>
        <div>
          <Paragraph>
            <Title level={2} className='listing-booking__card-title'>
              {formatListingPrice(price)}
              <span>/day</span>
            </Title>
          </Paragraph>
          <Divider />

          <div className='listing-booking__card-date-picker'>
            <Paragraph strong>Check in </Paragraph>
            <DatePicker
              value={checkInDate}
              format={'YYYY/MM/DD'}
              disabledDate={disabledDate}
              showToday={false}
              onChange={value => setCheckInDate(value)}
            />
          </div>

          <div className='listing-booking__card-date-picker'>
            <Paragraph strong>Check out </Paragraph>
            <DatePicker
              format={'YYYY/MM/DD'}
              value={checkOutDate}
              showToday={false}
              disabled={checkOutInputDisabled}
              disabledDate={disabledDate}
              onChange={value => verifyAndSetCheckOutDate(value)}
              onOpenChange={() => setCheckOutDate(null)}
            />
          </div>
        </div>
        <Divider />
        <Button
          disabled={butonDisabled}
          size='large'
          type='primary'
          className='listing-booking__card-cta'
        >
          Reqeust to book!
        </Button>
      </Card>
    </div>
  );
};
