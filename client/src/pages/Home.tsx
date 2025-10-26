import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import Swal from 'sweetalert2';
import '../assets/css/Home.css';
import Logo from '../assets/images/Logo.png'; // 👈 your centered image

function Home() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            navigate('/Auth'); // 👈 navigate after animation finishes
        }, 4300); // show loader for 3 sec
        return () => clearTimeout(timer);
    }, [navigate]);

    if (loading) {
        return (
            <div className="loader-container">
                <div className="background-animation"></div>
                <div className="logo-shatter">
                    <div className="piece piece1"></div>
                    <div className="piece piece2"></div>
                    <div className="piece piece3"></div>
                    <div className="piece piece4"></div>
                    <div className="piece piece5"></div>

                    <div className="piece piece6"></div>
                    <div className="piece piece7"></div>
                    <div className="piece piece8"></div>
                    <div className="piece piece9"></div>
                    <div className="piece piece10"></div>

                    <div className="piece piece11"></div>
                    <div className="piece piece12"></div>
                    <div className="piece piece13"></div>
                    <div className="piece piece14"></div>
                    <div className="piece piece15"></div>

                    <div className="piece piece16"></div>
                    <div className="piece piece17"></div>
                    <div className="piece piece18"></div>
                    <div className="piece piece19"></div>
                    <div className="piece piece20"></div>

                    <div className="piece piece21"></div>
                    <div className="piece piece22"></div>
                    <div className="piece piece23"></div>
                    <div className="piece piece24"></div>
                    <div className="piece piece25"></div>
                </div>

            </div>
        );
    }

    return (
        <>
        </>
    );
}

export default Home;