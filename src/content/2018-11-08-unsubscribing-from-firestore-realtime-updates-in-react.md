---
layout: post
title: Unsubscribing from Firestore Realtime updates in React
date: '2018-11-08'
categories: ['reactjs']
comments: true
description:  How to unsubscribe from Firestore Realtime updates in React
image: "../images/firestore_logo.png"
featured_image: "../images/firestore_logo.png"
featured_image_max_width: 300px
---

<!-- # Unsubscribing from Firestore Realtime updates in React -->

![firestore logo](../images/firestore_logo.png)


I recently built [Roll Call](https://play.google.com/store/apps/details?id=com.brandonlehr.rollcall) my attendance taking Android app utilizing Firestore as my database. When I went to build the companion [web app](https://brandonlehr.com/rollcall) with React and Redux, I was faced with the issue of how to unsubscribe from the realtime updates when I was finished with them. Every good developer guards against memory leaks 😃 !

## The Problem

Unsubscribing is easy as you can see here from the official docs.

```javascript
var unsubscribe = db.collection("cities")
    .onSnapshot(function () {});
// ...
// Stop listening to changes
unsubscribe();
```


The problem I was encountering was with the integration with React and Redux. My flow was as follows.

```javascript
📁 component (componentDidMount, onChange) -> 
📁 action creators (subscribe to realtime updates) ->
📁 reducers
``` 

Getting the unsubscribe function to the component was easy enough. I just returned it from the action creator.

```javascript
export const getAllSubGroups = (userId, topLevelDocId) => dispatch => {
  const unsubscribe = db
    .collection("sub_group")
    .where("userId", "==", userId)
    .where("topLevelDocId", "==", topLevelDocId)
    .onSnapshot(querySnapshot => {
      dispatch({
        type: GET_SUB_GROUPS,
        payload: querySnapshot.docs
      });
    });
  return unsubscribe;
};
```


Then I could access it in the calling method in the component. Here it is a select element with an onChange handler.

```javascript
handleChange = e => {
  const { value } = e.target;
  const { user } = this.props;
  if (value !== "") {
    const unsubscribe = this.props.getAllSubGroups(user.uid, value);
  }
};
```

Now I have the unsubscribe in the handleChange method, but how to get it into componentWillUnmount? For this I removed the `const` and attached the unsubscribe to `this` making it available to the component.

```javascript
handleChange = e => {
  const { value } = e.target;
  const { user } = this.props;
  if (value !== "") {
    this.unsubscribe = this.props.getAllSubGroups(user.uid, value);
  }
};
```

Now it can called in the componentWillUnmount lifecycle.

```js
componentWillUnmount = () => {
  // First check that it exists
  this.unsubscribe && this.unsubscribe();
};
```
Since this method is a select onChange handler, the Firestore could be subscribed to multiple times with different queries. So now we can check for the existence of a previous unsubscribe and cancel it before subscribing to a new query.

```javascript
handleChange = e => {
  const { value } = e.target;
  const { user } = this.props;
  if (value !== "") {
    this.unsubscribe && this.unsubscribe();
    this.unsubscribe = this.props.getAllSubGroups(user.uid, value);
  }
};
```
This approach has been working well for me. Let me know if you have found a better solution.
