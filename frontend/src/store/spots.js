import { csrfFetch } from './csrf';

// Action Types
const GET_SPOT_DETAIL = 'spots/getSpotDetail';
const ALL_SPOTS = 'spots/allSpots';
const MY_SPOTS = 'spots/mySpots';

// Action Creators
const spotDetail = (spot) => ({
  type: GET_SPOT_DETAIL,
  spot,
});

const allSpots = (spots) => ({
  type: ALL_SPOTS,
  spots,
});

const mySpots = (spots) => ({
  type: MY_SPOTS,
  spots,
});

// Thunks
export const getSpotDetail = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'GET',
  });
  const data = await res.json();
  dispatch(spotDetail(data));
  return res;
};

export const fetchSpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots', {
    method: 'GET',
  });
  const data = await res.json();
  dispatch(allSpots(data.Spots));
  return res;
};

export const fetchMySpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/users/spots', {
    method: 'GET',
  });
  const data = await res.json();
  dispatch(mySpots(data.Spots));
  return res;
};

export const createSpot = (spotData) => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/spots', {
      method: 'POST',
      body: JSON.stringify(spotData),
    });
    if (!response.ok) {
      throw new Error('Spot creation failed');
    }
    const spot = await response.json();
    return spot;
  } catch (error) {
    throw error;
  }
};

//Spots Reducer
const spotsReducer = (state = {}, action) => {
  const newState = { ...state };
  switch (action.type) {
    case GET_SPOT_DETAIL:
      newState[action.spot.id] = action.spot;
      return newState;

    case ALL_SPOTS:
      action.spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;

    case MY_SPOTS:
      newState.mySpots = {};
      action.spots.forEach((spot) => {
        newState.mySpots[spot.id] = spot;
      });
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
