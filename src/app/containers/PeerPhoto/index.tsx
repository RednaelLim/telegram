import * as classNames from 'classnames';
import { PeerPhoto, PeerPhotoEmpty } from 'components/PeerPhoto';
import picStore from 'helpers/FileManager/picStore';
import { pathOr } from 'ramda';
import * as React from 'react';
import { connect } from 'react-redux';
import { FileStatus } from 'redux/modules/files';
import { Store } from 'redux/store.h';

interface ConnectedState {
  photoId: number | 'default';
}

interface OwnProps {
  peerID: number;
  withPhoto?: boolean;
  className?: string;
}

type Props = ConnectedState & OwnProps;

const PeerPhotoContainer = ({ photoId, className = '' }: Props) => {
  const css = classNames('avatar', className);
  return picStore.has(photoId)
    ? <PeerPhoto id={photoId} className={css} />
    : <PeerPhotoEmpty className={css}/>;
};


const photoFromState = (state: Store, peerID: number): number | 'default' => pathOr('default',
  ['photos', 'byId', peerID, 'photo_small'])(state);

const fileStatus = (state: Store, photoId: number ): FileStatus =>
  pathOr('idle', ['files', 'status', photoId])(state);

const getPhotoId = (state: Store, peerID: number) => {
  const id = photoFromState(state, peerID);
  if (id === 'default') return id;
  const status = fileStatus(state, id);
  return status === 'cached'
    ? id
    : 'default';
};

const propsState = (state: Store, { peerID }: OwnProps) => ({
  photoId: getPhotoId(state, peerID),
});

const connected = connect<ConnectedState, {}, OwnProps>(propsState)(PeerPhotoContainer);

export { connected as PeerPhoto };
