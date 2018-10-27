'use strict'

import React from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  InteractionManager,
  StyleSheet,
  Button,
  ViewStyle,
  Dimensions
} from 'react-native'
import * as PropTypes from 'prop-types'

export interface StagePassContext {
  context: Stager;
}

export interface StagePassProps extends StagePassContext {
  instance: Stage;
}

export interface StagePassPropsChild<Props> {
  children: (props: Props) => React.ReactNode;
}

export interface StageProps extends StagePassPropsChild<StagePassProps> {
  key: string;
  maxHeight?: () => number;
  continue?: () => boolean;
  loaded?: (cb: () => void) => void;
  noPrevious?: boolean;
}

export interface Context {
  fn: Stager;
}

export interface Styles {
  stageContainer: ViewStyle;
  scrollview: ViewStyle;
  progressView: ViewStyle;
  progressFlex: ViewStyle;
  progressOutterFlex: ViewStyle;
  progressIndicator: ViewStyle;
  progressPad: ViewStyle;
  scrollviewContainer: ViewStyle;
  prevBtn: ViewStyle;
  prevNext: ViewStyle;
  prevNextFlex: ViewStyle;
}

export const styles = StyleSheet.create<Styles>({
  stageContainer: {
    top: 0,
    left: 0,
    bottom: 0,
    maxHeight: Dimensions.get('window').height - 50,
    right: 0
  },
  prevNextFlex: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  progressOutterFlex: {
    flex: 1,
    flexDirection: 'row',
    height: 3,
    marginBottom: 15
  },
  progressFlex: {
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 2,
    alignItems: 'flex-start'
  },
  progressIndicator: {
    marginRight: 4,
    height: 2,
    borderRadius: 10,
    padding: 2,
  },
  progressPad: {
    flex: 0.3
  },
  progressView: {
    height: 3,
  },
  scrollview: {
    marginTop: 20
  },
  prevBtn: {
    marginRight: 3,
    flex: 0.15
  },
  prevNext: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 40
  },
  scrollviewContainer: {
    paddingBottom: 20
  }
})

export class Stage extends React.Component<StageProps, never> {
  static contextTypes: Context = {
    fn: PropTypes.any as any
  }

  constructor(props: any, context: any) {
    super(props, context)
  }

  context!: Context;

  refresh = async () => {
    if (this.props.continue) {
      return this.context.fn.canContinue(this.props.continue())
    }
  }

  async componentDidMount() {
    if (this.props.loaded) {
      this.props.loaded(() => {
        InteractionManager.runAfterInteractions(() => {
          this.refresh()
        })
      })
    }

    await this.context.fn.noPrevious(!!this.props.noPrevious)
    await this.refresh()
  }

  shouldComponentUpdate(nextProps: StageProps, nextState: never, nextContext: Context) {
    return false
  }

  passProps: StagePassProps = {
    instance: this,
    context: this.context.fn
  }

  render() {
    const { children } = this.props

    return (
      <View>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={styles.scrollviewContainer}
          style={[styles.scrollview, this.props.maxHeight ? { maxHeight: this.props.maxHeight() } : {}]}
          >
          {children(this.passProps)}
        </ScrollView>
      </View>
      )
  }
}

export interface StageConfig extends StagePassPropsChild<StagePassContext> {

}

export class StageButtons extends React.Component<StageConfig> {
  static contextTypes: Context = {
    fn: PropTypes.any as any
  }

  context!: Context;

  passProps: StagePassContext = {
    context: this.context.fn
  }

  render(): any {
    return this.props.children(this.passProps)
  }
}

export class StageProgress extends React.Component<StageConfig> {
  static contextTypes: Context = {
    fn: PropTypes.any as any
  }
 
  context!: Context;

  passProps: StagePassContext = {
    context: this.context.fn
  }

  render(): any {
    return this.props.children(this.passProps)
  }
}

export interface StagerState {
  currentStage: string | null;
  stage: any;
  hasProgress: StageProgress | null;
  hasButtons: StageButtons | null;
  stages: string[];
  stageState: {
    noPrevious: boolean;
    canContinue: boolean | null;
  };
  time: number;
}

export interface StagerProps {
  onChange?: (stage: string, direction: number) => void;
  style?: StyleProps<ViewStyle>;
}

export class Stager extends React.Component<StagerProps, StagerState> {
  static childContextTypes: Context = {
    fn: PropTypes.any as any
  }

  constructor(props: any, context: any) {
    super(props, context)

    this.state = {
      currentStage: null,
      stages: [],
      stage: null,
      hasButtons: null,
      hasProgress: null,
      stageState: {
        noPrevious: false,
        canContinue: null
      },
      time: Date.now()
    }
  }

  next = async () => {
    const next = this.nextStage()

    if (next) {
      return this.setStage(next, 1)
    }
  }

  prev = async () => {
    const prev = this.prevStage()

    if (prev) {
      return this.setStage(prev, -1)
    }
  }

  setStage = async (stage: string, direction: number) => {
    return new Promise<void>((resolve) => {
      this.setState({
        currentStage: stage,
        stageState: {
          noPrevious: false,
          canContinue: null
        },
        stage: this.getStage(stage)
      }, () => {
        if (this.props.onChange && this.state.currentStage) {
          this.props.onChange(this.state.currentStage, direction || 0)
        }

        resolve()
      })
    })
  }

