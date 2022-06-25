import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import Word from './Word.js'

// Run with: REACT_APP_LOCAL=true npm start
const baseURL = process.env.REACT_APP_LOCAL === "true" ? 'http://localhost:8000' : 'https://amandagrams-tgoh98.koyeb.app'

function App() {
  const [baseWord, setBaseWord] = useState("DOG")
  const [randLen, setRandLen] = useState(3)
  const [n, setN] = useState(2)
  const [guess, setGuess] = useState("")
  const [words, setWords] = useState([])
  const [col1, setCol1] = useState([])
  const [col2, setCol2] = useState([])
  const [col3, setCol3] = useState([])
  const [col4, setCol4] = useState([])
  const [showWord, setShowWord] = useState([])

  const genRandWord = (e) => {
    e.preventDefault()

    if (isNaN(parseInt(randLen))) {
      alert("Invalid random length")
      return
    } else if (parseInt(randLen) <= 2) {
      alert("Please enter a length greater than or equal to 3")
      return
    }

    axios.get(`${baseURL}/randWord?randLen=${randLen}`).then((response) => {
      // console.log(response.data);
      setBaseWord(response.data)
    }).catch(error => {
      console.log(error);
    })
  }

  const findWords = (e) => {
    e.preventDefault()

    if (isNaN(parseInt(n)) || baseWord === "") {
      alert("Invalid value for base word or n")
      return
    }

    axios.get(`${baseURL}/words?base=${baseWord}&n=${n}`).then((response) => {
      // console.log(response.data);
      setWords(response.data)
      var temp = []
      var tempCol1 = []
      var tempCol2 = []
      var tempCol3 = []
      var tempCol4 = []
      for (var i=0; i<response.data.length; i++) {
        temp[i] = false
        switch(i%4) {
          case 0:
            tempCol1.push(response.data[i])
            break
          case 1:
            tempCol2.push(response.data[i])
            break
          case 2:
            tempCol3.push(response.data[i])
            break
          case 3:
            tempCol4.push(response.data[i])
            break
          default:
            break
        }
      }
      setShowWord(temp)
      setCol1(tempCol1)
      setCol2(tempCol2)
      setCol3(tempCol3)
      setCol4(tempCol4)
    }).catch(error => {
      console.log(error);
    })
  }

  const handleGuess = (e) => {
    e.preventDefault()
    
    let curGuess = e.target.value
    setGuess(curGuess)
    
    var col = 1
    var idx = col1.indexOf(curGuess.toUpperCase())
    if (idx === -1) {
      idx = col2.indexOf(curGuess.toUpperCase())
      col = 2
    }
    if (idx === -1) {
      idx = col3.indexOf(curGuess.toUpperCase())
      col = 3
    }
    if (idx === -1) {
      idx = col4.indexOf(curGuess.toUpperCase())
      col = 4
    }

    if (idx !== -1 && showWord[xformIdx(idx, col)] === false) {
      let newState = [...showWord]
      newState[xformIdx(idx, col)] = true
      setShowWord(newState)
      
      setGuess("")
    }
  }

  function xformIdx(i, col) {
    return 4 * i + col - 1
  }

  const handleWordClick = (i) => {
    if (!showWord[i]) {
      let newState = [...showWord]
      newState[i] = true
      setShowWord(newState)
    } else {
      setBaseWord(words[i])
    }
  }

  return (
    <div>
      <header>
        <h1>
          Amandagrams: a Banagrams Trainer
        </h1>
        <p>
          Amandagrams is an online trainer designed to help you improve at the 
          Rice version of Banagrams. Given a starting word, Amandagrams will generate 
          all possible words that can be created by adding <i>n</i> letters to the 
          base word. <br />
        </p>
        <p>
          For example, if your word is "dog" and <i>n</i> is set to 2, Amandagrams 
          will find all the 4 and 5 letter words that are built off of "dog," such as 
          "goad" and "goods." <br />
        </p>
        <p>
          If you give up, click a word to reveal it. Click any revealed word to use it as the new base word.
        </p>
      </header>
      <p>Base word: <input type="text" name="baseWord" value={baseWord} onChange={e=>setBaseWord(e.target.value)} />
      </p>
      <p>
        Or, generate a random word of length: <input type="text" name="randLen" style={{width: 20}} value={randLen} onChange={e=>setRandLen(e.target.value)} /> 
        <button style={{margin: 7}} onClick={genRandWord}>Generate</button>
      </p>
      <p>Next, set <i>n</i>: <input type="text" name="n" style={{width: 20}} value={n} onChange={e=>setN(e.target.value)}  /></p>
      <p><button onClick={findWords}>Find words!</button></p>
      <p>Guess: <input type="text" name="guess" value={guess} onChange={handleGuess} /></p>
      
      <div style={{display:'flex'}}>
        <div style={{display:'25%', margin:10}}>
          {
            col1.map((word, idx) => 
              <Word word={word} key={word} show={showWord[xformIdx(idx, 1)]} idx={xformIdx(idx, 1)} clickHandler={handleWordClick} />
            )
          } 
        </div>
        <div style={{display:'25%', margin:10}}>
          {
            col2.map((word, idx) => 
              <Word word={word} key={word} show={showWord[xformIdx(idx, 2)]} idx={xformIdx(idx, 2)} clickHandler={handleWordClick} />
            )
          } 
        </div>
        <div style={{display:'25%', margin:10}}>
          {
            col3.map((word, idx) => 
              <Word word={word} key={word} show={showWord[xformIdx(idx, 3)]} idx={xformIdx(idx, 3)} clickHandler={handleWordClick} />
            )
          } 
        </div>
        <div style={{display:'25%', margin:10}}>
          {
            col4.map((word, idx) => 
              <Word word={word} key={word} show={showWord[xformIdx(idx, 4)]} idx={xformIdx(idx, 4)} clickHandler={handleWordClick} />
            )
          } 
        </div>
        
      </div>
    </div>
  );
}

export default App;
