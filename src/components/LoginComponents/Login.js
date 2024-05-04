import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
//import { Navigate } from 'react-router-dom';
//onLogin y setAccess ambas son funciones
function Login({ onLogin, setAccessToken, setRedirectHome, setRedirectLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    //const [redirect, setRedirect] = useState(false); // Estado para la redirección
    // const [redirectSigning, setRedirectSigning] = useState(false); // Estado para la redirección al login

    //Esta funcion se ejecuta cada que el campo email cambia (es precionada una tecla sobre el campo)
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    //Esta funcion se ejecuta cada que el campo password cambia (es precionada una tecla sobre el campo)
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    //
    const handleSubmit = async (e) => {
        e.preventDefault();

        var token = await onLogin({ email, password });
        if (token === 'not authenticated') {
            setError('Usuario o contraseña incorrectos');
        } else {
            // Guardar el token en una cookie
            if (token !== undefined) {
                if (token !== 'not network') {
                    if ('refresh' in token) {
                        // console.log('token guardado', token.access);
                        Cookies.set('accessToken', JSON.stringify(token.access));
                        //console.log('para cookie', token.refresh);
                        Cookies.set('refreshToken', JSON.stringify(token.refresh));
                    }
                }
            }
            // Si el token es diferente a 'not authenticated', limpiamos el error
            setError('');

            //console.log('antes de si pasa por set redirectHome');
            //console.log(token);
            if (token !== undefined) {
                if (token !== 'not network') {
                    if ('access' in token) {
                        //respuesta de que se renovo token
                        if (!('refresh' in token)) {
                            // console.log('antes de darle SetAccess', token.access);
                            setAccessToken(token.access);
                            Cookies.set('accessToken', JSON.stringify(token.access));
                            //     console.log('si pasa por set redirectHome');
                            setRedirectHome(true);
                        } else {
                            //      console.log('si pasa por set redirectHome else');
                            setAccessToken(token.access);
                            setRedirectHome(true);
                        }

                    }
                    else if (token === 'not network' || 'time_left' in token) {
                        //respuesta de que aun tiene vigencia el token
                        setRedirectHome(true);

                    } else if (token === 'login_redirect') {
                        setRedirectLogin(true);

                    }


                }


            }

        }



    };

    // Función para activar la redirección
    const redirectToHomePage = () => {
        //  setRedirect(true);
    };

    useEffect(() => {
        const fetchLogin = () => {
            //console.log('useEffect LoginComponent');
            return onLogin({ email: "user", password: "pass" }).catch(error => {
                console.error('Error', error)
                return null; // Si ocurre un error, retornar null para que el flujo continúe
            });
        };

        fetchLogin().then(Token => {
            if (Token !== 'not network') {
                if (Token === 'not authenticated') {
                    //console.log('Token', Token);
                }



                else if (Token && 'time_left' in Token) {
                    //console.log('Token', Token);
                    setRedirectHome(true);
                    setRedirectLogin(false);
                    //console.log('llega time left');

                }//aqui nunca lo dejan llegar porque lo capturan antes pero por si acaso
                else if (Token && 'access' in Token) {
                    setAccessToken(Token.access);
                    setRedirectHome(true);
                    //  console.log('llega access');
                    setRedirectLogin(false);
                }
            } else {
                setMensaje('No hay internet, o el servidor no responde');

            }


        });
    }, [onLogin, setAccessToken, setRedirectHome, setRedirectLogin, email, password]);


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
            <div>{mensaje}</div>
        </div>
    );
}

export default Login;
