---
id: 573
title: Building a React Select Box Component
date: 2016-06-07
author: Brandon
layout: post
guid: http://brandonlehr.com/?p=573
permalink: /building-react-select-box-component/
categories: ['javascript', 'learn-to-code', 'reactjs']
featured_image: '../images/react_logo-300x300.png'
featured_image_max_width: 300px
image: '../images/react_logo-300x300.png'
comments: true
description: How to build a select box in reactjs
---

![react logo select box](../images/react_logo-300x300.png)

Maybe it&#8217;s just me, but the first time I built a select box in react, I was a little confused how it would work. When an option is selected, is it an onSelect event? How is the value entered into the state? Here is what I learned.

I was over thinking it. It turns out a select is pretty much handled the same way as any other react input. The `<select>` receives an onChange handler that can set the new state with the target value of the selected option. The code should make more sense than my words, so let&#8217;s just skip to that.

## React Select Box

<iframe height='350' scrolling='no' title='React Select Box' src='//codepen.io/blehr/embed/pbjNGR/?height=265&theme-id=0&default-tab=js,result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/blehr/pen/pbjNGR/'>React Select Box</a> by Brandon (<a href='https://codepen.io/blehr'>@blehr</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

&nbsp;
