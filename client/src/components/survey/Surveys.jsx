import Box from '@mui/material/Box';
import MySurveys from './MySurveys';
import Modal from '@mui/material/Modal';
import { logIn } from '../../redux/auth';
import { useEffect, useState } from "react";
import { setSurveys } from '../../redux/survey';
import Typography from '@mui/material/Typography';
import { json, useNavigate } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function Surveys() {
    const { user, accessToken } = useSelector((state) => state.auth);
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchData = async () => {
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
        };
    };

    const validateSurvey = (content, name) => {
        if (content === "" || name === "") {
            return false;
        }

        const splitted = content.split('\n\n');
        if (splitted.length === 0) return false;
        for (let i = 0; i < splitted.length; i++) {
            const element = splitted[i];
            const pageandqs = element.split('\n');
            if (pageandqs.length < 2 || pageandqs[1].trim() === '') return false;
        }

        return true;
    };

    const resolveData = (surveydata) => {
        const splitted = surveydata.split("\n");
        const name = splitted.shift();
        if (splitted.shift() !== "") {
            return {name: undefined, content: undefined, valid: false};
        }
        const content = splitted.join('\n');
        const valid = validateSurvey(content, name);
        return {name: name, content: content, valid: valid};
    };

    const handleSave = async () => {
        const surveydata = document.getElementById('surveydata').value;
        const {name, content, valid} = resolveData(surveydata);
        setInvalid(!valid);
        if (!valid) return;

        await fetch('http://localhost:3030/surveys', {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify({
            "name": `${name}`,
            "content": `${content}`
          }),
        });
        fetchData();
        handleClose();
    };

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");
        if (!loggedInUser) {
            navigate('/login');
        } else {
            dispatch(logIn({user: JSON.parse(loggedInUser), accessToken: accessToken}));
            fetchData();
        }
    }, []);
    return (
        <>
            {show &&
                <div className="alert alert-success" role="alert" style={{ textAlign: "center", width: "500px", marginLeft: "auto", marginRight: "auto", marginTop: "5px", position: "absolute", left: "0", right: "0" }}>
                    <FontAwesomeIcon icon={faCircleInfo} style={{color: "#5eff89", marginRight: "5px"}} />
                    Link successfully copied to clipboard!
                </div>
            }
            <div style={{ width: "650px", marginLeft: "50px", marginTop: "50px" }}>
                <h1>Surveys</h1>
                <MySurveys resolveData={resolveData} fetchData={fetchData} style={style} setShow={setShow}/>
                <button className="btn btn-primary" onClick={handleOpen}>New survey</button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        New survey
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Here is an example:<br />
                        Survey title
                        <br /><br />
                        Page1<br />
                        Q1<br />
                        Q2
                        <br /><br />
                        Page2<br />
                        Q1<br />
                        Q2
                    </Typography>
                    {invalid && <p style={{ color: "red" }}>The survey is not valid!</p>}
                    <form >
                        <div className="mb-3">
                            <textarea type="text" className="form-control" id="surveydata" rows={20}/>
                        </div>
                    </form>
                    <button className="btn btn-secondary" onClick={handleClose}>Close</button>
                    <button className="btn btn-primary" onClick={handleSave} style={{ marginLeft: "5px" }}>Save</button>
                    </Box>
                </Modal>
            </div>
        </>
    );
};