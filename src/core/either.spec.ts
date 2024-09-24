import { type Either, left, right } from './either'

function doSomething(x: boolean): Either<string, number> {
  if (x) {
    return right(10)
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    return left('error')
  }
}

test('success result', () => {
  const result = doSomething(true)

  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
})

test('error result', () => {
  const result = doSomething(false)

  expect(result.isLeft()).toBe(true)
  expect(result.isRight()).toBe(false)
})
