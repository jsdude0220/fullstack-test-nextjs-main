
import { createContext, useContext, Context } from 'react'
import useFirebaseAuth from 'libs/useFirebaseAuth';
import Firebase from 'libs/firebase';

const authUserContext = createContext({
  authUser: null,
  loading: true,
  signInWithEmailAndPassword: undefined,
  createUserWithEmailAndPassword: undefined,
  signOut: undefined,
  token:undefined,
  storeToken: undefined,
  clear: undefined,
  profile: undefined,
  storeProfile: undefined,
  
});

export function AuthUserProvider({ children }) {
  const auth = useFirebaseAuth();
  return <authUserContext.Provider
    value={auth}
  >
    {children}
  </authUserContext.Provider>;
}
// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(authUserContext);