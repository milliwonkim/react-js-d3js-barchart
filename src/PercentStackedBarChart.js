import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './App.css'
import { stack } from 'd3'

function PercentStackedBarChart() {
    const svgRef = useRef()

    useEffect(() => {
        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 30, bottom: 20, left: 50 },
            width = 900,
            height = 700

        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height + 50)
            .append('g')
            .attr(
                'transform',
                'translate(' + margin.left + ',' + margin.top + ')'
            )

        d3.csv(
            'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv'
        ).then((data) => {
            console.log('Percentage Stacked Bar Chart Data: ', data)

            const subgroups = data.columns.slice(1)
            const groups = data.map((d) => {
                return d.group
            })

            const xAxis = d3
                .scaleBand()
                .domain(groups)
                .range([0, width - 170])
                .padding(0.2)

            const yAxis = d3.scaleLinear().domain([0, 100]).range([height, 0])

            const xHeight = height
            const yHeight = 0

            svg.append('g')
                .attr('transform', 'translate(0,' + xHeight + ')')
                .call(d3.axisBottom(xAxis).tickSizeOuter(0))

            svg.append('g')
                .call(d3.axisLeft(yAxis))
                .attr('transform', 'translate(0' + ',' + yHeight + ')')

            const color = d3
                .scaleOrdinal()
                .domain(subgroups)
                .range(['#e41a1c', '#377eb8', '#4daf4a'])

            const dataNormalized = []

            data.forEach(function (d) {
                let total = 0
                let name
                for (let i in subgroups) {
                    name = subgroups[i]
                    total += +d[name]
                }

                for (let i in subgroups) {
                    name = subgroups[i]
                    d[name] = (d[name] / total) * 100
                }
            })

            let stackedData = d3.stack().keys(subgroups)(data)

            svg.append('g')
                .selectAll('g')
                .data(stackedData)
                .enter()
                .append('g')
                .attr('fill', function (d) {
                    return color(d.key)
                })
                .selectAll('rect')
                .data(function (d) {
                    return d
                })
                .enter()
                .append('rect')
                .attr('x', function (d) {
                    return xAxis(d.data.group)
                })
                .attr('y', function (d) {
                    return yAxis(d[1])
                })
                .attr('height', function (d) {
                    return yAxis(d[0]) - yAxis(d[1])
                })
                .attr('width', xAxis.bandwidth())
        })
    }, [])

    return (
        <div>
            <h1>PercentStackedBarChart</h1>
            <svg ref={svgRef} />
        </div>
    )
}

export default PercentStackedBarChart
