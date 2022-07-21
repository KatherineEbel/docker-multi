import logo from '../logo.svg'
import React from 'react'
import {NavLink, Outlet} from 'react-router-dom'

const Layout = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          React Fibonacci Calculator
        </p>
        <NavLink to='/about'>About</NavLink>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default Layout