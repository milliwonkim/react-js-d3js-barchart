import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './App.css'

function App() {
    const svgRef = useRef()

    let data = [55, 90, 20, 80, 70, 11]

    useEffect(() => {
        const margin = { top: 20, right: 100, bottom: 20, left: 100 }
        const width = 700
        const height = 700

        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height + 100)

        const xScale = d3
            .scaleBand()
            .domain(data)
            .range([0, width - margin.left - margin.right])
            .padding(0.5)

        const yScale = d3
            .scaleLinear()
            .domain([0, 100])
            .range([height, margin.top])

        svg.append('g')
            .attr('class', 'x_bar')
            .attr('transform', 'translate(' + margin.left + ',' + 680 + ')')
            .call(d3.axisBottom(xScale))

        svg.append('g')
            .attr('class', 'y_bar')
            .attr('transform', 'translate(' + 100 + ',' + -margin.bottom + ')')
            .call(d3.axisLeft(yScale))

        let tooltip = d3
            .select('body')
            .append('div')
            .style('position', 'absolute')
            .style('z-index', 10)
            .style('visibility', 'hidden')
            .style('background', 'transparent')

        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d) => xScale(d) + margin.left)
            .attr('y', (d) => yScale(d) - margin.bottom)
            .attr('width', (d) => xScale.bandwidth())
            .attr('height', (d) => height - yScale(d))
            .attr('fill', function (d) {
                let data = d / 100
                return d3.interpolateRainbow(data)
            })
            .on('mouseover', function (d, i) {
                tooltip.text(i)
                return tooltip.style('visibility', 'visible')
            })
            .on('mousemove', function (d) {
                return tooltip
                    .style('top', d.pageY - 10 + 'px')
                    .style('left', d.pageX + 10 + 'px')
            })
            .on('mouseout', function () {
                return tooltip.style('visibility', 'hidden')
            })

        svg.attr('viewBox', [0, 0, width, height])
    }, [])

    return (
        <div className="App">
            <svg ref={svgRef} />
        </div>
    )
}

export default App
