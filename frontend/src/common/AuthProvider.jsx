import store from "../store/store";
import tokenService from "../services/token.service";
import { useSelector } from "react-redux"
import { useEffect, useState, createContext, useContext } from "react";
import { refresh } from "../services/axios";
import instance from "../../env";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.user) || tokenService.getUser();
    const rtoken = tokenService.getLocalRefreshToken();
    const [isAuthenticated, setIsAuthenticated] = useState(user ? true : false);

    useEffect(() => {
        const initializeAuth = async () => {
            if (!user) {
                const newTokenBoolean = await refresh(rtoken);
                setIsAuthenticated(newTokenBoolean);
            }
            else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        }
        initializeAuth();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            { children }
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export function withAuth(Component) {
    return function AuthComponent(props) {
        const { isAuthenticated } = useAuth();
        // console.log("withAuth", isAuthenticated);
        if (!isAuthenticated) {
            window.location.href = instance().baseName ? instance().baseName + '/login' : '/login';
            return null;
        }
        return <Component {...props} />;
    };
}