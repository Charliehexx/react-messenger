import React, { useRef, useState } from 'react';
import './App.css';

//import firebase from 'firebase/app'; //older version
import firebase from 'firebase/compat/app'; //v9

//to use auth
//import 'firebase/auth'; //older version
import 'firebase/compat/auth'; //v9

//to use firestore
//import 'firebase/firestore'; //Older Version
import 'firebase/compat/firestore'; //v9
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth'; 
import { useCollectionData } from 'react-firebase-hooks/firestore';
import adi from './images/adi.png'
firebase.initializeApp({
  // your config
   apiKey: "AIzaSyDM_NxB2r_WP0pRqb35NPvnUNEShfBldTc",
  authDomain: "chat-app-a68bc.firebaseapp.com",
  projectId: "chat-app-a68bc",
  databaseURL:"https:/chat-app-a68bc.firebaseio.com",
  storageBucket: "chat-app-a68bc.appspot.com",
  messagingSenderId: "444231082917",
  appId: "1:444231082917:web:779886db480c07cf4e7e4c",
  measurementId: "G-CSWPDL9Q3B"
})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p style={{color:'red',marginLeft:'60px',textAlign:'center',}}>💖Hop into the group chat app messenger created by Aditya Patel!!{<img src={adi} style={{height:'200px',width:'200px',marginLeft:'70px'}}/>}</p>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}


function ChatMessage(props){
 
    const {text,uid,photoURL} = props.message;
 
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
 
    return (
 
      <>  
        <div className = {`message ${messageClass}`}>
        <img src = {photoURL || 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'} />
        </div>
        <p>{text}</p>
      </>
 
    )
 
}


export default App;