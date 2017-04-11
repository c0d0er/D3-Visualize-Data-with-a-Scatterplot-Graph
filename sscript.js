class Scatterplot extends React.Component {
  componentDidMount() {
    $.getJSON('https://raw.githubusercontent.com/c0d0er/D3-Visualize-Data-with-a-Scatterplot-Graph/master/scatterPlot.json', (data) => {
      let plotData = data;
      const rank1Seconds = 2210; //fastest speed;
      const formatTime = d3.timeFormat("%M:%S"); //change seconds to m:s form;
      const formatSeconds = seconds => formatTime(new Date(2017, 3, 22, 0, 0, seconds)); //change seconds to m:s function;
      const margin = {
        top: 140,
        right: 120,
        bottom: 120,
        left: 120
      };

      let w = 1000 - margin.right - margin.left;
      let h = 800 - margin.top - margin.bottom;

      let yScale = d3.scaleLinear()
        .domain([1, 36]) //ranking 1-36;
        .range([0, h]);
      let xScale = d3.scaleLinear()
        .domain([199, 0]) //max behind 3.5 minutes;
        .range([0, w]);
      let div = d3.select('.plot').append('div');

      let svg = d3.select('.plot')
        .append('svg')
        .attr('width', w + margin.right + margin.left)
        .attr('height', h + margin.top + margin.bottom)
        .append('g')
        //.attr('fill', 'white')//change biker names color and ranking color;
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.selectAll('circle')
        .data(plotData)
        .enter()
        .append('circle')
        .attr('cx', d => {
          let time = d.Time.split(':');
          return xScale(Number(time[0] * 60) + Number(time[1]) - rank1Seconds)
        })
        .attr('cy', d => yScale(d.Place))
        .attr('r', 5)
        .attr('fill', d => !d.Doping ? 'blue' : 'red')
        .on('click', function(d) {
          if (d.URL) {
            window.open(d.URL)
          }
        })
        .on('mouseover', function(d) {
          let dopingInfo = d.Doping ? d.Doping : 'No Allegations';
          div.html('<div class="tooltip1"><span class="name">' + d.Name + ': ' + d.Nationality +
              '</span><br><span class="year">Year: ' + d.Year + ', Time: ' + d.Time +
              '</span><br><span class="doping">' + dopingInfo + '</span></div>')
            //.style('display', 'inline')
            .style("left", (d3.event.clientX + 20) + "px")
            .style("top", (d3.event.clientY - 50) + "px")
            .style('position', 'absolute');
          d3.select(this)
            .attr('r', 7)
            .style('cursor', 'pointer');
          //.classed('hidden', false);
        })
        .on('mouseout', function(d) {
          d3.select('.tooltip1')
            .classed('hidden', true);
          d3.select(this)
            .attr('r', 5)
            .style('cursor', 'default');
        });
      //add names for each player;
      svg.selectAll('text')
        .data(plotData)
        .enter()
        .append('text')
        .attr('x', d => {
          let time = d.Time.split(':');
          return xScale(Number(time[0] * 60) + Number(time[1]) - rank1Seconds) + 10
        })
        .attr('y', d => yScale(d.Place) + 5)
        .text(d => d.Name);

      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + h + ')')
        .style('font-size', '15px')
        .call(d3.axisBottom(xScale)
          .tickFormat(formatSeconds)
        );

      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + 0 + ',0)')
        .style('font-size', '15px')
        .call(d3.axisLeft(yScale));

      // gridlines in x axis function
      function make_x_gridlines() {
        return d3.axisBottom(xScale)
          .ticks(7)
      }

      // gridlines in y axis function
      function make_y_gridlines() {
        return d3.axisLeft(yScale)
          .ticks(5)
      }
      // add the X gridlines
      svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + h + ")")
        .attr('opacity', 0.2)
        .style("stroke-dasharray", "1")
        .call(make_x_gridlines()
          .tickSize(-h)
          .tickSizeOuter(0)
          .tickFormat("")
        );

      // add the Y gridlines
      svg.append("g")
        .attr("class", "grid")
        .style("stroke-dasharray", "5 5")
        .attr('opacity', 0.2)
        .call(make_y_gridlines()
          .tickSize(-w)
          .tickSizeOuter(0)
          .tickFormat("")
        );

      svg.selectAll(".tick > line")
        .each(function(d) {
          if (d === 0) {
            this.remove();
          }
        });

      svg.append("text")
        .attr("transform", "translate(" + (w / 2) + " ," + (-97) + ")")
        .style("text-anchor", "middle")
        .attr('fill', 'black')
        .style('font-size', '1.9em')
        .text("Doping in Professional Bicycle Racing");

      svg.append("text")
        .attr("transform", "translate(" + (w / 2) + " ," + (-57) + ")")
        .style("text-anchor", "middle")
        .attr('fill', 'black')
        .style('font-size', '1.5em')
        .text("35 Fastest times up Alpe d'Huez");

      svg.append("text")
        .attr("transform", "translate(" + (w / 2) + " ," + (-22) + ")")
        .style("text-anchor", "middle")
        .attr('fill', 'black')
        .style('font-size', '1.2em')
        .text("Normalized to 13.8km distance");

      svg.append("text")
        .attr("transform", "translate(" + (w / 2) + " ," + (h + 45) + ")")
        .style("text-anchor", "middle")
        .attr('fill', 'black')
        .style('font-size', '1.2em')
        .text("Minutes Behind Fastest Time");

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -170)
        //.attr("dy", "1.5em")
        .style("text-anchor", "end")
        .style('font-size', '1.2em')
        .text("Ranking");

      svg.append('circle')
        .attr('cx', d => xScale(123))
        .attr('cy', h + 65)
        .attr('r', 5)
        .attr('fill', 'blue');

      svg.append("text")
        .attr('x', d => xScale(103))
        .attr('y', h + 68)
        .style("text-anchor", "middle")
        .attr('fill', 'black')
        .style('font-size', '1em')
        .text("No doping allegations");

      svg.append('circle')
        .attr('cx', d => xScale(123))
        .attr('cy', h + 90)
        .attr('r', 5)
        .attr('fill', 'red');

      svg.append("text")
        .attr('x', d => xScale(96))
        .attr('y', h + 93)
        .style("text-anchor", "middle")
        .attr('fill', 'black')
        .style('font-size', '1em')
        .text("Riders with doping allegations");
    })
  }

  render() {
    return (
      <div>
      <div className='plot'>
      
      </div>
      <div className="foot">Sources: <br/>
https://en.wikipedia.org/wiki/Alpe_d%27Huez'<br/>
http://www.fillarifoorumi.fi/forum/showthread.php?38129-Ammattilaispy%F6r%E4ilij%F6iden-nousutietoja-%28aika-km-h-VAM-W-W-kg-etc-%29&p=2041608#post2041608<br/>
https://alex-cycle.blogspot.com/2015/07/alpe-dhuez-tdf-fastest-ascent-times.html<br/>
http://www.dopeology.org/
</div>
</div>
    )
  }
}

ReactDOM.render(<Scatterplot/>,
  document.getElementById('app'));
