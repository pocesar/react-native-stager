[![Build Status](https://travis-ci.org/pocesar/react-native-stager.svg?branch=master)](https://travis-ci.org/pocesar/react-native-stager) [![Coverage Status](https://coveralls.io/repos/github/pocesar/react-native-stager/badge.svg?branch=master)](https://coveralls.io/github/pocesar/react-native-stager?branch=master) [![npm version](https://badge.fury.io/js/react-native-stager.svg)](https://badge.fury.io/js/react-native-stager)

# react-native-stager

A performant wizard-like multi stages component for React Native without a router

## Why?

Using a router solution to create a multi-step wizard-like interface is good, but sometimes you want
to keep all your state in just one parent component without having to rely on `redux` for example,
enter the `Stager`

## How?

```jsx
import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import Stager, { Stage } from 'react-native-stager'

class MyWizard extends React.Component {
  render() {
    return (
      <Stager onChange={(stage, direction) => {
        // stage == step 1 || step 2
        // direction = 1 = next | -1 = prev | 0 = reset / initial
      }}>
        <Stage key="step 1" continue={() => true}>
          {({ context }) => (
            <View>
              <TouchableOpacity onPress={context.notify}>
                <Text>{'Hello'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </Stage>

        <Stage key="step 2" noPrevious loaded={(cb) => this.setState({ loaded: true }, cb)}>
          {() => (
            <Text>{'World'}</Text>
          )}
        </Stage>
      </Stager>
    )
  }
}

export default MyWizard
```

## Caveats

* Since you need to use function children, your `shouldComponentUpdate` might go crazy. To counter that
assign a class member for your function that returns your component
* The default progress and prev / next buttons are dull, and most likely won't match your application
style. For that, use `StageProgress` and `StageButtons` wherever you feel like it
* Children `Stage` won't automatically update (since `Stage` has `shouldComponentUpdate` to return `false`), so you
need, on the `instance`, to call `refresh` whenever you need to update your prev / next buttons

## License

MIT