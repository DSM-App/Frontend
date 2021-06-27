import React from 'react';
import ReactLoading from 'react-loading';

function Loading() {
  return (
    <div style={{ height: '10px' }}>
      <ReactLoading type={'spinningBubbles'} color={'white'} />
    </div>
  );
}

export default Loading;
