import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './App.css'

function Heatmap() {
    const svgRef = useRef()

    useEffect(() => {
        let margin = { top: 30, right: 100, bottom: 30, left: 100 }
        let width = 600
        let height = 600

        const svg = d3
            .select(svgRef.current)
            .attr('viewBox', [0, 0, width, height + 100])
            .attr('position', 'relative')

        d3.csv(
            'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv'
        ).then((data) => {
            var myGroups = d3.map(data, (d) => {
                return d.group
            })
            var myVars = d3.map(data, (d) => {
                return d.variable
            })

            const xScale = d3
                .scaleBand()
                .range([0, width - 70])
                .domain(myGroups)
                .padding(0.02)

            const yScale = d3
                .scaleBand()
                .range([height - 30, 0])
                .domain(myVars)
                .padding(0.02)

            const xHeight = height + 10

            svg.append('g')
                .style('font-size', 15)
                .attr('transform', 'translate(' + 40 + ',' + xHeight + ')')
                .call(d3.axisBottom(xScale).tickSize(0))
                .select('.domain')
                .remove()

            svg.append('g')
                .style('font-size', 15)
                .call(d3.axisLeft(yScale).tickSize(0))
                .attr('transform', 'translate(' + 30 + ',' + margin.top + ')')
                .select('.domain')
                .remove()

            const myColor = d3
                .scaleSequential()
                .interpolator(d3.interpolateRainbow)
                .domain([1, 100])

            const tooltip = d3
                .selectAll('body')
                .append('div')
                .style('opacity', 0)
                .attr('class', 'tooltip')
                .style('position', 'absolute')
                .style('z-index', 10)
                .style('background-color', 'white')
                .style('border', 'solid')
                .style('border-width', '2px')
                .style('border-radius', '5px')
                .style('padding', '5px')

            svg.selectAll('rect')
                .data(data, function (d) {
                    return d.group + ':' + d.variable
                })
                .enter()
                .append('rect')
                .attr('x', function (d) {
                    return xScale(d.group)
                })
                .attr('y', function (d) {
                    return yScale(d.variable)
                })
                .attr('rx', 4)
                .attr('ry', 4)
                .attr('width', xScale.bandwidth())
                .attr('height', yScale.bandwidth())
                .style('fill', function (d) {
                    return myColor(d.value)
                })
                .style('stroke-width', 4)
                .style('stroke', 'none')
                .style('opacity', 0.8)
                .attr(
                    'transform',
                    'translate(' + 40 + ',' + margin.bottom + ')'
                )
                .on('mouseover', function (d, i) {
                    tooltip
                        .html('The exact value of<br>this cell is: ' + i.value)
                        .style('opacity', 1)

                    d3.select(this).style('stroke', 'block').style('opacity', 1)
                })
                .on('mousemove', function (d, i) {
                    tooltip
                        .style('left', d.pageX + 20 + 'px')
                        .style('top', d.pageY + 'px')
                })
                .on('mouseleave', function (d) {
                    tooltip.style('opacity', 0)
                    d3.select(this)
                        .style('stroke', 'none')
                        .style('opacity', 0.8)
                })

            // Add title to graph
            svg.append('text')
                .attr('x', 0)
                .attr('y', -50)
                .attr('text-anchor', 'left')
                .style('font-size', '22px')
                .text('A d3.js heatmap')

            // Add subtitle to graph
            svg.append('text')
                .attr('x', 0)
                .attr('y', -20)
                .attr('text-anchor', 'left')
                .style('font-size', '14px')
                .style('fill', 'grey')
                .style('max-width', 400)
                .text(
                    'A short description of the take-away message of this chart.'
                )
        })
    }, [])

    return (
        <div className="App">
            <h1>Heatmap</h1>
            <svg ref={svgRef}></svg>
        </div>
    )
}

export default Heatmap
