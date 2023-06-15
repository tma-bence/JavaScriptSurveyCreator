import { logOut } from "../../redux/auth";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.clear();
        dispatch(logOut());
        navigate('/');
    };
    return (
        <button className="btn btn-secondary" style={{ position: "absolute", top: "10px", right: "10px" }} onClick={handleLogOut}>Logout</button>
    );
};