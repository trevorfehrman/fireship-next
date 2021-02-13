import * as React from 'react';

import toast from 'react-hot-toast';
import Img from 'next/image';
import debounce from 'lodash.debounce';
import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { UserContext } from '../lib/context';

const EnterPage: React.FC = () => {
  const { user, username } = React.useContext(UserContext);

  return <main>{user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}</main>;
};

const SignInButton: React.FC = () => {
  async function signInWithGoogle() {
    try {
      await auth.signInWithPopup(googleAuthProvider);
    } catch {
      toast.error('Uh-oh!  Something went wrong :/');
    }
  }

  return (
    <button className='btn-google' onClick={signInWithGoogle}>
      <Img src='/google.png' width='30px' height='30px' /> Sign in with Google
    </button>
  );
};

const SignOutButton: React.FC = () => {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
};

const UsernameForm: React.FC = () => {
  const [formValue, setFormValue] = React.useState<string>();
  const [isValid, setIsValid] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { user, username } = React.useContext(UserContext);

  React.useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const checkUsername = React.useCallback(
    debounce(async (username: string) => {
      if (username?.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log('read babyyy');
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    const batch = firestore.batch();

    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });

    batch.set(usernameDoc, { uid: user.uid });

    try {
      await batch.commit();
    } catch (err) {
      toast.error(err);
    }
  }

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            type='search'
            autoComplete='off'
            name='username'
            placeholder='Enter your username...'
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage username={username} isValid={isValid} loading={loading} />
          <button type='submit' disabled={!isValid}>
            Submit
          </button>
          <h3>Debug state</h3>
          <div>Username: {formValue}</div>
          <br />
          Loading {loading.toString()}
          <br />
          Username Valid: {isValid.toString()}
        </form>
      </section>
    )
  );
};

const UsernameMessage: React.FC<{ username: string; isValid: boolean; loading: boolean }> = ({
  username,
  isValid,
  loading,
}) => {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className='text-success'>{username} is availible!</p>;
  } else if (username && !isValid) {
    return <p className='text-danger'>That username is already taken</p>;
  } else {
    return <p></p>;
  }
};

export default EnterPage;
