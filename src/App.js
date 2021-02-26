import React from 'react'
import './App.css'
import BarChart from './BarChart'
import Heatmap from './Heatmap'
import StackedBarChart from './StackedBarChart'

function App() {
    return (
        <div className="App">
            <BarChart />
            <StackedBarChart />
            <Heatmap />
        </div>
    )
}

export default App
