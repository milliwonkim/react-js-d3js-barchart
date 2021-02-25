import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './App.css'

function App() {
    const svgRef = useRef()

    let subject = ['korean', 'math', 'english', 'science', 'social']
    let data = [55, 90, 20, 80, 70]
    let data2 = [3, 12, 16, 19, 8]

    useEffect(() => {
        const margin = { top: 20, right: 100, bottom: 20, left: 100 }
        const width = 700
        const height = 700

        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height + 100)
            .attr('position', 'relative')

        const xScale = d3
            .scaleBand()
            .domain(subject)
            .range([0, width - margin.left - margin.right])
            .padding(0.5)

        const yScale = d3
            .scaleLinear()
            .domain([0, 100])
            .range([height, margin.top])

        const y2Scale = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(data2, function (d) {
                    return d
                }) + 1,
            ])
            .range([height, margin.top])

        const line = d3
            .line()
            .x((d) => xScale(subject[data2.indexOf(d)]))
            .y((d) => y2Scale(d))

        svg.attr('viewBox', [0, 0, width, height])

        svg.append('g')
            .attr('class', 'x_bar')
            .attr('transform', 'translate(' + margin.left + ',' + 680 + ')')
            .call(d3.axisBottom(xScale))

        svg.append('g')
            .attr('class', 'y_bar')
            .attr('transform', 'translate(' + 100 + ',' + -margin.bottom + ')')
            .call(d3.axisLeft(yScale))

        let y2Width = 100 + width - margin.left - margin.right

        svg.append('g')
            .attr('class', 'y2_bar')
            .attr('transform', `translate(${y2Width}, ${-margin.bottom})`)
            .call(d3.axisRight(y2Scale))

        // svg.selectAll('dot')
        //     .datum(data2)
        //     .append('circle')
        //     .attr('r', 3.5)
        //     .attr('cx', function (d) {
        //         console.log('cx: ', d)
        //         return xScale(d)
        //     })
        //     .attr('cy', function (d) {
        //         console.log('cy: ', d)
        //         return y2Scale(d)
        //     })

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
            .attr('x', (d) => {
                return xScale(subject[data.indexOf(d)]) + margin.left
            })
            .attr('y', (d) => yScale(d) - margin.bottom)
            .attr('width', (d) => xScale.bandwidth())
            .attr('height', (d) => height - yScale(d))
            .attr('fill', function (d) {
                let data = d / 100
                return d3.interpolateRainbow(data)
            })
            .attr('class', 'bar_chart')
            .on('mouseover', function (event, data) {
                return tooltip.text(data).style('visibility', 'visible')
            })
            .on('mousemove', function (d) {
                return tooltip
                    .style('top', d.pageY - 10 + 'px')
                    .style('left', d.pageX + 10 + 'px')
            })
            .on('mouseout', function () {
                return tooltip.style('visibility', 'hidden')
            })

        svg.append('path')
            .datum(data2)
            .attr('class', 'line_chart')
            .attr('fill', 'none')
            .attr('z-index', 999)
            .attr('stroke', 'red')
            .attr('stroke-width', 5)
            .style('position', 'absolute')
            .style('z-index', 20)
            .attr('transform', 'translate(' + 125 + ',' + -margin.bottom + ')')
            .attr('d', line(data2))
            .attr('class', 'line_chart')

        svg.selectAll('dot')
            .data(data2)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('r', 5)
            .attr('cx', function (d) {
                return xScale(subject[data2.indexOf(d)])
            })
            .attr('cy', function (d) {
                return y2Scale(d)
            })
            .attr('transform', 'translate(' + 125 + ',' + -margin.bottom + ')')
            .on('mouseover', function (event, data) {
                d3.select(this).raise().attr('fill', 'red').attr('r', 10)
                console.log('data: ', data)
                return tooltip.text(data).style('visibility', 'visible')
            })
            .on('mousemove', function (event) {
                return tooltip
                    .style('top', event.pageY - 10 + 'px')
                    .style('left', event.pageX + 10 + 'px')
            })
            .on('mouseout', function () {
                d3.select(this).attr('fill', 'black').attr('r', 5)
                return tooltip.style('visibility', 'hidden')
            })
    }, [])

    return (
        <div className="App">
            <svg ref={svgRef} />
        </div>
    )
}

export default App
