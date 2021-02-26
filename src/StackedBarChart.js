import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './App.css'
import { stackOrderAscending } from 'd3'

function StackedBarChart() {
    const svgRef = useRef()

    const data = [
        {
            year: 1980,
            '🥑': 10,
            '🍌': 20,
            '🍆': 30,
        },
        {
            year: 1990,
            '🥑': 20,
            '🍌': 40,
            '🍆': 60,
        },
        {
            year: 2000,
            '🥑': 30,
            '🍌': 45,
            '🍆': 80,
        },
        {
            year: 2010,
            '🥑': 40,
            '🍌': 60,
            '🍆': 100,
        },
        {
            year: 2020,
            '🥑': 50,
            '🍌': 80,
            '🍆': 120,
        },
    ]

    const allKeys = ['🥑', '🍌', '🍆']

    const colors = {
        '🥑': 'green',
        '🍌': 'orange',
        '🍆': 'purple',
    }

    const [keys, setKeys] = useState(allKeys)

    useEffect(() => {
        const margin = { top: 20, right: 100, bottom: 20, left: 100 }
        const width = 600
        const height = 400

        const stackGenerator = d3.stack().keys(keys).order(stackOrderAscending)

        const layers = stackGenerator(data)

        const extent = [
            0,
            d3.max(layers, (layer) => d3.max(layer, (d) => d[1])),
        ]

        const svg = d3
            .select(svgRef.current)
            .attr('viewBox', [0, 0, width, height - 100])

        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.year))
            .range([0, width - 180])
            .padding(0.2)

        const yScale = d3
            .scaleLinear()
            .domain(extent)
            .range([height - 100, 0])

        let xHeight = height - margin.bottom - 100

        svg.append('g')
            .attr('class', 'x_bar')
            .call(d3.axisBottom(xScale))
            .attr('transform', 'translate(' + margin.left + ',' + xHeight + ')')

        svg.append('g')
            .attr('class', 'y_bar')
            .call(d3.axisLeft(yScale))
            .attr('transform', 'translate(' + 100 + ',' + -margin.bottom + ')')

        svg.selectAll('.layer')
            .data(layers)
            .join('g')
            .attr('class', 'layer')
            .attr('fill', (layer) => colors[layer.key])
            .selectAll('rect')
            .data((layer) => layer)
            .join('rect')
            .attr('x', (sequence) => xScale(sequence.data.year))
            .attr('y', (sequence) => yScale(sequence[1]))
            .attr('width', xScale.bandwidth())
            .attr(
                'height',
                (sequence) => yScale(sequence[0]) - yScale(sequence[1])
            )
            .attr('transform', 'translate(' + 100 + ',' + -margin.bottom + ')')

        return () => {
            svg.selectAll('g').remove()
        }
    }, [colors, data, keys])

    return (
        <div className="App">
            <h1>StackedBarChart</h1>
            <svg ref={svgRef} />
            {allKeys.map((key) => (
                <div key={key} className="field">
                    {key === '🥑'
                        ? 'Avocado'
                        : key === '🍌'
                        ? 'Banana'
                        : 'Grape'}
                    <input
                        id={key}
                        type="checkbox"
                        checked={keys.includes(key)}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setKeys(Array.from(new Set([...keys, key])))
                            } else {
                                setKeys(keys.filter((_key) => _key !== key))
                            }
                        }}
                    />
                </div>
            ))}
        </div>
    )
}

export default StackedBarChart
