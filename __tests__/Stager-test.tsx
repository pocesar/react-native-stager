/// <reference types="jest" />

'use strict'

import React from 'react'
import renderer from 'react-test-renderer'
import { StyleSheet, Text, Button } from 'react-native'
//import { shallow } from 'enzyme'
import Stager, { Stage, StageProgress, StageButtons } from '../lib'

describe('<Stager />', () => {
  test('throws when no stage', () => {
    expect(() => {
      renderer.create(
        <Stager />
      )
    }).toThrow('No Stage')
  })

  test('renders correctly', () => {
    const simple = renderer.create(
      <Stager>
        <Stage key="1">
          {() => null}
        </Stage>
      </Stager>
    )

    expect(simple.toJSON()).toMatchSnapshot()
  })

  test('goes to next and prev stage', async () => {
    const two = renderer.create(
      <Stager>
        <Text>{'ignored'}</Text>

        <Stage key="1">
          {() => (
            <Text>{'hello'}</Text>
          )}
        </Stage>
        <Stage key="2">
          {() => (
            <Text>{'world'}</Text>
          )}
        </Stage>
      </Stager>
    )

    const stager: Stager = two.getInstance() as any
    expect(stager.state.stages).toEqual(['1', '2'])
    expect(stager.state.currentStage).toEqual('1')
    expect(two.toJSON()).toMatchSnapshot()

    await stager.next()

    expect(stager.state.currentStage).toEqual('2')
    expect(two.toJSON()).toThrowErrorMatchingSnapshot()

    await stager.prev()

    expect(two.toJSON()).toMatchSnapshot()
    expect(stager.state.currentStage).toEqual('1')
    const lastTime = stager.state.time

    await stager.notify()

    expect(two.toJSON()).toMatchSnapshot()
    expect(stager.state.time).toBeGreaterThan(lastTime)
  })

  test('instance props', async (done) => {
    let _ref: any

    expect.assertions(2)

    const stager = renderer.create(
      <Stager>
        <Stage key="1" ref={(r) => _ref = r}>
          {({ instance }) => {
            setTimeout(() => {
              expect(_ref).toBe(instance)
              done()
            })

            return (
              <Text>{'hello'}</Text>
            )
          }}
        </Stage>
        <Stage key="2">
          {() => (
            <Text>{'world'}</Text>
          )}
        </Stage>
      </Stager>
    )

    expect(stager.toJSON()).toMatchSnapshot()
  })

  test('loaded', async (done) => {
    let loaded = 0
    expect.assertions(4)

    const stager = renderer.create(
      <Stager>
        <Stage key="1" loaded={() => loaded++}>
          {() => (null)}
        </Stage>

        <Stage key="2" noPrevious loaded={(cb) => { loaded++;  }}>
          {() => (null)}
        </Stage>

        <Stage key="3" loaded={(cb) => { loaded++; cb(); done(); }}>
          {() => (null)}
        </Stage>
      </Stager>
    )

    expect(stager.toJSON()).toMatchSnapshot()

    await (stager.getInstance() as any as Stager).next()

    expect((stager.getInstance() as any as Stager).state.stageState.noPrevious).toBe(true)
    expect(stager.toJSON()).toThrowErrorMatchingSnapshot()
    expect(loaded).toBe(2)

    await (stager.getInstance() as any as Stager).next()
  })

  test('continue', async (done) => {
    const stager = renderer.create(
      <Stager>
        <Stage key="stuff1" continue={() => false}>
          {() => null}
        </Stage>

        <Stage key="stuff2">
          {() => null}
        </Stage>
      </Stager>
    )

    const _stager: Stager = stager.getInstance() as any

    setTimeout(() => {
      expect(_stager.state.stageState.canContinue).toBe(false)
      done()
    })
  })

  test('onChange', async () => {
    let changed = 0

    expect.assertions(5)

    const stager = renderer.create(
      <Stager onChange={() => changed++}>
        <Stage key="1">
          {() => null}
        </Stage>
        <Stage key="2">
          {() => null}
        </Stage>
        <Stage key="3">
          {() => null}
        </Stage>
      </Stager>
    )
    const s: Stager = stager.getInstance() as any

    expect(changed).toBe(1)

    await s.next()
    expect(changed).toBe(2)

    await s.next()
    expect(changed).toBe(3)

    await s.reset()
    expect(changed).toBe(4)
    expect(s.state.currentStage).toBe('1')
  })

  test('progress and buttons', async (done) => {
    expect.assertions(8)

    const stager = renderer.create(
      <Stager>
        <StageProgress>
          {({ context }) => {
            expect(context.currentStage()).toMatch(/(1|2)/)
            return <Text>{context.currentStage()}</Text>
          }}
        </StageProgress>

        <Stage key="1">
          {() => null}
        </Stage>

        <Stage key="2">
          {() => null}
        </Stage>

        <StageButtons>
          {({ context }) => {
            if (context.currentStage() === '1') {
              expect(context.has('next')).toBe(true)
              expect(context.has('prev')).toBe(false)
            } else {
              expect(context.has('next')).toBe(false)
              expect(context.has('prev')).toBe(true)
            }
            return <Text>{`${context.has('next')}`}</Text>
          }}
        </StageButtons>
      </Stager>
    )

    await (stager.getInstance() as any as Stager).notify()

    expect(stager.toJSON()).toMatchSnapshot()

    await (stager.getInstance() as any as Stager).next()

    expect(stager.toJSON()).toThrowErrorMatchingSnapshot()

    setTimeout(() => {
      done()
    })
  })

})