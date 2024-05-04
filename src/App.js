import Cookies from 'js-cookie';//Librería para el manejo de cookies 
import React, { useState, useEffect } from 'react';//react, y sus componentes
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';//Componentes de rutas de react de single page
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";


import './App.css';//
import { TopNavBar, SideBar } from './components/Home/HomeComponents/MenuTemplates';//Plantilla principal de la pagina

import Login from './components/LoginComponents/Login';//Componente del Login
import PrivateRoute from './components/PrivateRouteComponent'; // Importa el componente PrivateRoute para el acceso con contraseña
import { handleLogin, handleLoggedTime } from './components/LoginComponents/handleLogin'; // Importa la función handleLogin, todo lo referente al tokenizado

import '@fortawesome/fontawesome-free/css/all.min.css';//FontAwesome!!

//Componente de consultas
import { PiecesQueries } from './components/PiecesQueriesComponents/PiecesQueries';


//import "bootstrap/dist/css/bootstrap.css";
//import "bootstrap/dist/js/bootstrap.bundle.js";



const SearchPage = () => <h1>Search Page</h1>
//var token;

function App() {
  //Variables para manejar el inicio de sesion tokenizado
  //Este consta de dos variables que nos brinda la librería JWTtoken
  //El funcionamiento esta definido para que con el refresh token
  //se genere automaticamente el access token una vez que esté caduco
  //hasta el vencimiento de refreshToken.
  //Esto nos brinda una fuerte seguridad de tokenizado que se esta renovando.
  //La recomendacion de configuración es:
  //"Solo son recomendaciones se puede ajustar de acuerdo a tus conveniencias"
  //Tiempo caducidad accessToken = entre 1 y 8 horas
  //Tiempo de caducidad de refreshToken = entre 1 y 30 días
  //
  //Nota: la caducidad del access token se ajusta en el archivo settings.py de la app principal del lado server
  //
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [redirectLogin, setRedirectLogin] = useState(false); // Estado para la redireccióna login
  const [redirectHome, setRedirectHome] = useState(false); //Estado para redirigir al Home


  // const [forceUpdate, setForceUpdate] = useState(false); // Estado para forzar la actualización
  //const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    //Intentamos tomar a las cookies de acceso pero no sabemos si existen
    var storedToken = Cookies.get('accessToken');
    var storedReToken = Cookies.get('refreshToken');
    try {//Revisamos si existe token de ingreso
      //Al intentar parsear a json es cuando ocurre el error ya que no se puede hacer parse sobre undefined
      const parsedToken = JSON.parse(storedToken);
      const parsedReToken = JSON.parse(storedReToken);
      //Se almacenan en el estado de react los tokens para procesarlos en las API's de acceso
      setAccessToken(parsedToken);
      setRefreshToken(parsedReToken);

      //console.log("stored ", parsedToken);
      //console.log("stored Refresh ", parsedReToken);
    }
    catch (error) {
      //Da un error de que no se puede parsear sobre undefined pero 
      //en este caso es normal ya que si no existe creamos uno nuevo
      //no hay necesidad de mandar ningun tipo de mensaje 
      //console.log("Error", error);
    }

  }, []);
  //setForceUpdate(prevState => !prevState);
  var check;
  const handleLogout = () => {
    // Remover las cookies
    check = true;

    // console.log(check);
    try {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      setAccessToken(null);
      setRefreshToken(null);
      //setForceUpdate(prevState => !prevState);
    } catch (e) {
      console.log('error', e);
    }
    setRedirectLogin(true);
    setRedirectHome(false);
  };

  //Esta funcion se ejecuta al precionar el boton para ingresar al sistema
  //esta intenta comunicarse con el servidor para obtener los tokens de login
  //
  const handleLoginCallback = async ({ email, password }) => {
    // Si ya hay un token almacenado en la cookie, no es necesario obtener uno nuevo  

    if (accessToken) {
      //console.log('if access token');

      var response = await handleLoggedTime({ accessToken, refreshToken });
      //console.log('response', response);
      //si viene time_left, regresamos el tiempo de sobra del token      
      //si viene esta respuesta quiere decir que no se pudo conectar con el refreshToken entonces hay que redirigir a la url de login para
      //renovar tokens
      if (response === 'login_redirect' || response === 'error') {
        //console.log('navigate');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        // Forzar una actualización de la interfaz de usuario
        //setForceUpdate(prevState => !prevState);
        setAccessToken(null);
        setRefreshToken(null);
        setRedirectLogin(true);
        return;

      } else {
        //si viene una de estas dos etiquetas el token access esta funcionando, ya sea porque se actualizo o aun tenia vigencia el actual
        if ('access' in response || 'time_left' in response) {
          setRedirectLogin(false);
          return response;
        }

      }

    }

    else {

      // Si no hay un token almacenado, obtener uno nuevo      
      const token = await handleLogin({ email, password });
      if (token !== 'not authenticated' && token !== 'not network') {
        setAccessToken(token.access);
        setRefreshToken(token.refresh);

      } else {
        if (token === 'not network') {
          console.error('No hay internet, o el servidor no responde');
        }

      }
      return token;
    }

  };

  const isLoggedIn = accessToken !== null;
  //console.log('acs', accessToken);
  // console.log('dsd', check);
  if (check === true) {
    console.log('set redirect');
    setRedirectLogin(true);
  }


  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/login' />} />
          <Route path='/login' element={<Login onLogin={handleLoginCallback} setAccessToken={setAccessToken} setRedirectHome={setRedirectHome} setRedirectLogin={setRedirectLogin} />} />

          <Route path='/piece_queries//*' element={<PrivateRoute element={
            <>
              <TopNavBar />
              <div className="containers">
                <SideBar />
                <div className="MainContent">
                  <PiecesQueries accessToken={accessToken} />
                </div>

              </div>
            </>
          } authenticated={isLoggedIn} />} />
          <Route path='/test/' element={SearchPage()} />
        </Routes>

        {redirectHome && <Navigate to="/piece_queries" />}
        {redirectLogin && <Navigate to="/login" />}
      </BrowserRouter>
    </div>
  );
}

export default App;

