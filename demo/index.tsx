import React, { useRef } from 'react'
import ReactDOM from 'react-dom/client'
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
import { EmbeddedEditor } from '../src/components/EmbeddedEditor'
import { useEmbeddedEditorMessage, AgorAppMessage } from '../src/hooks/useEmbeddedEditorMessage'

export const EmbeddedTest = () => {
  const ref = useRef<HTMLIFrameElement | null>(null)
  const publicKey = '0x6b175474e89094c44da98b954eedeac495271d0f'
  const { setIdentity } = useEmbeddedEditorMessage(
    async (message: AgorAppMessage) => {
      switch (message.type) {
        case 'ready':
          console.log(`AgorApp IDE is ready`)
          setIdentity('metamask', publicKey)
          break
        case 'sign-request':
          console.log(`AgorApp IDE requires sign-request: `, message)
          break
      }
    },
    { ref },
  )
  return (
    <EmbeddedEditor
      ref={ref}
      aspectRatio={'4:3'}
      courseSlug='introduction-to-solidity'
      lessonSlug={'01-contract-declaration'}
      style={{ border: '1px solid #fff', borderRadius: '15px' }}
    />
  )
}

root.render(
  <React.StrictMode>
    <EmbeddedTest />
  </React.StrictMode>,
)
