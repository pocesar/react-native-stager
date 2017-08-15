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
          {({ instance, context }) => (
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

## Components and API

`Stager`

The root component that will hold the steps. Accepts an `onChange` prop that receives the transitioning stage name and the direction (-1 = prev / 1 = next / 0 = reset/initial).
Can be safely nested.

```tsx
<Stager onChange={(stage, direction) => {
  // do something nice
  }}>
<Stager>
```

`Stage`

Need to set inside `Stager`. Can use `continue`, `noPrevious` and `loaded` props.
Notice that the children must always be a function. The `key` prop is required.

It receives an object with `instance` (this current `Stage`) and
`context` (the current `Stager`)

```tsx
<Stager>
  <Stage key="step 1">
    {({ instance, context }) => (
      <Text>{'This is step 1'}</Text>
    )}
  </Stage>
</Stager>
```

When using `continue`, you always need to signal to the `Stage` that it should re-evaluate the
`continue` function, to see if you're able to continue. This is so the component doesn't
re-render everytime everytime a children changes.

```tsx
<Stager>
  <Stage
    key="step 1"
    continue={() => this.state.canContinue}
    >
    {({ instance, context }) => (
      <View>
        <Text>{'This is step 1'}</Text>
        <Button title="can continue" onPress={() => {
          this.setState({
            canContinue: true
          }, instance.refresh)
        }} />
      </View>
    )}
  </Stage>

  <Stage
    key="step 2"
    loaded={(cb) => this.setState({ canContinue: false }, cb)}
    continue={() => this.state.canContinue}
    >
    {({ instance, context }) => (
      <View>
        <Text>{'This is step 1'}</Text>
        <Button title="can continue" onPress={() => {
          this.setState({
            canContinue: true
          }, instance.refresh)
        }} />
      </View>
    )}
  </Stage>
</Stager>
```

`StageButtons`

The internal implementation of the StageButtons are merely for a quick prototype standpoint (to get the stage going),
and you should style if using your own. It doesn't matter where you put them, they will always be below the current
active stage. Notice that you CAN set the style to use `position: absolute` and place it anywhere in the stage.

```tsx
<Stager>
  <StageButtons>
    {({ context }) => (
      <View>
        <Button title="<" onPress={context.prev} />
        <Button title=">" onPress={context.next} />
      </View>
    )}
  </StageButtons>
</Stager>
```

`StageProgress`

The same thing with `StageButtons`, it's just an ugly placeholder to show functionality. Replace it with your own

```tsx
<Stager>
  <StageProgress>
    {({ context }) => (
      <View key="progress" style={styles.progressView}>
        <View  style={styles.progressOutterFlex}>
          <View style={styles.progressFlex}>
            {context.state.stages.map((stage, index) => (
                <View key={index} style={[
                  styles.progressIndicator,
                  {
                    flex: (1 / context.state.stages.length) / 2,
                  },
                  {
                    backgroundColor: context.state.currentStage && context.state.stages.indexOf(stage) <= context.state.stages.indexOf(context.state.currentStage) ? 'blue' : 'gray'
                  }
                 ]} />
              )
            )}
          </View>
          <View style={styles.progressPad} />
        </View>
      </View>
    )}
  </StageProgress>
</Stager>
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