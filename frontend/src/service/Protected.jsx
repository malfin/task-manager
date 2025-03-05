import {Navigate, Outlet, useNavigate} from "react-router-dom";

const Protected = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    setTimeout(() => {
        localStorage.removeItem('token');
        navigate('/login/')
    }, 3600000)

    return (
        token ? <Outlet/> : <Navigate to={'/login/'}/>
    );
};
export default Protected;