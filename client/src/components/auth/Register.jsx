import { useState } from 'react';
import Typography from '@mui/material/Typography';

export default function Register() {
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

    const handleRegister = async (e) => {
        e.preventDefault();
        const valid = validate();
        if (!valid) return;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        await fetch('http://localhost:3030/users', {
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
            "fullname": `${firstName + " " + lastName}`
          }),
        });
    };

    return (
        <div style={{ width: "400px", marginLeft: "50px", marginTop: "50px" }}>
            {errors.map((error) => renderError(error))}
            <form>
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input type="text" className="form-control" id="firstName"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="lastName"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password"/>
                </div>
                <button className="btn btn-primary" onClick={handleRegister}>Register</button>
            </form>
        </div>
    );
};