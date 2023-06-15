import { logIn } from '../../redux/auth';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export default function Results() {
    const { results, total } = useSelector((state) => state.results);
    const [result, setResult] = useState([]);
    const [notFilled, setNotFilled] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const renderAnswers = (answers) => {
        return (
            <ul className="list-group">
                {answers.map((answer) => <li className="list-group-item" key={answer}>{answer}</li>)}
            </ul>
        );
    };

    const renderResult = (e) => {
        if (notFilled) return;
        return (
            <li className="list-group-item" key={e[0]}>
                {e[0]}
                {renderAnswers(e[1])}
            </li>
        );
    }

    const calcSurveyResult = () => {
        let answerIndex = 0;
        if (results.length === 0 || !results) {
            setNotFilled(true);
            return;
        }
        const survey = results[0].survey;

        const pagesAndQuestions = survey.content.split('\n\n');

        let questionsArray = [];
        for (let i = 0; i < pagesAndQuestions.length; i++) {
            const element = pagesAndQuestions[i];
            const elementSplitted = element.split('\n');
            const page = elementSplitted.shift();
            questionsArray.push(elementSplitted);
        }
        const questions = questionsArray.flat();
        let allAnswers = [];
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const answers = result.content.split('\n');
            allAnswers.push(answers);
        }
        let surveyResult = {};
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            let ansForQuestion = [];
            for (let j = 0; j < allAnswers.length; j++) {
                const answers = allAnswers[j];
                ansForQuestion.push(answers[answerIndex]);
            }
            surveyResult[question] = ansForQuestion;
            answerIndex++;
        }
        setResult(Object.entries(surveyResult));
    };

    useEffect(() => {
        calcSurveyResult();
    }, [])

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");
        if (!loggedInUser) {
            navigate('/login');
        } else {
            dispatch(logIn({user: JSON.parse(loggedInUser), accessToken: accessToken}));
        }
    }, []);
    return (
        <div style={{ width: "600px", marginLeft: "50px", marginTop: "50px" }}>
            <h1 style={{ textAlign: "center" }}>Answers</h1>
            <h3>{results.length === 0 ? "Survey name" : results[0].survey.name}</h3>
            <p>{notFilled ? "This survey has not yet been filled out." : `This survey was filled out by ${total} people`}</p>
            <ul className="list-group">
                {result.map((e) => renderResult(e))}
            </ul>
        </div>
    );
};