import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './App.css'; // Make sure to include the styles for the font family

const ReactNatPlot = () => {
  const [activeChart, setActiveChart] = useState('INR');
  const svgRef = useRef();

  const width = 900;
  const height = 600;
  const margin = { top: 40, right: 40, bottom: 60, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Updated data for React Native developers
  const rawData = [
    { company: 'Myntra', role: 'Software Engineer', city: 'Bengaluru', salaryUSD: 36145, salaryINR: 3003649.5, experience: 3.10, education: 'Jaypee Institute of Information Technology' },
    { company: 'MakeMyTrip Pvt Ltd', role: 'Software Engineer', city: 'Gurugram', salaryUSD: 24096, salaryINR: 2002377.6, experience: 2, education: 'Dronacharya College of Engineering' },
    { company: 'Razorpay', role: 'Software Engineer', city: 'Bengaluru', salaryUSD: 40964, salaryINR: 3404108.4, experience: 3.6, education: 'Chitkara Institute of Engineering & Technology' },
    { company: 'Unacademy', role: 'Software Engineer', city: 'Bengaluru', salaryUSD: 44578, salaryINR: 3704431.8, experience: 4.3, education: 'PES Modern College of Engineering' },
    { company: 'MakeMyTrip Pvt Ltd', role: 'Senior Software Engineer', city: 'Bengaluru', salaryUSD: 32530, salaryINR: 2703243, experience: 2.9, education: 'National Institute of Technology Silchar' },
    { company: 'Paytm', role: 'Senior Software Engineer', city: 'Bengaluru', salaryUSD: 30120, salaryINR: 2502972, experience: 4.6, education: 'University of Engineering and Management' },
    { company: 'Swiggy', role: 'Software Development Engineer 2', city: 'Bengaluru', salaryUSD: 36145, salaryINR: 3003649.5, experience: 4, education: 'Gyan Ganga College of Technology, Jabalpur' },
    { company: 'Myntra', role: 'Senior Software Engineer', city: 'Gurugram', salaryUSD: 42169, salaryINR: 3504243.9, experience: 4, education: 'Indian School of Mines, Dhanbad' },
    { company: 'Flipkart', role: 'Software Engineer', city: 'New Delhi', salaryUSD: 30120, salaryINR: 2502972, experience: 4.6, education: 'Guru Gobind Singh Indraprastha University (GGSIPU)' },
    { company: 'Paytm', role: 'Software Engineer', city: 'Pune', salaryUSD: 30120, salaryINR: 2502972, experience: 3, education: 'Fergusson College, Pune' },
    { company: 'Swiggy', role: 'Software Engineer', city: 'Bengaluru', salaryUSD: 30120, salaryINR: 2502972, experience: 2, education: 'Birla Institute of Technology and Science, Pilani' }
  ];

  useEffect(() => {
    if (rawData.length === 0) return;

    // Set up SVG and scales
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear existing content

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([1.5, 5])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain(activeChart === 'INR' ? [0, 4000000] : [0, 50000])
      .range([innerHeight, 0]);

    // X-axis
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickValues([1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]));

    xAxis.selectAll("text")
      .attr('font-size', '12px')
      .attr('font-family', 'Onest');

    xAxis.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .attr('font-family', 'Onest')
      .attr('font-size', '16px')
      .text('Years of Experience');

    // Y-axis
    const yAxis = g.append('g')
      .call(activeChart === 'INR' 
        ? d3.axisLeft(yScale).tickValues([0,  500000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000])
        : d3.axisLeft(yScale).tickValues([0, 10000, 20000, 30000, 40000, 50000]));

    yAxis.selectAll("text")
      .attr('font-size', '12px')
      .attr('font-family', 'Onest');

    yAxis.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 0)
      .attr('x', -innerHeight / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .attr('font-family', 'Onest')
      .attr('fill', 'black')
      .attr('font-size', '16px')
      .text(`Current Salary (${activeChart})`);

    // Grid lines
    const make_x_gridlines = () => d3.axisBottom(xScale).ticks(10);
    const make_y_gridlines = () => d3.axisLeft(yScale).ticks(10);

    // Add X gridlines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(make_x_gridlines()
        .tickSize(-innerHeight)
        .tickFormat("")
      );

    // Add Y gridlines
    g.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
        .tickSize(-innerWidth)
        .tickFormat("")
      );

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("font-family", "Onest");

    // Add circles and company names
    const circles = g.selectAll('circle')
      .data(rawData)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.experience))
      .attr('cy', d => yScale(activeChart === 'INR' ? d.salaryINR : d.salaryUSD))
      .attr('r', 5)
      .attr('fill', '#005dff')
      .on("mouseover", (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`Company: ${d.company}<br/>
                      Role: ${d.role}<br/>
                      City: ${d.city}<br/>
                      Experience: ${d.experience} years<br/>
                      Salary (${activeChart}): ${activeChart === 'INR' ? d.salaryINR.toLocaleString() : d.salaryUSD.toLocaleString()}<br/>
                      Education: ${d.education}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Add company names
    g.selectAll('text.company')
      .data(rawData)
      .enter()
      .append('text')
      .attr('class', 'company')
      .attr('x', d => xScale(d.experience))
      .attr('y', d => yScale(activeChart === 'INR' ? d.salaryINR : d.salaryUSD) - 10)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Onest')
      .attr('font-size', '14px')
      .attr('fill', '#005dff')
      .text(d => d.company);

  }, [activeChart, rawData]);

  // Styles for the buttons
  const buttonStyle = {
    padding: '10px 20px',
    margin: '0 10px',
    border: '2px solid #000',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    fontFamily: 'Onest'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'blue',
    color: 'white',
  };

  const inactiveButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'white',
    color: 'black',
  };

  return (
    <div className="App" style={{ fontFamily: 'Onest' }}>
      <div>
        <button 
          style={activeChart === 'INR' ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => setActiveChart('INR')}
        >
          INR
        </button>
        <button 
          style={activeChart === 'USD' ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => setActiveChart('USD')}
        >
          USD
        </button>
      </div>
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default ReactNatPlot;