---
layout: post
title: Build a Flutter Task App with BLoC, SQL and Notifications - Part 5
date: '2019-05-09'
categories: ['flutter']

comments: true
description:  Build a Flutter Task App with BLoC Pattern, Sqflite, and Notifications, Part 5 - Notifications.
image: "../images/logo_lockup_flutter_horizontal.svg"
featured_image: "../images/logo_lockup_flutter_horizontal.svg"
featured_image_max_width: 300px
---

Welcome to this series on building a Flutter Tasks App utilizing the Bloc pattern, notifications, and mysql for data storage.

![flutter logo](../images/logo_lockup_flutter_horizontal.svg)


## Flutter Task

Flutter Task is a simple todo app inspired by Google's own Tasks app for Android. Here is an overview of what the finished app will look like.


<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/dblMcGSKot8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>


### Flutter Task Series
* Part 1 - [Data Model and built\_value](/flutter/2019/05/05/flutter-task-tutorial-step-1)
* Part 2 - [Database and queries](/flutter/2019/05/06/flutter-task-tutorial-step-2)
* Part 3 - [BLoC and Inherited Widget](/flutter/2019/05/07/flutter-task-tutorial-step-3)
* Part 4 - [Add and Display Todos](/flutter/2019/05/08/flutter-task-tutorial-step-4)
* Part 5 - [Notifications](/flutter/2019/05/09/flutter-task-tutorial-step-5)


### Notifications

Our tasks have option of specifying a due date, so it would be nice to notify the user when that task is due.

### NotificationManager - notification_manager.dart

```dart
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationManager {
  static final NotificationManager _instance = NotificationManager._internal();

  factory NotificationManager() {
    return _instance;
  }

  NotificationManager._internal();

  static FlutterLocalNotificationsPlugin _flutterLocalNotificationsPlugin; 

  FlutterLocalNotificationsPlugin get() {
    if (_flutterLocalNotificationsPlugin != null) {
      return _flutterLocalNotificationsPlugin;
    }
    _flutterLocalNotificationsPlugin = initPlugin();

    return _flutterLocalNotificationsPlugin;
  }


  initPlugin() {
    _flutterLocalNotificationsPlugin = new FlutterLocalNotificationsPlugin();
    var initializationSettingsAndroid =
        new AndroidInitializationSettings('@mipmap/ic_launcher');
    var initializationSettingsIOS = new IOSInitializationSettings();
    var initializationSettings = new InitializationSettings(
        initializationSettingsAndroid, initializationSettingsIOS);

    _flutterLocalNotificationsPlugin.initialize(initializationSettings,
        onSelectNotification: onSelectNotification);
    return _flutterLocalNotificationsPlugin;
  }

  Future onSelectNotification(String payload) async {
    if (payload != null) {
      print('notification payload: ' + payload);
    }
  }
}

```

### Notifications - notifications.dart

```dart
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_task/src/models/todo.dart';
import 'package:flutter_task/src/utils/notification_manager.dart';
import 'package:flutter_task/src/utils/helpers.dart';

const String _notificationChannelId = 'ScheduledNotification';
const String _notificationChannelName = 'Scheduled Notification';
const String _notificationChannelDescription =
    'Pushes a notification at a specified date';

Future scheduleNotification(Todo todo) async {
  FlutterLocalNotificationsPlugin notificationManager =
      NotificationManager().get();

  final notificationDetails = NotificationDetails(
    AndroidNotificationDetails(
      _notificationChannelId,
      _notificationChannelName,
      _notificationChannelDescription,
      importance: Importance.Max,
      priority: Priority.High,
    ),
    IOSNotificationDetails(),
  );

  await notificationManager.schedule(
    todo.todoId,
    todo.title,
    todo.message,
    Helpers.setDueDateToNotificationTime(dateString: todo.dueDate),
    notificationDetails,
    payload: todo.toString(),
  );
}

Future<Null> cancelNotification(Todo todo) async {
  FlutterLocalNotificationsPlugin notificationManager =
      NotificationManager().get();

  await notificationManager.cancel(todo.todoId);
  return null;
}

```


[Source on Github](https://github.com/blehr/flutter_task/tree/master) 