import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
//onLogin y setAccess ambas son funciones
function LoginComponent({ onLogin, setAccessToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [redirect, setRedirect] = useState(false); // Estado para la redirección
    const [redirectSigning, setRedirectSigning] = useState(false); // Estado para la redirección al login

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        var token = await onLogin({ email, password });
        if (token === 'not authenticated') {
            setError('Usuario o contraseña incorrectos');
        } else {
            // Guardar el token en una cookie
            if (token !== undefined) {
                if ('refresh' in token) {
                    // console.log('token guardado', token.access);
                    Cookies.set('accessToken', JSON.stringify(token.access));
                    //console.log('para cookie', token.refresh);
                    Cookies.set('refreshToken', JSON.stringify(token.refresh));
                }

            }
            // Si el token es diferente a 'not authenticated', limpiamos el error
            setError('');


            if (token !== undefined) {
                if ('access' in token) {
                    //respuesta de que se renovo token
                    if (!('refresh' in token)) {
                        console.log('antes de darle SetAccess', token.access);
                        setAccessToken(token.access);
                        Cookies.set('accessToken', JSON.stringify(token.access));
                        // redirectToHomePage();
                    }

                }
                else if ('time_left' in token) {
                    //respuesta de que aun tiene vigencia el token
                    // redirectToHomePage();

                } else if (token === 'login_redirect') {
                    setRedirectSigning(true);

                }
            }

        }



    };

    // Función para activar la redirección
    const redirectToHomePage = () => {
        setRedirect(true);
    };

    // Redirigir a la ruta '/search_page' si redirect es true
    if (redirect) {
        return <Navigate to="/inicio" replace />;
    }

    if (redirectSigning) {
        //   return <Navigate to="/" replace />;
    }

    return (
        <div>
            <h2>Ingreso</h2>
            {/* Mostrar el mensaje de error si existe */}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="text" value={email} onChange={handleEmailChange} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={handlePasswordChange} />
                </div>
                <button type="submit">Login</button>
            </form>
            {/* Botón para redirigir a la ruta '/search_page' */}
            <button onClick={redirectToHomePage}>Redirigir a la página de búsqueda</button>
        </div>
    );
}

export default LoginComponent;
