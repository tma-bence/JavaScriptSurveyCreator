import { logIn } from "../redux/auth";
import { Tooltip } from 'react-tooltip';
import { useEffect, useState } from "react";
import { setSurveys } from "../redux/survey";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faSquarePollVertical } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
    const { user, accessToken } = useSelector((state) => state.auth);
    const { total } = useSelector((state) => state.survey);
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [numberOfSurveys, setNumberOfSurveys] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getNumberOfSurveys = async () => {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        const jwt = localStorage.getItem("accessToken");
        const response = await fetch(`http://localhost:3030/surveys?userId=${user ? user.id : loggedInUser.id}`, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken ?? jwt}`
            },
            redirect: "follow",
            referrerPolicy: "no-referrer"
        });
        if (response.ok) {
            const action = await response.json();
            dispatch(setSurveys({surveys: action.data, limit: action.limit, total: action.total, skip: action.skip}));
            setNumberOfSurveys(action.total);
        };
    };

    useEffect(() => {
        getNumberOfSurveys();
        const loggedInUser = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");
        setUserName(JSON.parse(loggedInUser).fullname);
        setEmail(JSON.parse(loggedInUser).email);
        if (!loggedInUser) {
            navigate('/login');
        }
        dispatch(logIn({user: JSON.parse(loggedInUser), accessToken: accessToken}));
    }, []);
    return (
        <div style={{ width: "600px", marginLeft: "50px", marginTop: "50px" }}>
            <h1>Profile</h1>
            <ul className="list-group">
                <li className="list-group-item" data-tooltip-id="name" data-tooltip-content="Name">
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: "5px" }}/>
                    {user ? user.fullname : userName}
                </li>
                <Tooltip id="name" />
                <li className="list-group-item" data-tooltip-id="email" data-tooltip-content="Email adress">
                    <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: "5px" }}/>
                    {user ? user.email : email}
                </li>
                <Tooltip id="email" />
                <li className="list-group-item" data-tooltip-id="count" data-tooltip-content="Number of surveys">
                    <FontAwesomeIcon icon={faSquarePollVertical} style={{ marginRight: "5px" }}/>
                    {total ? total : numberOfSurveys}
                </li>
                <Tooltip id="count" />
            </ul>
        </div>
    );
};