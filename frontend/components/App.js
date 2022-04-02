import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axiosWithAuth from './../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState(null)
  const [spinnerOn, setSpinnerOn] = useState(false)
  

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ }
  const redirectToArticles = () => { /* ✨ implement */ }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    if(localStorage.getItem('token')){
        localStorage.removeItem('token')
        setMessage("Goodbye!")
      }
      
      navigate('/')
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    // setSpinnerOn(!spinnerOn)
    
    axios.post('http://localhost:9000/api/login', { "username": username, "password": password })
    .then(res=>{
      // console.log(res)
      setMessage(res.data.message)
      localStorage.setItem('token', res.data.token )
      navigate('/articles')
      setSpinnerOn(!spinnerOn)

    })
    .catch(err=>{
      console.log({err})
    })

    

  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    axiosWithAuth()
    .get('/articles')
    .then(res=>{
      
      setMessage(res.data.message)
     
      setArticles(res.data.articles)
    })
    .catch(err=>{
      navigate('/')
    })
    // setSpinnerOn(!spinnerOn)
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    // getArticles()
  
    axiosWithAuth()
    .post('/articles', article)
    .then(res=>{
      
      setMessage(res.data.message)
      setArticles([...articles, article])
      
    })
    .catch(err=>{
      console.log('this is:' + err)
    })

  
  }



  // const onSubmit = (article) =>{
  //   if(currentArticleId){
  //     putArticle(article)
  //   }
  //   else{
  //     postArticle(article)
  //   }
  // }

  const updateArticle = (article) => {
    // ✨ implement
    // You got this!
    // setCurrentArticleId(article.article_id)
    const updatedArticle = {
      title: article.title,
      text: article.text,
      topic: article.topic
    }
   

    axiosWithAuth()
    .put(`/articles/${article.article_id}`, updatedArticle)
    .then(res=>{
      setCurrentArticleId(null)
      
      setArticles(articles.map(art=>{
        return art.article_id === article.article_id? res.data.article: art
      }))
      setMessage(res.data.message)
    })
    .catch(err=>{
      console.log('from' + err)
    })

    
  }

  
  const deleteArticle = article_id => {
    // ✨ implement
    axiosWithAuth()
    .delete(`/articles/${article_id}`)
    .then(res=>{
      console.log(res)
      setMessage(res.data.message)
      setArticles(articles.filter(art =>{
        return art.article_id !== article_id 
      }))
      console.log(res)
    })
    .catch(err=>{
      console.log(err)
    })

  }

  

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner on = {spinnerOn}/>
      <Message  message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle} updateArticle={updateArticle} setCurrentArticleId={setCurrentArticleId} article = {articles.find(art => art.article_id === currentArticleId)}/>
              <Articles articles={articles} getArticles={getArticles} deleteArticle={deleteArticle} setCurrentArticleId = {setCurrentArticleId} SpinnerOn ={spinnerOn}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  )
}
