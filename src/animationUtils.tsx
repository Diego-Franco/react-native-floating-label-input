import  Animated,{
    timing as retiming,
    Clock,
    Value,
    set,
    startClock,
    clockRunning,
    stopClock,
    cond,
    block,
    not,
} from 'react-native-reanimated';


interface AnimationState {
    finished: Animated.Value<number>,
    position: Animated.Value<number>,
    time: Animated.Value<number>,
    frameTime: Animated.Value<number>,
}

interface TimingParams {
    clock: Clock,
    animation: Animated.Value<number>,
    easing: Animated.EasingFunction,
    duration: Value<number>, 
    from: number,
    to: number,
}

interface animationParams {
    fn: (clock: Clock, state: AnimationState, config: TimingConfig) => void,
    clock: Clock,
    state: AnimationState,
    config: TimingConfig,
    from: number;
}

interface TimingConfig {
    toValue: Value<number>;
    duration: Value<number>;
    easing: Animated.EasingFunction;
}

export const timing = (params: TimingParams) => {
    const { clock, easing, duration, from, to } = { ...params };

    const state: AnimationState = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0)
    };

    const config = {
        toValue: new Value(0),
        duration,
        easing
    };

    return block([
        onInit(clock, [set(config.toValue, to), set(state.frameTime, 0)]),
        animate({
            fn: retiming,
            clock,
            state,
            config,
            from
        })
    ]);
};

export const animate = ({
    fn,
    clock,
    state,
    config,
    from
}: animationParams) =>
    block([
        onInit(clock, [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, from),
            startClock(clock)
        ]),
        fn(clock, state, config),
        cond(state.finished, stopClock(clock)),
        state.position
    ]);

export const onInit = (clock: Clock, sequence: any) => cond(not(clockRunning(clock)), sequence);
