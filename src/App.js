import React from 'react'
import './App.css'
import BarChart from './BarChart'
import Heatmap from './Heatmap'
import PercentStackedBarChart from './PercentStackedBarChart'
import StackedBarChart from './StackedBarChart'

function App() {
    return (
        <div className="App">
            <BarChart />
            <StackedBarChart />
            <Heatmap />
            <PercentStackedBarChart />
        </div>
    )
}

export default App
