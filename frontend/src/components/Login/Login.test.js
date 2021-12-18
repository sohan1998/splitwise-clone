/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import TestRenderer from 'react-test-renderer';
//import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
// import configureStore from 'redux-mock-store';
//import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
//import allReducers from '../../reducers';
import NavbarClass from '../Navbar/Navbar';
import Login from '../Login/Login';

//const store = createStore(allReducers);

const component = TestRenderer.create(
  //<Provider store={store}>
    <MemoryRouter>
      <Login>
     </Login>
    </MemoryRouter>
 // </Provider>
);

// eslint-disable-next-line no-undef
afterEach(cleanup);

it('renders', async () => {
  expect(component.toJSON()).toMatchSnapshot();
});

test('Check for header', async () => {
  const { getByTestId } = render(
  //  <Provider store={store}>
      <MemoryRouter>
        <Login>

        </Login>
      </MemoryRouter>
    //</Provider>
  );
  expect(getByTestId('LoginTest')).toHaveTextContent('WELCOME TO SPLITWISE');
});