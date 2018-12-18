import React, { Component } from 'react'

export default class GoogleAd extends Component {
  componentDidMount = () => {
    if (typeof window !== 'undefined') {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  }

  render() {
    return (
      <div style={this.props.wrapperDivStyle}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={this.props.client}
          data-ad-slot={this.props.slot}
          data-ad-format={this.props.format}
          data-full-width-responsive="true"
        />
      </div>
    )
  }
}
