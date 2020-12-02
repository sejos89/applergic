import { BrowserRouter as Router, Switch, Route, useHistory, useLocation } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import { AuthContext } from './shared/context/AuthContext';
import { getUserProfile } from './shared/services/user';

import Loader from 'react-loader-spinner';

import SplashPage from './pages/SplashPage/SplashPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RatingPage from './pages/RatingPage/RatingPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import HomePage from './pages/HomePage/HomePage';
import ScanPage from './pages/ScanPage/ScanPage';
// import SearchPage from './pages/SearchPage/SearchPage';
import DiaryPage from './pages/DiaryPage/DiaryPage';
import EditProfilePage from './pages/EditProfilePage/EditProfilePage';
import SearchPage2 from './pages/SearchPage2/SearchPage2';
import FavoritePage from './pages/FavoritePage/FavoritePage';

const nonAuthenticatedRoutes = ['/', '/login', '/register', '/home', 'diary', 'scan', 'rating'];

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        setUser(data.data);
      })
      .catch((err) => {
        if (!nonAuthenticatedRoutes.includes(location.pathname)) {
          history.push('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <Loader type="Puff" color="#00BFFF" height={100} width={100} timeout={1000} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div className="App">
        <Switch>
          <Route path="/rating">
            <RatingPage />
          </Route>
          <Route path="/favorites">
            <FavoritePage />
          </Route>
          <Route path="/diary">
            <DiaryPage />
          </Route>
          {/* version SearchPage con libreria de Google Maps */}
          {/* <Route path="/search">
            <SearchPage />
          </Route> */}
          <Route path="/search">
            <SearchPage2 />
          </Route>
          <Route path="/scan">
            <ScanPage />
          </Route>
          <Route path="/home">
            <HomePage />
          </Route>
          <Route path="/edit">
            <EditProfilePage />
          </Route>
          <Route path="/register">
            <RegisterPage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/">
            <SplashPage />
          </Route>
        </Switch>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
