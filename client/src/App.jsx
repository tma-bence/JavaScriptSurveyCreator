import Home from "./components/Home";
import rest from '@feathersjs/rest-client'
import { useSelector } from "react-redux";
import Profile from "./components/Profile";
import Login from "./components/auth/Login";
import { feathers } from '@feathersjs/feathers';
import Answer from "./components/answer/Answer";
import Navigation from "./components/Navigation";
import Surveys from "./components/survey/Surveys";
import Results from "./components/result/Results";
import Register from './components/auth/Register';
import React, { useEffect, useState } from "react";
import authentication from '@feathersjs/authentication-client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  const [hash, setHash] = useState(localStorage.getItem("hash") ?? "");
  const app = feathers();
  const restClient = rest('http://localhost:3030');
  app.configure(restClient.fetch(window.fetch.bind(window)));
  app.configure(authentication());

  return (
    <Router>
        <Navigation />
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/mysurveys" element={<Surveys />}/>
          <Route path="/results" element={<Results />}/>
          <Route path={"/survey/" + hash ?? ""} element={<Answer />} />
          <Route path="/profile" element={<Profile />}/>
          <Route path="/" element={<Home />}/>
        </Routes>
    </Router>
  )
}
