import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Button,
  Picker,
  Alert,
  TextInput,
  Text,
  View
} from 'react-native';
import Stager, { Stage, StageButtons, StageProgress } from 'react-native-stager'

export default class example extends Component {
  constructor(props) {
    super(props)

    this.state = {
      continue1: false,
      text: '',
      custom: false
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.custom !== nextState.custom
  }

  getType() {
    switch (this.state.custom) {
      case false:
        return (
        <Stager key="vanilla">
          <Stage key="step 1" continue={() => this.state.continue1}>
            {({ context, instance }) => (
              <View>
                <Text>{'This is step 1'}</Text>
                <Button title="Press to be able to continue" onPress={() => {
                    this.setState({
                      continue1: true
                    }, instance.refresh)
                  }} />
              </View>
            )}
          </Stage>

          <Stage
            key="step 2"
            noPrevious
            loaded={(cb) => {
              // reset previous state
              this.setState({
                continue1: false,
                text: ''
              }, cb)
            }}
            continue={() => !!this.state.text}>
            {({ instance, context }) => (
              <View>
                <Text>{`This is step 2, you can't go back, go on`}</Text>
                <TextInput
                  text={this.state.text}
                  onChangeText={(text) => {
                    this.setState({
                      text
                    }, instance.refresh)
                  }}
                  placeholder="Write anything to be able to continue" />
              </View>
            )}
          </Stage>

          <Stage key="step 3">
            {({ context }) => (
              <View>
                <Text>{`Finished`}</Text>
                <Button title="Ok I guess" onPress={context.reset} />
              </View>
            )}
          </Stage>
        </Stager>
        )
      case true:
        return (
          <Stager key="custom">
            <StageButtons>
              {({ context }) => (
                <View>
                  <Button title="<" onPress={context.prev} />
                  <Button title=">" onPress={context.next} />
                </View>
              )}
            </StageButtons>

            <StageProgress>
              {({ context }) => (
                <Text>{`Current stage: ${context.currentStage()}`}</Text>
              )}
            </StageProgress>

            <Stage key="step 1" continue={() => true}>
              {({ context, instance }) => (
                <Text>{'This is step 1'}</Text>
              )}
            </Stage>

            <Stage
              key="step 2" continue={() => true}>
              {({ instance, context }) => (
                <Text>{`This is step 2`}</Text>
              )}
            </Stage>
          </Stager>
        )
    }
  }

  render() {
    return (
      <View>
        <Picker
          selectedValue={this.state.custom}
          onValueChange={(itemValue, itemIndex) => this.setState({ custom: itemValue })}>
          <Picker.Item label="Vanilla" value={false} />
          <Picker.Item label="Custom" value={true} />
        </Picker>
        {this.getType()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});