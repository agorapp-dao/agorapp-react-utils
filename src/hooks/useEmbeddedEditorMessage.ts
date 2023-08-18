import { useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { IframeMessageOptions, MessageHandler, useIframeMessage, MessageDispatcher } from './useIframeMessage'

export interface AgorAppMessageLog {
  message: AgorAppMessage
  time: number
  key: string
  direction: 'in' | 'out'
}

export interface AgorAppMessage {
  type: 'set-identity' | 'sign-request' | 'sign-response' | 'ready'
  payload: any
  signature?: string
}

export function useEmbeddedEditorMessage(
  handleMessage?: MessageHandler<AgorAppMessage>,
  options?: IframeMessageOptions,
) {
  const [promises, setPromises] = useState<Record<string, any>[]>([])
  const [loggerList, setLoggerList] = useState<AgorAppMessageLog[]>([])
  const logEntry = useCallback((message: AgorAppMessage, direction: 'in' | 'out') => {
    setLoggerList((prev) => [{ message, time: Date.now(), direction: direction, key: uuidv4() }, ...prev])
  }, [])
  const handleInboundMessage = (message: AgorAppMessage, dispatcher: MessageDispatcher<AgorAppMessage>) => {
    logEntry(message, 'in')
    const index = promises.findIndex((p) => message.payload && p.uuid === JSON.parse(message.payload).uuid)
    if (index > -1) {
      promises[index].resolve(message)
      setPromises((prev) => prev.filter((_, i) => i !== index))
    }
    if (handleMessage) {
      return handleMessage(message, dispatcher)
    }
  }
  const [dispatch] = useIframeMessage<AgorAppMessage>(handleInboundMessage, options)
  const handleOutboundMessage = useCallback(
    (message: AgorAppMessage) => {
      dispatch(message)
      logEntry(message, 'out')
    },
    [dispatch, logEntry],
  )
  const setIdentity = (type: 'metamask', publicKey: string, signature?: string) => {
    if (!publicKey) return
    const uuid = uuidv4()
    handleOutboundMessage({
      type: 'set-identity',
      payload: JSON.stringify({
        action: 'set-identity',
        type,
        value: publicKey,
        uuid,
      }),
      signature,
    })
    return Promise
  }
  const signResponse = (payload: AgorAppMessage, signature: string) => {
    handleOutboundMessage({
      type: 'sign-response',
      payload,
      signature,
    })
  }
  /** --------------------------------------------------------------------------------------------------------------- */
  /** This is part only for AgorApp IDE, will not be exposed as public ---------------------------------------------- */
  /** --------------------------------------------------------------------------------------------------------------- */
  const submitSolution = (type: 'metamask', publicKey: string, solution: string) => {
    const uuid = uuidv4()
    handleOutboundMessage({
      type: 'sign-request',
      payload: JSON.stringify({
        action: 'submit-solution',
        solution,
        identity: {
          type,
          value: publicKey,
        },
        uuid,
      }),
    })
    return new Promise<AgorAppMessage>((resolve, reject) => {
      setPromises((prev) => [...prev, { uuid, resolve, reject }])
    })
  }
  const signIdentity = (type: 'metamask', publicKey: string): Promise<any> => {
    const uuid = uuidv4()
    handleOutboundMessage({
      type: 'sign-request',
      payload: JSON.stringify({
        action: 'sign-identity',
        identity: {
          type,
          value: publicKey,
        },
        uuid,
      }),
    })
    return new Promise<AgorAppMessage>((resolve, reject) => {
      setPromises((prev) => [...prev, { uuid, resolve, reject }])
    })
  }
  const sendReady = useCallback(() => {
    handleOutboundMessage({
      type: 'ready',
      payload: JSON.stringify({
        action: 'ready',
      }),
    })
  }, [handleOutboundMessage])
  return {
    setIdentity,
    submitSolution,
    signResponse,
    signIdentity,
    sendReady,
    loggerList,
  }
}
