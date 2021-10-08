import { createAction, handleActions } from 'redux-actions';
import { produce } from 'immer';
import { apis } from '../lib/axios';

// action 생성
const LOAD_POST = 'LOAD_POST';
const ADD_POST = 'ADD_POST';

// action creators
const loadPost = createAction(LOAD_POST, (list) => ({ list }));
const AddPost = createAction(ADD_POST, (post) => ({ post }));

// initialState
const initialState = {
  list: [],
};

// middleware
const getPost = () => {
  return (dispatch) => {
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

const addPost = (post) => {
  return (dispatch) => {
    apis
      .createPost(post)
      .then(() => {
        dispatch(AddPost(post));
      })
      .catch((err) => {
        console.error(err);
      });
  };
};

export default handleActions(
  {
    [LOAD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.list;
      }),
    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(action.payload.post);
      }),
  },
  initialState
);

const postCreators = {
  getPost,
  addPost,
};

export { postCreators };
