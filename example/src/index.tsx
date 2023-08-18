import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { useRef } from 'react'
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
import { EmbeddedEditor, useEmbeddedEditorMessage, AgorAppMessage } from 'agorapp-react-utils-test'

export const EmbeddedTest = () => {
  const ref = useRef<HTMLIFrameElement | null>(null)
  const publicKey = 'PUBLIC_KEY_OF_THE_USER'
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
      courseSlug={'solidity'}
      lessonSlug={'optimized-array-sum'}
      style={{ border: '1px solid #fff', borderRadius: '15px' }}
    />
  )
}

root.render(
  <React.StrictMode>
    <EmbeddedTest />
  </React.StrictMode>,
)
