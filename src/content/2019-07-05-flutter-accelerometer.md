---
layout: post
title: Using the Accelerometer in Flutter
date: '2019-07-05'
categories: ['Android', 'iOS', 'flutter']

comments: true
description: How to use the accelerometer in a Flutter app.
image: '../images/flutter-logo.svg'
featured_image: '../images/flutter-logo.svg'
featured_image_max_width: 300px
---
<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/ZDOyCNTM9ro/?mute=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>


I recently wanted to create a simple game for my [Drink Counter](/Android/iOS/flutter/2019/06/27/drink-counter-stats-and-quotes) app that made use of the device's accelerometer. Here is what I learned.

##Setup


The first thing you need to do is to get the [sensors](https://pub.dev/packages/sensors) package and include it in your pubspec.yaml.

```yaml
dependencies:
  flutter:
    sdk: flutter

  # The following adds the Cupertino Icons font to your application.
  # Use with the CupertinoIcons class for iOS style icons.
  cupertino_icons: ^0.1.2
  sensors: ^0.4.0+1


```


Since we will be moving the phone around to position the circle, we will have to lock the screen orientation to portrait.

For Android add `android:screenOrientation="portrait"` to the AndroidManifest.xml

For iOS edit the info.plist

```xml
	<key>UISupportedInterfaceOrientations</key>
	<array>
		<string>UIInterfaceOrientationPortrait</string>
	</array>
```
<br>

##Widgets!

Let's start by building the screen.

To make this look good on all screen sizes, I first get references to the screen's width and height. These are used throughout to set sizes and positions.

The main part of the screen is a Stack containing our "target" and moving circle. An empty Container with a width and height is used to create the size of the stack. The target has two Containers with decoration set to render a circle and each wrapped in a Positioned widget. The circle that will be moving, is a Container with a color, wrapped in a ClipOval to make it round, all inside of another Positioned widget.

```dart
@override
  Widget build(BuildContext context) {
    // get the width and height of the screen
    width = MediaQuery.of(context).size.width;
    height = MediaQuery.of(context).size.height;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text('Keep the circle in the center for 1 second'),
          ),
          Stack(
            children: [
              // Empty container given a width and height to set the size of the stack
              Container(
                height: height / 2,
                width: width,
              ),

              // Outer target circle wrapped in a Positioned
              Positioned(
                // positioned 50 from the top of the stack
                // and centered horizontally, left = (ScreenWidth - Container width) / 2
                top: 50,
                left: (width - 250) / 2,
                child: Container(
                  height: 250,
                  width: 250,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.red, width: 2.0),
                    borderRadius: BorderRadius.circular(125),
                  ),
                ),
              ),
              // This is the colored circle that will be moved by the accelerometer
              // the top and left are variables that will be set
              Positioned(
                top: top,
                left: left ?? (width - 100) / 2,
                // the container has a color and is wrapped in a ClipOval to make it round
                child: ClipOval(
                  child: Container(
                    width: 100,
                    height: 100,
                    color: color,
                  ),
                ),
              ),
              // inner target circle wrapped in a Positioned
              Positioned(
                top: 125,
                left: (width - 100) / 2,
                child: Container(
                  height: 100,
                  width: 100,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.green, width: 2.0),
                    borderRadius: BorderRadius.circular(50),
                  ),
                ),
              ),
            ],
          ),
          Text('x: ${(event?.x ?? 0).toStringAsFixed(3)}'),
          Text('y: ${(event?.y ?? 0).toStringAsFixed(3)}'),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: RaisedButton(
              onPressed: startTimer,
              child: Text('Begin'),
              color: Theme.of(context).primaryColor,
              textColor: Colors.white,
            ),
          )
        ],
      ),
    );
  }
```
<br>

##Accelerometer

Data from the accelerometer can be accessed by calling

```dart
accelerometerEvents.listen((AccelerometerEvent event) {
  print(event);
});

//  [AccelerometerEvent (x: 0.016758691519498825, y: 0.0004788197111338377, z: 9.788512229919434)]
```

Each event has an x, y, and z property that have values ranging from -10 to 10. For this project we are only concerned with the x and y values. With the device lying flat on a table both of these values will be zero (or close to it).

## Setting the position

```dart
setPosition(AccelerometerEvent event) {
  if (event == null) {
    return;
  }

  // When x = 0 it should be centered horizontally
  // The left positin should equal (width - 100) / 2
  // The greatest absolute value of x is 10, multipling it by 12
  // allows the left position to move a total of 120 in either direction.
  setState(() {
    left = ((event.x * 12) + ((width - 100) / 2));
  });

  // When y = 0 it should have a top position matching the target,
  // which we set at 125
  setState(() {
    top = event.y * 12 + 125;
  });
}

```
<br>

##Checking the position and setting the color

```dart
setColor(AccelerometerEvent event) {
  // Calculate Left
  double x = ((event.x * 12) + ((width - 100) / 2));
  // Calculate Top
  double y = event.y * 12 + 125;

  // find the difference from the target position
  var xDiff = x.abs() - ((width - 100) / 2);
  var yDiff = y.abs() - 125;

  // check if the circle is centered,
  // currently allowing a buffer of 3 to make centering easier
  if (xDiff.abs() < 3 && yDiff.abs() < 3) {
    // set the color and increment count
    setState(() {
      color = Colors.greenAccent;
      count += 1;
    });
  } else {
    // set the color and reset count
    setState(() {
      color = Colors.red;
      count = 0;
    });
  }
}

```
<br>


##Putting it all together

```dart
class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  // color of the circle
  Color color = Colors.greenAccent;

  // event returned from accelerometer stream
  AccelerometerEvent event;

  // hold a refernce to these, so that they can be disposed
  Timer timer;
  StreamSubscription accel;

  // positions and count
  double top = 125;
  double left;
  int count = 0;

  // variables for screen size
  double width;
  double height;

  setColor(AccelerometerEvent event) {
    // Calculate Left
    double x = ((event.x * 12) + ((width - 100) / 2));
    // Calculate Top
    double y = event.y * 12 + 125;

    // find the difference from the target position
    var xDiff = x.abs() - ((width - 100) / 2);
    var yDiff = y.abs() - 125;

    // check if the circle is centered, currently allowing a buffer of 3 to make centering easier
    if (xDiff.abs() < 3 && yDiff.abs() < 3) {
      // set the color and increment count
      setState(() {
        color = Colors.greenAccent;
        count += 1;
      });
    } else {
      // set the color and restart count
      setState(() {
        color = Colors.red;
        count = 0;
      });
    }
  }

  setPosition(AccelerometerEvent event) {
    if (event == null) {
      return;
    }

    // When x = 0 it should be centered horizontally
    // The left positin should equal (width - 100) / 2
    // The greatest absolute value of x is 10, multipling it by 12 allows the left position to move a total of 120 in either direction.
    setState(() {
      left = ((event.x * 12) + ((width - 100) / 2));
    });

    // When y = 0 it should have a top position matching the target, which we set at 125
    setState(() {
      top = event.y * 12 + 125;
    });
  }


  startTimer() {
    // if the accelerometer subscription hasn't been created, go ahead and create it
    if (accel == null) {
      accel = accelerometerEvents.listen((AccelerometerEvent eve) {
        setState(() {
          event = eve;
        });
      });
    } else {
      // it has already ben created so just resume it
      accel.resume();
    }

    // Accelerometer events come faster than we need them so a timer is used to only proccess them every 200 milliseconds
    if (timer == null || !timer.isActive) {
      timer = Timer.periodic(Duration(milliseconds: 200), (_) {
        // if count has increased greater than 3 call pause timer to handle success
        if (count > 3) {
          pauseTimer();
        } else {
          // proccess the current event
          setColor(event);
          setPosition(event);
        }
      });
    }
  }

  pauseTimer() {
    // stop the timer and pause the accelerometer stream
    timer.cancel();
    accel.pause();

    // set the success color and reset the count
    setState(() {
      count = 0;
      color = Colors.green;
    });
  }

  @override
  void dispose() {
    timer?.cancel();
    accel?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // get the width and height of the screen
    width = MediaQuery.of(context).size.width;
    height = MediaQuery.of(context).size.height;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text('Keep the circle in the center for 1 second'),
          ),
          Stack(
            children: [
              // This empty container is given a width and height to set the size of the stack
              Container(
                height: height / 2,
                width: width,
              ),

              // Create the outer target circle wrapped in a Position
              Positioned(
                // positioned 50 from the top of the stack
                // and centered horizontally, left = (ScreenWidth - Container width) / 2
                top: 50,
                left: (width - 250) / 2,
                child: Container(
                  height: 250,
                  width: 250,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.red, width: 2.0),
                    borderRadius: BorderRadius.circular(125),
                  ),
                ),
              ),
              // This is the colored circle that will be moved by the accelerometer
              // the top and left are variables that will be set
              Positioned(
                top: top,
                left: left ?? (width - 100) / 2,
                // the container has a color and is wrappeed in a ClipOval to make it round
                child: ClipOval(
                  child: Container(
                    width: 100,
                    height: 100,
                    color: color,
                  ),
                ),
              ),
              // inner target circle wrapped in a Position
              Positioned(
                top: 125,
                left: (width - 100) / 2,
                child: Container(
                  height: 100,
                  width: 100,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.green, width: 2.0),
                    borderRadius: BorderRadius.circular(50),
                  ),
                ),
              ),
            ],
          ),
          Text('x: ${(event?.x ?? 0).toStringAsFixed(3)}'),
          Text('y: ${(event?.y ?? 0).toStringAsFixed(3)}'),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: RaisedButton(
              onPressed: startTimer,
              child: Text('Begin'),
              color: Theme.of(context).primaryColor,
              textColor: Colors.white,
            ),
          )
        ],
      ),
    );
  }
}

```

<br>

[View code](https://gist.github.com/blehr/d39288ca9640de7a98b02d9d0b493959)
