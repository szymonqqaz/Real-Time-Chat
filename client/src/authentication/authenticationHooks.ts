import { useEffect, useState } from 'react';
import firebase from 'firebase';

import useInitialFirebase from 'authentication/initalFirebase';

enum authenicationProgress {
  loading = 'loading',
  confirmed = 'confirmed',
  unconfirmed = 'unconfirmed',
  error = 'error',
}

const useAuthentication = () => {
  useInitialFirebase();

  const provider = new firebase.auth.GoogleAuthProvider();
  const [isUserLogin, setIsUserLogin] = useState('unconfirmed');

  const [userName, setUserName] = useState('');

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((userData: any) => {
      if (userData) {
        setIsUserLogin(authenicationProgress.confirmed);
        setUserName(userData.displayName);
      } else {
        setIsUserLogin(authenicationProgress.error);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then()
      .catch(error => {
        setIsUserLogin(authenicationProgress.error);
        console.error(error);
      });
  };

  const loginWithAnonymuss = () => {
    firebase
      .auth()
      .signInAnonymously()
      .then()
      .catch(error => {
        // setIsUserLogin('unconfirmed');
        console.error(error);
      });
  };

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then()
      .catch(error => {
        console.error(error);
      });
  };

  const userTokenId = (callback: Function) => {
    firebase
      .auth()
      .currentUser?.getIdToken(true)
      .then(idToken => {
        callback(idToken);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getUserName = () => {
    return userName;
  };

  return { loginWithGoogle, isUserLogin, logout, loginWithAnonymuss, userTokenId, getUserName };
};

export default useAuthentication;