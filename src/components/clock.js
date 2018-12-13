import React, { Component } from 'react'

class Clock extends Component {
  componentDidMount = () => {
    
    var date = new Date()
    var seconds = date.getSeconds()
    var minutes = date.getMinutes()
    var hours = date.getHours()

    var hands = [
      {
        hand: 'hours',
        angle: hours * 30 + minutes / 2,
      },
      {
        hand: 'minutes',
        angle: minutes * 6,
      },
      {
        hand: 'seconds',
        angle: seconds * 6,
      },
    ]
    for (var j = 0; j < hands.length; j++) {
      var elements = document.querySelectorAll('.' + hands[j].hand)
      for (var k = 0; k < elements.length; k++) {
        elements[k].style.webkitTransform = 'rotateZ(' + hands[j].angle + 'deg)'
        elements[k].style.transform = 'rotateZ(' + hands[j].angle + 'deg)'
        // If this is a minute hand, note the seconds position (to calculate minute position later)
        // if (hands[j].hand === 'minutes') {
        //   elements[k].parentNode.setAttribute(
        //     'data-second-angle',
        //     hands[j + 1].angle
        //   )
        // }
      }
    }
  }

  render() {
    return (
        <article className="clock">
          <section className="hours-container">
            <section className="hours" />
          </section>
          <section className="minutes-container">
            <section className="minutes" />
          </section>
          <section className="seconds-container">
            <section className="seconds" />
          </section>
        </article>
    )
  }
}

export default Clock
