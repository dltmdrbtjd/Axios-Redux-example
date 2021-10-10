## 기타
- fork해가셔도 되고 clone해서 사용하셔도 됩니다 !
- 추가로 궁금하신 부분이 있으시다면 dltmdrbtjd@gmail.com으로 메일주세요 ^^!

## 항해99 3기 분들을 위한 세션 예제 코드
- 목적
  - Axios의 기본적인 사용방법
  - json-server를 활용한 axios연습
  - redux-thunk를 활용한 미들웨어함수로 axios api통신

## 목차
- Axios
- json-server
- Redux-thunk

## 실행하는 방법
```javascript
// 1. 패키지 설치
npm install
```
```javascript
// 2. json-server 실행
npx json-server ./data.json --port 4000
```
```javascript
// 3. 프로젝트 실행
npm run start
```

## Axios
- axios를 사용하여 인스턴스 생성후 모듈화하여 사용해준다.
```javascript
import axios from 'axios';

const instance = axios.create({
  // 기본적으로 우리가 바라볼 서버의 주소
  baseURL: 'http://localhost:4000/',
  // headers에는 나중에 토큰을 넣어도되고 원하는 방식으로 활용해주시면 됩니다.
  headers: {
    'content-type': 'application/json;charset=UTF-8',
    accept: 'application/json',
  },
});

export const apis = {
  // baseURL을 미리 지정해줬기 때문에 함수의 첫 번째 인자에 들어가는 url은
  // http://localhost:4000/ + 내가 작성한 url 즉 예시로
  // getPost함수에서는 instance.get('http://localhost:4000/posts')로 요청을 보내게 됩니다.
  // get과 delete의 경우 두 번째 인자에 데이터를 담아 보낼수 없기 때문에 서버에 데이터를 보낼경우 쿼리를 이용하여 보내주도록 합니다.

  // 게시물 불러오기
  getPost: () => instance.get('/posts'),
  // 게시물 작성하기
  createPost: (contents) => instance.post('/posts', contents),
  // 게시물 수정하기
  editPost: (id, content) => instance.put(`/posts/${id}`, content),
  // 게시물 삭제하기
  delPost: (id) => instance.delete(`/posts/${id}`),
};
```

## Json-server
- Node를 기반으로 구동되는 API-Server로 별도의 서버가 없는 환경에서 프론트엔드 작업을 진행하고자 할 때 유용하게 사용됩니다.
- 테스트 용도 및 연습 용도로 사용하시고 실제 프로젝트에서는 사용하시면 안됩니다 !
- 아래는 json-server로 만든 서버를 이용한 axios예제 입니다.

```javascript
import React, { useEffect, useState } from 'react';
import './App.css';
import { apis } from './axios';
// 위에서 만든 axios를 모듈화한 apis를 불러와줍니다.

function App() {
  const [list, setList] = useState([]);
  
  useEffect(() => {
  // 페이지가 렌더될때 처음에 1번 서버에 요청하여 데이터를 받아옵니다.
  // 저희가 미리 만들어둔 모듈이 있기때문에 apis.getPost()를 실행하면 서버에 요청을 보내게 됩니다.
  // 추가로 then과 catch문을 통해 성공,실패 로직을 구현해주시면 됩니다.
  // 서버에서 받아오는 데이터들이 궁금하다면 response를 console.log 한 번 찍어서 살펴보세요 !
  
    apis
      .getPost()
      .then((res) => {
        const post = res.data;
        setList(...list, post);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  
  return (
    <div className='App'>
      {list &&
        list.map((item) => {
          return (
            <div key={item.id}>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
          );
        })};
    </div>
  )
}

export default App;
```
## Redux-thunk
- redux-actions와 redux-thunk를 활용하여서 개발을 하셨을텐데요. 그래서 두 가지를 사용하여 관련 예제를 준비했습니다.
- 다들 기본적인 사용법과 내용은 숙지하고 계실거라고 생각하고 간단한 예시를 보여드릴게요 !
```javascript
import { createAction, handleActions } from 'redux-actions';
import { produce } from 'immer';
import { apis } from '../lib/axios';

// action 생성
const LOAD_POST = 'LOAD_POST';

// actions creators
const loadPost = createAction(LOAD_POST, (list) => ({list}));

// middleware func
const getPostMiddleware = () => {
   return (dispatch) => {
   
   // redux-thunk를 활용한 middleware 함수 입니다.
   // 우선 앞에서 만든 axios모듈을 통해 getPost()를 실행시켜줍니다.
   // response를 받아온 data를 post_list 상수에 넣어줍니다.
   // 위에 만든 loadPost 액션 함수에 인자로 post_list를 넣어주고 dispatch 시킵니다.
   // 그러면 받아온 데이터를 redux에 담게 되겠죠 ?
   
    apis
      .getPost()
      .then((res) => {
        const post_list = res.data;
        dispatch(loadPost(post_list));
      })
      .catch((err) => {
        console.error(err);
      });
  };
};

// reducer
export default handleActions(
  {
    [LOAD_POST]: (state,action) =>
      produce(state, (draft) => {
        draft.list = action.payload.list;
      }),
  },
  initialState
);

const postCreators = {
  getPostMiddlewrae
};

export { postCreators };
```

### 위에서 만든 middleware 활용하기
```javascript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { postCreators } from './redux/post';

function App() {
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post.list);
  
  // 위에서 만든 middleware함수를 dispatch 시켜줍니다.
  // 그 후에 useSelector로 사용하고자 하는 list를 가져와줍니다.
  
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
              <p>{item.body}<p>
            </div>
          );
        })}
    </div>
  )
}

export default App;
 
```
