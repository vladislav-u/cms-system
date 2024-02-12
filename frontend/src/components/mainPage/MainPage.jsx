import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState();
    
    const redirectToRegister = () => {
        navigate('/register');
    }
    const redirectToLogin = () => {
        navigate('/login');
    }

    useEffect(() => {
        const tokenValue = Cookies.get('token');
    
        if (tokenValue) {
            axios.get('http://localhost:8080/api/verify-token')
            .then((response) => {
                if (response.status === 200) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            })
            .catch((error) => {
                setIsLoggedIn(false);
                console.log(error);
            })
        } else {
            setIsLoggedIn(false);
        }

      }, []);

    return (
        <>
        { isLoggedIn ? (
            <div></div>
        )  
        : (
            <div className='main-page-container'>
                <h1>Control Management System</h1>
                <div className="buttons">
                    <button className="rounded-button" onClick={redirectToLogin}>Sign In</button>
                    <button className="rounded-button" onClick={redirectToRegister}>Sign Up</button>
                </div>
            </div>
        )
        }
        </>
    );
};

export default MainPage;