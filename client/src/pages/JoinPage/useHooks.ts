import { useState } from 'react';

import authenticationHooks from 'authentication/useAuthenticationHooks';
import getUrl from 'helpers/getUrl';

enum JoinStatus {
  wait,
  success,
  error,
}

const URL = getUrl();

const useHooks = (key: string) => {

  const { userTokenId } = authenticationHooks();

  const [status, setStatus] = useState(JoinStatus.wait);

  const join = () => {
    userTokenId((token: string) => {
      fetch(`${URL}join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, key }),
      })
        .then(data => data.json())
        .then(response => {
          if (response.status === 'OK') {
            setStatus(JoinStatus.success);
          } else {
            setStatus(JoinStatus.error);
          }
        })
        .catch((err) => {
          setStatus(JoinStatus.error);
        });
    });
  }

  return {
    join,
    status,
  }
};

export default useHooks;