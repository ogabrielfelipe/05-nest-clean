import { Slug } from './slug'

describe('Normalize a Text to Slug', () => {
  it('should be able to create a new slug from text', () => {
    const slug = Slug.createFormText('Example question title')

    expect(slug.value).toEqual('example-question-title')
  })
})
