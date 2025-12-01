import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { MoviesProvider } from './context/MoviesContext'

createRoot(document.getElementById('root')).render(
  <MoviesProvider><App/></MoviesProvider>
)
