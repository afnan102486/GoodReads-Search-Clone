import './App.css'; 
import React from 'react';
import Header from './Components/Header';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './Components/Register';
import Login from './Components/Login';
import SearchBar from './Components/SearchBar';
import BookList from './Components/BookList';
import BookDetails from './Components/BookDetails';
const App = () => {
    return (
            <BrowserRouter>
            <Header />
                <Routes>
                    <Route path="/" element={<Register />} />
                    <Route path="/Register" element={<Register />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/SearchBar" element={<SearchBar />} />
                    <Route path="/BookList" element={<BookList />}></Route>
                    <Route path="/BookDetails/:id" element={<BookDetails />} />
                </Routes>
            </BrowserRouter>
        
    );
};

export default App;