---
layout: post
title: Android Edit Text Input Masking
date: '2018-08-20'
categories: ['android', 'learn-to-code']
comments: true
description: How to create Android Edit Text Input Masks
# image: "https://res.cloudinary.com/dtthr02eh/image/upload/c_scale,w_300/v1534806011/ssnMask_uzqup6.gif"
featured_image: "../images/ssnMask_uzqup6-c_scale,w_300.gif"
featured_image_max_width: 300px
---

<!-- ![input masking on android](../images/ssnMask_uzqup6.gif) -->


<div class="mw-400">
  <img src="https://res.cloudinary.com/dtthr02eh/image/upload/c_scale,w_300/v1534806011/ssnMask_uzqup6.gif" alt="input masking on android">
</div>

One thing I find really convenient when filling out forms is when the text is formatted in the correct pattern without me having to think about it. When an input just smashes all the numbers together it is harder for the user to recognize whether or not they have entered the correct data. It also leads to user confusion as they wonder whether or not they are supposed to enter the normal spaces, dashes, or parentheses, one would include when writing the requested information down.

So, how do we fix this in an Android application?

The easiest way is to create a class that implements [TextWatcher](https://developer.android.com/reference/android/text/TextWatcher) and add it as a Text Change Listener to the required Edit Text. 

Here is the Social Security Mask.

`gist:a7b7c606e0176a6ae59da399cc593688#SsnMask.java`

As you can see, the TextWatcher requires 3 methods of which only 2 of are of concern. The afterTextChanged method handles updating the Edit Text text. The onTextChanged method contains the logic that dictates the formatting. This is where you can make the necessary changes to enable the desired formatting. 

Here is how to apply the mask.

`gist:4cc1a7329c2e5d544cadc17d81af15e0`

Just one line and the mask will be applied. 

Another common mask that I find myself needing, is a date mask. I normally need my dates formatted as MM/dd/yyyy. Here is the code for that.

`gist:04275aa31bba819b9515decd9f0ffe8d`

Well, I hope you find this helpful! I know I searched for these answers when I needed them. If you have any questions or ideas for improvements, my employer would love for me to hear them! :) 

All of the code can be found here on [github](https://github.com/blehr/DatePickerExample)