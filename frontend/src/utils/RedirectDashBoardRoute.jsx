import { useAuth } from '../contexts/AuthContext.jsx';
const RedirectDashBoardRoute = () => {
    const { isAuthenticated } = useAuth();

}
export default RedirectDashBoardRoute;
