---
layout: post
title: Build a Flutter Task App with BLoC, SQL and Notifications - Part 3
date: '2019-05-07'
categories: ['flutter']

comments: true
description:  Build a Flutter Task App with BLoC Pattern, Sqflite, and Notifications, Part 3 - BLoC and Inherited Widget.
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

## BLoC and Inherited Widget

Let's add our dependency of RxDart to the pubspec.yaml

```yaml
dependencies:
  flutter:
    sdk: flutter
  rxdart: ^0.20.0
  built_value: ^6.2.0
  sqflite: any
  path_provider: ^0.4.1
```

Today we will be working in our blocs folder if you are using the same project structure.

![data folder](../images/flutter_task_blocs_folder.png) 

First, we will implement our Inherited Widget that will allow us to access our bloc anywhere within the widget tree - app\_state\_provider.dart.

```dart
import 'package:flutter/material.dart';
import 'todo_bloc.dart';

class AppStateProvider extends InheritedWidget {
  final todoBloc = TodoBloc();

  AppStateProvider({Key key, Widget child})
      : super(key: key, child: child);

  @override
  bool updateShouldNotify(_) => true;

  static TodoBloc of(BuildContext context) {
    return (context.inheritFromWidgetOfExactType(AppStateProvider)
            as AppStateProvider)
        .todoBloc;
  }
}

```

The AppStateProvider references our yet to write todoBloc, attaching it to the context.

### The BLoC - todo_bloc.dart

```dart
import 'dart:async';
import 'package:flutter_task/src/data/todo_queries.dart';
import 'package:flutter_task/src/models/todo.dart';
import 'package:rxdart/rxdart.dart';

class TodoBloc {
  final _todoController = BehaviorSubject<List<Todo>>();
  final _completedTodoController = BehaviorSubject<List<Todo>>();
  final _singleTodoController = BehaviorSubject<Todo>();
  final _titleController = BehaviorSubject<String>();
  final _messageController = BehaviorSubject<String>();
  final _dueDateController = BehaviorSubject<String>();

  final todoQueries = TodoQueries();

  Stream<List<Todo>> get todoStream => _todoController.stream;
  Stream<List<Todo>> get completedTodos => _completedTodoController.stream;
  Stream<Todo> get singleTodoStream => _singleTodoController.stream;

  Stream<String> get title => _titleController.stream;
  Stream<String> get message => _messageController.stream;
  Stream<String> get dueDate => _dueDateController.stream;

  Function(String) get changeTitle => _titleController.sink.add;
  Function(String) get changeMessage => _messageController.sink.add;
  Function(String) get changeDueDate => _dueDateController.sink.add;
  Function(Todo) get addSingleTodo => _singleTodoController.sink.add;

  Future<int> submitTodo() async {
    final title = _titleController.value;
    if (title == null || title.isEmpty) {
      _titleController.sink.addError('Must not be empty');
      return null;
    }

    final message = _messageController.value;

    final dueDate = _dueDateController.value;

    Todo newTodo = Todo((b) => b
      ..todoId = null
      ..title = title
      ..message = message
      ..completed = 0
      ..dueDate = dueDate);

    var res = await insertTodo(newTodo);

    clearAddTodo();
    return res;
  }

  getIncompleteTodos() async {
    _todoController.sink.add(await todoQueries.getIncompleteTodos());
  }

  getCompletedTodos() async {
    _completedTodoController.sink.add(await todoQueries.getCompletedTodos());
  }

  Future<int> insertTodo(Todo todo) async {
    var res = await todoQueries.addTodo(todo);
    getIncompleteTodos();
    return res;
  }

  changeCompletion(Todo todo) async {
    Todo updatedTodo =
        todo.rebuild((b) => b..completed = todo.completed == 0 ? 1 : 0);
    await todoQueries.updateTodo(updatedTodo);
    getIncompleteTodos();
    getCompletedTodos();
  }

  updateEditingTodo() async {
    Todo todo = _singleTodoController.value;
    updateTodo(todo);
  }

  updateTodo(Todo todo) async {
    final title = _titleController.value;
    if (title == null || title.isEmpty) {
      _titleController.sink.addError('Must not be empty');
      return null;
    }

    final message = _messageController.value;

    final dueDate =
        _dueDateController.value == null ? '' : _dueDateController.value;

    Todo newTodo = Todo((b) => b
      ..todoId = todo.todoId
      ..title = title
      ..message = message
      ..completed = todo.completed
      ..dueDate = dueDate);
    if (todo != newTodo) {
      print(newTodo);
      await todoQueries.updateTodo(newTodo);
    }
    getIncompleteTodos();
    getCompletedTodos();
    clearAddTodo();
  }

  deleteTodo(Todo todo) async {
    await todoQueries.deleteTodo(todo);
    getIncompleteTodos();
  }

  clearAddTodo() async {
    _titleController.sink.add(null);
    _messageController.sink.add(null);
    _dueDateController.sink.add(null);
  }

  dispose() {
    _todoController.close();
    _titleController.close();
    _messageController.close();
    _dueDateController.close();
    _singleTodoController.close();
    _completedTodoController.close();
  }
}

```

