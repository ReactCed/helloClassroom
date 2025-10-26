import { useEffect } from 'react';
import '../assets/css/Loader.css';
import Load2 from '../assets/images/load2.gif';

function Loader() {
    useEffect(() => {
        const handleLoad = () => {
            const loader = document.getElementById('loader');

            if (loader) {
                loader.style.opacity = '0';
                loader.style.transition = 'opacity 0.5s ease';

                setTimeout(() => {
                    loader.style.display = 'none';
                }, 1000);
            }
        };

        window.addEventListener('load', handleLoad);

        // Fix: Check if document is already loaded
        if (document.readyState === 'complete') {
            handleLoad();
        }

        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, []);

    return (
        <div id="loader">
            <img src={Load2} className="spinner" alt="Loading..." />
        </div>
    );
}

export default Loader;
