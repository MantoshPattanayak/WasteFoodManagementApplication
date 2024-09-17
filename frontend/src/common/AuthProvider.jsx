import store from "../store/store";
import tokenService from "../services/token.service";
import { useSelector } from "react-redux"
import { useEffect, useState, createContext, useContext } from "react";
import { refresh } from "../services/axios";
import instance from "../../env";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);
    const rtoken = tokenService.getLocalRefreshToken();
    const [isAuthenticated, setIsAuthenticated] = useState(user ? true : false);
    console.log("user", user);
    useEffect(() => {
        const initializeAuth = async () => {
            if (!user) {
                const newTokenBoolean = await refresh(rtoken);
                console.log("newTokenBoolean", newTokenBoolean);
                setIsAuthenticated(newTokenBoolean);
            }
            else {
                setIsAuthenticated(true);
            }
            setLoading(false);
        }
        console.log("isAuthenticated", isAuthenticated);
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
        console.log("withAuth", isAuthenticated);
        if (!isAuthenticated) {
            // window.location.href = instance().baseName;
            // return null;
        }
        return <Component {...props} />;
    };
}