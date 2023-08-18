import React, { forwardRef, useId, useMemo } from 'react'
import { AGORAPP_URL } from '../types/config'

export interface IEmbeddedEditor {
  aspectRatio?: '16:9' | '4:3' | '3:2' | '1:1'
  brand?: 'agorapp' | 'rareSkills'
  hideTheory?: boolean
  courseSlug?: string
  lessonSlug?: string
  style?: React.CSSProperties
  onMessage?: (message: any) => void
}

export const EmbeddedEditor = forwardRef<HTMLIFrameElement, IEmbeddedEditor>(function EmbeddedEditor(
  { aspectRatio, brand, hideTheory, courseSlug, lessonSlug, style },
  ref?,
) {
  const id = useId()

  const iframeCss: React.CSSProperties = aspectRatio
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }
    : {}

  const containerCss = useMemo(() => {
    switch (aspectRatio) {
      case '16:9':
        return { paddingTop: '56.25%', height: 'auto' }
      case '4:3':
        return { paddingTop: '75%', height: 'auto' }
      case '3:2':
        return { paddingTop: '66.66%', height: 'auto' }
      case '1:1':
        return { paddingTop: '100%', height: 'auto' }
    }
    return {}
  }, [aspectRatio])

  const iframeParams = useMemo(() => {
    const p = new URLSearchParams()
    if (brand) {
      p.append('brand', brand)
    }
    if (hideTheory) {
      p.append('hideTheory', '1')
    }
    return p
  }, [brand, hideTheory])

  const src = `${AGORAPP_URL}/ide-embed/${courseSlug}/${lessonSlug}?${iframeParams.toString()}&id=${id}`

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        ...containerCss,
        ...style,
      }}
    >
      <iframe
        title='AgorApp Web3 IDE'
        ref={ref}
        src={src}
        allowFullScreen
        id={id}
        style={{
          width: '100%',
          height: '100%',
          minWidth: '300px',
          minHeight: '300px',
          border: 'none',
          ...iframeCss,
        }}
      />
    </div>
  )
})
