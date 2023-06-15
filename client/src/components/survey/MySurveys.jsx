import { useState } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import { setResults } from '../../redux/results';
import Typography from '@mui/material/Typography';
import { setCurrSurvey } from '../../redux/survey';
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faPenToSquare, faTrash, faClipboard } from '@fortawesome/free-solid-svg-icons';

export default function MySurveys({resolveData, fetchData, style, setShow}) {
    const { accessToken } = useSelector((state) => state.auth);
    const { surveys, currSurvey } = useSelector((state) => state.survey);
    const [open, setOpen] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSave = async () => {
        const surveydata = document.getElementById('editsurveydata').value;
        const {name, content, valid} = resolveData(surveydata);
        setInvalid(!valid);
        if (!valid) return;

        await fetch(`http://localhost:3030/surveys/${currSurvey.id}`, {
          method: "PATCH",
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

    const openSurvey = (survey) => {
        localStorage.setItem("hash", survey.hash);
        localStorage.setItem("survey", JSON.stringify(survey));
        window.open(`http://localhost:5173/survey/${survey.hash}`, '_blank');
    };

    const editSurvey = (survey) => {
        dispatch(setCurrSurvey({currSurvey: {id: survey.id, value: survey.name + "\n\n" + survey.content, survey: survey}}));
        handleOpen();
    };

    const deleteSurvey = async (survey) => {
        await fetch(`http://localhost:3030/surveys/${survey.id}`, {
          method: "DELETE",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
        });
        fetchData();
    };

    const copySurveyLink = async (survey) => {
        navigator.clipboard.writeText(`http://localhost:5173/survey/${survey.hash}`);
        localStorage.setItem("hash", survey.hash);
        setShow(true);
        setTimeout(() => {
            setShow(false);
        }, 3000);
    };

    const getAnswers = async (survey) => {
        const response = await fetch(`http://localhost:3030/results?surveyId=${survey.id}`, {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
        });
        const action = await response.json();
        dispatch(setResults({results: action.data, limit: action.limit, skip: action.skip, total: action.total}));
        navigate("/results");
    };

    const renderActions = (survey) => {
        return (
            <div>
                <FontAwesomeIcon icon={faClipboard} style={{color: "#ffffff", width: "20px", height: "20px", verticalAlign: "middle", marginRight: "10px", cursor: "pointer"}} onClick={() => getAnswers(survey)}/>
                <FontAwesomeIcon icon={faCopy} style={{color: "#00b3ff", width: "20px", height: "20px", verticalAlign: "middle", marginRight: "10px", cursor: "pointer"}} onClick={() => copySurveyLink(survey)}/>
                <FontAwesomeIcon icon={faPenToSquare} style={{color: "#fbff00", width: "20px", height: "20px", marginRight: "10px", verticalAlign: "middle", cursor: "pointer"}} onClick={() => editSurvey(survey)}/>
                <FontAwesomeIcon icon={faTrash} style={{color: "#ff0000", width: "20px", height: "20px", verticalAlign: "middle", cursor: "pointer"}} onClick={() => deleteSurvey(survey)}/>
            </div>
        )
    };

    const renderSurvey = (survey) => {
        return (
            <tr key={survey.createdAt}>
                <td><a onClick={() => openSurvey(survey)} style={{ cursor: "pointer" }}>{survey.name}</a></td>
                <td>{new Date(survey.createdAt).toLocaleDateString()}</td>
                <td>{renderActions(survey)}</td>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Edit survey
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
                            <textarea type="text" className="form-control" id="editsurveydata" rows={20} value={currSurvey.value} onChange={(e) => dispatch(setCurrSurvey({currSurvey: {id: currSurvey.id, value: e.target.value}}))}/>
                        </div>
                    </form>
                    <button className="btn btn-secondary" onClick={handleClose}>Close</button>
                    <button className="btn btn-primary" onClick={handleSave} style={{ marginLeft: "5px" }}>Save</button>
                    </Box>
                </Modal>
            </tr>
        );
    };

    return (
        <div>
            <table className="table table-striped table-dark">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Created at</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {surveys.map(e => renderSurvey(e))}
                </tbody>
            </table>
        </div>
    );
}