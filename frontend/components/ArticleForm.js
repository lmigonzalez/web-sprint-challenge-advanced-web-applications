import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues)
  // ✨ where are my props? Destructure them here
  const {postArticle, updateArticle, setCurrentArticleId, article} = props
  
  const [istDisabled, setIstDisabled] = useState(true)

  useEffect(() => {
    // ✨ implement
    // Every time the `currentArticle` prop changes, we should check it for truthiness:
    // if it's truthy, we should set its title, text and topic into the corresponding
    // values of the form. If it's not, we should reset the form back to initial values.
    setValues(article || initialFormValues)

    
  }, [article])

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
    isDisabled()
  }
// console.log(values)
  const onSubmit = evt => {
    evt.preventDefault()
    // ✨ implement
    // We must submit a new post or update an existing one,
    // depending on the truthyness of the `currentArticle` prop.
    console.log(values)
    if(values.article_id){
      updateArticle(values)
    }
    else{
      postArticle(values)
    }

    setValues(initialFormValues)

  }

  const isDisabled = () => {
    // ✨ implement
    // Make sure the inputs have some values
    // {title: '', text: '', topic: ''}
    if(values.title.trim().length < 2 && values.text.trim().length < 2 ){
      setIstDisabled(true)
    }
    else{
      setIstDisabled(false)
    }
  }

  // const update = () =>{

  // }

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>Create Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={istDisabled} id="submitArticle" type='submit'>Submit</button>
        <button onClick={isDisabled} style ={{display: 'none'}} >Cancel edit</button>
      </div>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
