import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import firebase from './utils/firebase';
import { setUser, unsetUser } from './reducers/authReducer';
import { setContestsAndProblems } from './reducers/problemReducer';
import { setMyNotes, unsetMyNotes } from './reducers/noteReducer';
import NavigationBar from './components/NavigationBar';
import TablePage from './components/Table';
import EditorPage from './components/Editor';
import NotesPage from './components/Notes';
import NotePage from './components/Note';
import SettingsPage from './components/Settings';

type WrapperProps = {
  children: React.ReactElement;
}

const InitWrapper: React.FC<WrapperProps> = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setContestsAndProblems());
  }, [dispatch])

  return props.children;
}

const AuthWrapper: React.FC<WrapperProps> = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(setUser());
        dispatch(setMyNotes());
      } else {
        dispatch(unsetUser());
        dispatch(unsetMyNotes());
      }
    })
  }, [dispatch])

  return props.children
}

const App: React.FC<{}> = () => {
  return (
    <InitWrapper>
      <Router>
        <AuthWrapper>
          <div className="App">
            <NavigationBar />
            <Switch>
              <Route exact path='/'>
                <Redirect to='/table' />
              </Route>
              <Route exact path='/table' component={TablePage} />
              <Route exact path='/notes' render={props => <NotesPage isMyNotes={false} {...props} />}/>
              <Route exact path='/notes/:noteId' component={NotePage} />
              <Route exact path='/my/notes' render={props => <NotesPage isMyNotes={true} {...props} />}/>
              <Route exact path='/my/:problemNo' component={EditorPage} />
              <Route exact path='/settings' component={SettingsPage} />
            </Switch>
          </div>
        </AuthWrapper>
      </Router>
    </InitWrapper>
  );
}

export default App;
