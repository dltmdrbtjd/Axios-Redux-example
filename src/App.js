import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { postCreators } from './redux/post';

function App() {
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post.list);

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
    </div>
  );
}

export default App;
