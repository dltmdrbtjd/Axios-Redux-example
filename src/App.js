import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { postCreators } from './redux/post';

function App() {
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post.list);

  const [title, setTitle] = useState('');
  const [subTitle, setSubTtitle] = useState('');

  function TextInput(e, setState) {
    setState(e.target.value);
  }

  function CreatePost() {
    const content = {
      id: post.length + 1,
      title,
      body: subTitle,
    };

    dispatch(postCreators.addPostMiddleware(content));
  }

  useEffect(() => {
    dispatch(postCreators.getPostMiddleware());
  }, []);

  return (
    <div className='App'>
      {post &&
        post.map((item) => {
          return (
            <div key={item.id}>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
          );
        })}
      <div>
        <input type='text' onChange={(e) => TextInput(e, setTitle)} />
        <br />
        <input type='text' onChange={(e) => TextInput(e, setSubTtitle)} />
        <br />
        <button onClick={CreatePost}>작성하기</button>
      </div>
    </div>
  );
}

export default App;
