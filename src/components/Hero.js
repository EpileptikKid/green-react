import React from 'react'

import logo from '../assets/logo.svg'

const Hero = () => (
  <div className="text-center hero my-5">
    <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
    <h1 className="mb-4">Бета-версія</h1>

    <p className="lead">
      В разі виникнення помилок, звертайте увагу на те в який час та під час
      виконання яких функцій це сталося
    </p>
  </div>
)

export default Hero