  reset = () => {
    return this.setStage(this.state.stages[0], 0)
  }

  shouldComponentUpdate(nextProps: StagerProps, nextState: StagerState) {
    return this.state.stages !== nextState.stages ||
           this.state.stage !== nextState.stage ||
           this.state.hasButtons !== nextState.hasButtons ||
           this.state.hasProgress !== nextState.hasProgress ||
           this.state.time !== nextState.time ||
           this.state.stageState.canContinue !== nextState.stageState.canContinue ||
           this.state.stageState.noPrevious !== nextState.stageState.noPrevious ||
           this.props.onChange !== nextProps.onChange ||
           this.state.currentStage !== nextState.currentStage
  }

  canContinue = async (state: boolean) => {
    return new Promise<void>((resolve) => {
      this.setState({
        stageState: {
          ...this.state.stageState,
          canContinue: state
        }
      }, resolve)
    })
  }

  noPrevious = async (state: boolean) => {
    return new Promise<void>((resolve) => {
      this.setState({
        stageState: {
          ...this.state.stageState,
          noPrevious: state
        }
      }, resolve)
    })
  }

  getChildContext(): Context {
    return {
      fn: this
    }
  }

  notify = async () => {
    return new Promise<void>((resolve) => {
      this.setState({
        time: Date.now()
      }, resolve)
    })
  }

  has = (type: 'next' | 'prev') => {
    if (this.state.currentStage) {
      if (type === 'next') {
        return this.state.stages.indexOf(this.state.currentStage) + 1 < this.state.stages.length
      } else if (type === 'prev') {
        return this.state.stages.indexOf(this.state.currentStage) - 1 >= 0
      }
    }

    return false
  }

  getStage = (stage: string) => {
    return React.Children.map(this.props.children, (child) => {
      return (child as any)['key'] === stage ? child : null
    }).filter((s) => s)
  }

  nextStage = () => {
    if (this.state.currentStage) {
      return this.state.stages[this.state.stages.indexOf(this.state.currentStage) + 1 % this.state.stages.length]
    }

    return null
  }

  currentStage = () => {
    return this.state.currentStage
  }

  prevStage = () => {
    if (this.state.currentStage) {
      return this.state.stages[this.state.stages.indexOf(this.state.currentStage) - 1 % this.state.stages.length]
    }

    return null
  }

  gatherButtonsAndProgress = (cb?: () => void) => {
    let hasButtons: StageButtons | null = null
    let hasProgress: StageProgress | null = null

    React.Children.forEach(this.props.children, (child) => {
      const childType: any = (child as any)['type']

      if (childType === StageProgress) {
        hasProgress = child as any
      } else if (childType === StageButtons) {
        hasButtons = child as any
      }
    })

    this.setState({
      hasButtons,
      hasProgress
    }, cb)
  }

  gatherStages = (cb?: () => void) => {
    const stagesNames: string[] = []

    React.Children.forEach(this.props.children, (child) => {
      const childType: any = (child as any)['type']

      if (childType === Stage) {
        stagesNames.push((child as any)['key'])
      }
    })

    if (!stagesNames.length) {
      throw new Error('No Stage')
    }

    this.setState({
      stages: stagesNames,
    }, cb)
  }

  componentDidMount() {
    this.gatherStages(() => {
      this.setStage(this.state.stages[0], 0).then(() => {
        this.gatherButtonsAndProgress()
      })
    })
  }

  progress = () => {
    return (
      <View key="progress" style={styles.progressView}>
        <View  style={styles.progressOutterFlex}>
          <View style={styles.progressFlex}>
            {this.state.stages.map((stage, index) => {
              return (
                <View key={index} style={[
                  styles.progressIndicator,
                  {
                    flex: (1 / this.state.stages.length) / 2,
                  },
                  {
                    backgroundColor: this.state.currentStage && this.state.stages.indexOf(stage) <= this.state.stages.indexOf(this.state.currentStage) ? 'blue' : 'gray'
                  }
                 ]} />
              )
            })}
          </View>
          <View style={styles.progressPad} />
        </View>
      </View>
    )
  }

  buttons = () => {
    return (
      <View key="prevNext" style={styles.prevNext}>
        <View key="prevNextButtons" style={styles.prevNextFlex}>
          {
            !this.state.stageState.noPrevious && this.has('prev') ? (<View key="prevButton" style={styles.prevBtn}>
              <Button onPress={this.prev} title="Prev" />
            </View>) : null
          }
          {
            this.state.stageState.canContinue != null ? (<View key="nextButton" style={{ flex: !this.has('prev') ? 1 : 0.85 }}>
              <Button disabled={!this.state.stageState.canContinue} onPress={this.next} title="Next" />
            </View>) : null
          }
        </View>
      </View>
    )
  }

  render(){
    let styleContainer = (this.props.style)?this.props.style:{} 
    return (
      <KeyboardAvoidingView behavior="position" style={[styles.stageContainer,styleContainer]} keyboardVerticalOffset={-15}>
        {this.state.hasProgress ? this.state.hasProgress : this.progress()}
        {this.state.time && this.state.stage}
        {this.state.hasButtons ? this.state.hasButtons : this.buttons()}
      </KeyboardAvoidingView>
    )
  }
}

export default Stager
