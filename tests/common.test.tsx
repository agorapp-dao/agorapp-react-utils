import * as React from 'react'
import { render } from '@testing-library/react'

import 'jest-canvas-mock'

import { EmbeddedEditor } from '../src/components/EmbeddedEditor'

describe('Common render', () => {
  it('renders without crashing', () => {
    render(<EmbeddedEditor />)
  })
})
