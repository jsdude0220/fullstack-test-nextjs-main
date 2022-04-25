import { useState, useEffect } from 'react'
import Firebase from 'libs/firebase';

const formatAuthUser = (user) => ({
  uid: user.uid,
  email: user.email
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(undefined)
  
  const clear = () => {
 
    setAuthUser(null);    
    setToken(undefined)
    setProfile(undefined)
    localStorage.removeItem('token')
    localStorage.removeItem('pf')

    setLoading(false);
  };

  const storeToken=(val)=>{
    setToken(val)
    localStorage.setItem('token', val)
    setTimeout(() => {
      setLoading(false)  
    }, 500);
  }

  const storeProfile=(val)=>{

    setProfile(val)
    localStorage.setItem('pf',JSON.stringify(val))
   
  }

  const signInWithEmailAndPassword = (email: string, password: string) =>
    Firebase.auth().signInWithEmailAndPassword(email, password);

  const createUserWithEmailAndPassword  = (email:string, password: string) => {
    return Firebase.auth().createUserWithEmailAndPassword(email, password);
  }
    
    
  const signOut = () =>
      Firebase.auth().signOut().then(clear);
      
  useEffect(() => {
    const unsubscribe = Firebase.auth().onAuthStateChanged(authStateChanged);
    setLoading(true)
    const savedToken = localStorage.getItem('token')
    if(savedToken){
      storeToken(savedToken)
    }
    
   
    const savedProfile = localStorage.getItem('pf')
    if(savedProfile){
      setProfile(JSON.parse(savedProfile))  
    }

    

    return () =>{
      unsubscribe();
      setLoading(true)
    } 
  }, []);
  
  const authStateChanged = async (authState) => {

    if (!authState) {
      setAuthUser(null)
      setLoading(false)
      return;
    }

    setLoading(true)
    var formattedUser = formatAuthUser(authState);
    setAuthUser(formattedUser);
    setLoading(false);

  };



  return {
    authUser,
    loading,
    signInWithEmailAndPassword ,
    createUserWithEmailAndPassword,
    signOut,
    token,
    storeToken,
    clear,
    profile,    
    storeProfile
  };
}