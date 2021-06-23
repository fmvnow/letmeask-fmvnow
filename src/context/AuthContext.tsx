import { ReactNode, createContext, useEffect, useState} from 'react';
import { auth, firebase } from '../services/firebase';

type AuthContextType = {
  user: User | undefined;
  signinWithGoogle: () => Promise<void>
}

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user) {
        setLoggedUser(user);
      }
    })

    return () => {
      unsubscribe();
    }
  })

  function setLoggedUser(user: firebase.User | null) {
    if(user) {
      const {displayName, photoURL, uid} = user;

      if(!displayName || !photoURL) {
        throw new Error('Missing information from Google Account');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      })
    }
  }
  async function signinWithGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);

    setLoggedUser(result.user);

  }

  return (
    <AuthContext.Provider value={{user, signinWithGoogle}}>
      {props.children}
    </AuthContext.Provider>
  )
}
