import React from 'react'

function toUnderscores(word) {
  var res = [];
  for (var i=0; i<String(word).length; i++) {
    res.push('_')
  }
  return res.join(' ')
}

function Word(props) {
  return (
    <div onClick={()=>props.clickHandler(props.idx)} style={{cursor:'pointer'}}>
      { props.show ? String(props.word) : toUnderscores(props.word) }
    </div>
  );
}

export default Word;
