/// <reference types="react" />
import React from 'react';
import { ViewStyle } from 'react-native';
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
export declare const styles: {
    stageContainer: number & {
        __registeredStyleBrand: ViewStyle;
    };
    scrollview: number & {
        __registeredStyleBrand: ViewStyle;
    };
    progressView: number & {
        __registeredStyleBrand: ViewStyle;
    };
    progressFlex: number & {
        __registeredStyleBrand: ViewStyle;
    };
    progressOutterFlex: number & {
        __registeredStyleBrand: ViewStyle;
    };
    progressIndicator: number & {
        __registeredStyleBrand: ViewStyle;
    };
    progressPad: number & {
        __registeredStyleBrand: ViewStyle;
    };
    scrollviewContainer: number & {
        __registeredStyleBrand: ViewStyle;
    };
    prevBtn: number & {
        __registeredStyleBrand: ViewStyle;
    };
    prevNext: number & {
        __registeredStyleBrand: ViewStyle;
    };
    prevNextFlex: number & {
        __registeredStyleBrand: ViewStyle;
    };
};
export declare class Stage extends React.Component<StageProps, never> {
    static contextTypes: Context;
    constructor(props: any, context: any);
    context: Context;
    refresh: () => Promise<void>;
    componentDidMount(): Promise<void>;
    shouldComponentUpdate(nextProps: StageProps, nextState: never, nextContext: Context): boolean;
    passProps: StagePassProps;
    render(): JSX.Element;
}
export interface StageConfig extends StagePassPropsChild<StagePassContext> {
}
export declare class StageButtons extends React.Component<StageConfig> {
    static contextTypes: Context;
    context: Context;
    passProps: StagePassContext;
    render(): any;
}
export declare class StageProgress extends React.Component<StageConfig> {
    static contextTypes: Context;
    context: Context;
    passProps: StagePassContext;
    render(): any;
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
}
export declare class Stager extends React.Component<StagerProps, StagerState> {
    static childContextTypes: Context;
    constructor(props: any, context: any);
    next: () => Promise<void>;
    prev: () => Promise<void>;
    setStage: (stage: string, direction: number) => Promise<void>;
    reset: () => Promise<void>;
    shouldComponentUpdate(nextProps: StagerProps, nextState: StagerState): boolean;
    canContinue: (state: boolean) => Promise<void>;
    noPrevious: (state: boolean) => Promise<void>;
    getChildContext(): Context;
    notify: () => Promise<void>;
    has: (type: "next" | "prev") => boolean;
    getStage: (stage: string) => (string | number | React.ReactElement<any> | null)[];
    nextStage: () => string | null;
    currentStage: () => string | null;
    prevStage: () => string | null;
    gatherButtonsAndProgress: (cb?: (() => void) | undefined) => void;
    gatherStages: (cb?: (() => void) | undefined) => void;
    componentDidMount(): void;
    progress: () => JSX.Element;
    buttons: () => JSX.Element;
    render(): JSX.Element;
}
export default Stager;
