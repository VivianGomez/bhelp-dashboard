import * as firebase from 'firebase';
//import firestore from 'firebase/firestore'

//const settings = {timestampsInSnapshots: true};

const config = {
    apiKey: "AIzaSyAs7JwWF9HDdd7bE-3OhemwcM6CCuaSgTg",
    authDomain: "bhelp-48327.firebaseapp.com",
    databaseURL: "https://bhelp-48327.firebaseio.com",
    projectId: "bhelp-48327",
    storageBucket: "bhelp-48327.appspot.com",
    messagingSenderId: "863803425321"
};
firebase.initializeApp(config);

//firebase.firestore().settings(settings);

export default firebase;