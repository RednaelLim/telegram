import { PeerPhoto } from 'containers/PeerPhoto';
import * as React from 'react';
import * as style from './style.css';

interface OwnProps {
  id: number;
  date: number;
  user: number;
  // TODO: Should be children?
  text: React.ReactNode;
}

const formatTime = (date: number) => {
  const dateObject = new Date(date * 1000);
  return {
    dateString: dateObject.toLocaleDateString(),
    timeString: dateObject.toLocaleTimeString(),
  };
};

type TimeProps = { date: number };
const Time = ({ date }: TimeProps) => {
  const { timeString } = formatTime(date);
  return (
    <div className={style.time}>
      <span>{timeString}</span>
    </div>
  );
};

export const Message = ({ user, date, text }: OwnProps) => {
  console.debug(`Message`, user, text);
  return (
    <div className={style.message}>
      <div className={style.flexcontainer}>
        <PeerPhoto peerID={user} className={style.messageavatar}/>
        <div
          className={style.messagebody}>
          <div className={style.sender}>{user}</div>
          <div className={style.textbody}>
            <div className={style.text}>{text}</div>
            <Time date={date} />
          </div>
        </div>
      </div>
    </div>
  );
};
