import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { checkAuth } from '../app/api/usersApi';

export default function RequireAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Appel à l'API pour vérifier si l'utilisateur est authentifié
        async function checkUser() {
            const response = await checkAuth()
            if (response === true) {
                setIsAuthenticated(true)
            }
        }
        checkUser()
    }, []);

    // Si l'état d'authentification n'est pas encore déterminé, on peut afficher un loader ou rien
    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    // Si l'utilisateur n'est pas authentifié, on le redirige vers la page de login
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    // Si l'utilisateur est authentifié, on rend le composant Outlet pour afficher la route enfant
    return <Outlet />;
};
