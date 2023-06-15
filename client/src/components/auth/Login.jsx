import { useState } from "react";
import { logIn } from "../../redux/auth";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);

    const validate = () => {
        let newErrors = [];
        const fields = document.querySelectorAll("input");
        for (let i = 0; i < fields.length; i++) {
            if (fields[i].value === '') {
                let error = {message: `${fields[i].previousElementSibling.innerHTML} is required!`, id: fields[i].getAttribute('id')};
                newErrors.push(error);
            }
        }
        setErrors(newErrors);
        if (newErrors.length > 0) return false;
        return true;
    };

    const renderError = (err) => {
        return <Typography onClick={() => document.getElementById(err.id).focus()} style={{ cursor: "pointer", color: "red" }} key={err.id}>{err.message}</Typography>
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const valid = validate();
        if (!valid) return;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (errors.length) return;
        const response = await fetch('http://localhost:3030/authentication', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
              "email": `${email}`,
              "password": `${password}`,
              "strategy": 'local'
            }),
        });
        if (response.ok) {
            const action = await response.json();
            dispatch(logIn({user: action.user, accessToken: action.accessToken}));
            localStorage.setItem('user', JSON.stringify(action.user));
            localStorage.setItem('accessToken', action.accessToken);
            navigate('/profile');
        }
    };

    return (
        <div style={{ width: "400px", marginLeft: "50px", marginTop: "50px" }}>
            {errors.map((error) => renderError(error))}
            <form>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" />
                </div>
                <button className="btn btn-primary" onClick={handleLogin}>Login</button>
            </form>
        </div>
    );
};