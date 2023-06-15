import { useState, useEffect } from "react";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Answer() {
    const [show, setShow] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5);
    const [started, setStarted] = useState(false);

    const validateAnswers = (data) => {
        let valid = true;
        let answers = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].value === "") {
                valid = false;
            } else {
                answers.push(data[i].value);
            }
        }

        return {valid, answers};
    };

    const submitSurvey = async (survey) => {
        const inputs = document.querySelectorAll("input");
        const {valid, answers} = validateAnswers(inputs);
        
        if(!valid) return;

        await fetch("http://localhost:3030/results", {
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
            "surveyId": survey.id,
            "content": `${answers.join('\n')}`
          }),
        });
        setShow(true);
        setStarted(true);
        setTimeout(() => {
            setShow(false);
            setStarted(false);
            close();
        }, 5000);
    };

    const renderQuestion = (question) => {
        return (
            <>
                <label htmlFor={question} className="form-label">{question}</label>
                <input type="text" className="form-control" id={question}/>
            </>
        );
    };

    const renderPage = (page) => {
        const questions = page.split('\n');
        const pagename = questions.shift();
        return (
            <div className="mb-3" key={pagename}>
                <h4>{pagename}</h4>
                {questions.map((question) => renderQuestion(question))}
            </div>
        );

    };

    const renderSurvey = () => {
        const survey = JSON.parse(localStorage.getItem("survey"));
        const pages = survey.content.split('\n\n');

        return (
            <>
                <h1>{survey.name}</h1>
                <form id="surveyForm">
                    {pages.map((page) => renderPage(page))}
                </form>
                <button className="btn btn-primary" onClick={() => submitSurvey(survey)}>Submit</button>
            </>
        );
    };

    useEffect(() => {
        if (started) {
            if(timeLeft===0){
                setTimeLeft(null)    
            }
            if (!timeLeft) return;
         
            const intervalId = setInterval(() => {
              setTimeLeft(timeLeft - 1);
            }, 1000);
         
            return () => clearInterval(intervalId);
        }
    }, [timeLeft, started]);

    return (
        <>
            <div style={{ width: "600px", marginLeft: "50px", marginTop: "50px"}}>
                { !show && renderSurvey()}
            </div>
            { show && 
                <>
                    <div className="alert alert-info" role="alert" style={{ textAlign: "center", margin: "auto", width: "500px" }}>
                        <FontAwesomeIcon icon={faCircleInfo} style={{color: "#1ac6ff", marginRight: "5px"}} />
                        This window will automatically close in {timeLeft} seconds.
                    </div>
                </>
            }
            {show && <h1 style={{ margin: "auto", width: "50%", textAlign: "center", marginTop: "15%" }}>Thank you for filling out this survey!</h1>}
        </>
    );
};