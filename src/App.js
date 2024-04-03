import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { TopNavBar, SideBar } from './components/Home/HomeComponents/MenuTemplates';
import { DatatableUserQuery } from './components/Datatables/Datatables';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LoginComponent from './components/Login/LoginComponent';
//import SearchPage from './components/SearchPage'; // Importa el componente de búsqueda
import PrivateRoute from './components/PrivateRouteComponent'; // Importa el componente PrivateRoute
import { handleLogin, handleLoggedTime } from './components/Login/handleLogin'; // Importa la función handleLogin
const SearchPage = () => <h1>Search Page</h1>
//var token;

function App() {
  //Variables para manejar el inicio de sesion tokenizado
  //Este consta de dos variables que nos brinda la librería JWTtoken
  //El funcionamiento esta definido para que con el refresh token
  //se genere automaticamente el access token una vez que este caduco
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
  const [redirect, setRedirect] = useState(false); // Estado para la redirección
  const [forceUpdate, setForceUpdate] = useState(false); // Estado para forzar la actualización
  //const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    var storedToken = Cookies.get('accessToken');
    var storedReToken = Cookies.get('refreshToken');




    try {//Revisamos si existe token de ingreso
      const parsedToken = JSON.parse(storedToken);
      const parsedReToken = JSON.parse(storedReToken);
      setAccessToken(parsedToken);
      setRefreshToken(parsedReToken);
      console.log("stored ", parsedToken);
      console.log("stored Refresh ", parsedReToken);
    }
    catch (error) {
      //Da un error de que no se puede parsear sobre undefined pero 
      //en este caso es normal ya que si no existe creamos uno nuevo
      //no hay necesidad de mandar ningun tipo de mensaje 
      //console.log("Error", error);
    }

  }, [forceUpdate]);
  //setForceUpdate(prevState => !prevState);
  const handleLogout = () => {
    // Remover las cookies
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');


    // Actualizar los estados locales
    setAccessToken(null);
    setRefreshToken(null);

    // Forzar una actualización de la interfaz de usuario
    setForceUpdate(prevState => !prevState);
  };

  const handleLoginCallback = async ({ email, password }) => {
    // Si ya hay un token almacenado en la cookie, no es necesario obtener uno nuevo  
    if (accessToken) {
      var response = await handleLoggedTime({ accessToken, refreshToken });


      //si viene time_left, regresamos el tiempo de sobra del token      
      //si viene esta respuesta quiere decir que no se pudo conectar con el refreshToken entonces hay que redirigir a la url de login para
      //renovar tokens
      if (response === 'login_redirect') {
        console.log('navigate');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        // Forzar una actualización de la interfaz de usuario
        setForceUpdate(prevState => !prevState);
        setAccessToken(null);
        setRefreshToken(null);
        setRedirect(true);
        return;

      } else {
        //si viene una de estas dos etiquetas el token access esta funcionando, ya sea porque se actualizo o aun tenia vigencia el actual
        if ('access' in response || 'time_left' in response) {
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
        //  setLoginError(token);
      }
      return token;
    }

  };

  const isLoggedIn = accessToken !== null;
  //console.log('acs', accessToken);
  return (
    <div className='App'>
      <TopNavBar />
      <div className="containers">
        <SideBar />
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<LoginComponent onLogin={handleLoginCallback} setAccessToken={setAccessToken} />} />
            <Route path='/inicio' element={<PrivateRoute element={<DatatableUserQuery accessToken={accessToken} />} authenticated={isLoggedIn} />} />
            <Route path='/search-page' element={<SearchPage />} />
          </Routes>
          {redirect && <Navigate to="/login" replace />}
        </BrowserRouter>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
}

export default App;