Right off the bat, we define our StreamControllers, each of these is an RxDart BehaviorSubject specifying the type of data it will be handling.

```dart
final _todoController = BehaviorSubject<List<Todo>>();
final _completedTodoController = BehaviorSubject<List<Todo>>();
final _singleTodoController = BehaviorSubject<Todo>();
final _titleController = BehaviorSubject<String>();
final _messageController = BehaviorSubject<String>();
final _dueDateController = BehaviorSubject<String>();
```

Next, we instantiate the TodoQueries so that we can access the database.

```dart
final todoQueries = TodoQueries();
```

Now, we need define the getters that will each return a stream, so that we can read the values from it.

```dart
Stream<List<Todo>> get todoStream => _todoController.stream;
Stream<List<Todo>> get completedTodos => _completedTodoController.stream;
Stream<Todo> get singleTodoStream => _singleTodoController.stream;

Stream<String> get title => _titleController.stream;
Stream<String> get message => _messageController.stream;
Stream<String> get dueDate => _dueDateController.stream;
```

We get the streams, and now we need to be able add to each stream. This is done through the stream sink. These will each be a getter for a function that will pass a value into the stream.

```dart
Function(String) get changeTitle => _titleController.sink.add;
Function(String) get changeMessage => _messageController.sink.add;
Function(String) get changeDueDate => _dueDateController.sink.add;
Function(Todo) get addSingleTodo => _singleTodoController.sink.add;
```

Let's see how we get the data from the database and add it to the streams.

```dart
getIncompleteTodos() async {
  _todoController.sink.add(await todoQueries.getIncompleteTodos());
}

getCompletedTodos() async {
  _completedTodoController.sink.add(await todoQueries.getCompletedTodos());
}
```

Both of these functions query for the data and add a List of Todos to the correct stream.

Adding a todo will make more sense once we wire up the streams and sinks to the ui, but I will explain what is going on.

```dart
Future<int> submitTodo() async {
  final title = _titleController.value;
  if (title == null || title.isEmpty) {
    _titleController.sink.addError('Must not be empty');
    return null;
  }

  final message = _messageController.value;

  final dueDate = _dueDateController.value;

  Todo newTodo = Todo((b) => b
    ..todoId = null
    ..title = title
    ..message = message
    ..completed = 0
    ..dueDate = dueDate);

  var res = await insertTodo(newTodo);

  clearAddTodo();
  return res;
}
```

The values from the inputs will be placed in their corresponding streams, allowing us to get those values here in the bloc. We get the title value and check to see if a value is present, if not we add an error to the stream that can be displayed to the user. If that passes, we continue with the getting the message and dueDate. Then we have to build the todo using the builder pattern that built\_value provides for us. The  todoId is set to null, because we are allowing the database to handle it's creation. The completed status is set to zero to signify that the todo is in-complete.

Now we can insert the todo into the database.

The clearAddTodo call simply places a null into each stream, which we will later use to clear the inputs.

```dart
clearAddTodo() async {
  _titleController.sink.add(null);
  _messageController.sink.add(null);
  _dueDateController.sink.add(null);
}
```

All of the methods work similarly, but one thing to remember is to always close streams when you are done with them to avoid memory leaks.

```dart
dispose() {
    _todoController.close();
    _titleController.close();
    _messageController.close();
    _dueDateController.close();
    _singleTodoController.close();
    _completedTodoController.close();
  }
```

Next Up - [Add and Display Todos](/flutter/2019/05/08/flutter-task-tutorial-step-4)

[Source on Github](https://github.com/blehr/flutter_task/tree/master) 







