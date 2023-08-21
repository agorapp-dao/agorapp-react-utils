# AgorApp Web3 IDE Editor

[![NPM version][npm-image]][npm-url]
[![Build][github-build]][github-build-url]
![npm-typescript]
[![License][github-license]][github-license-url]

The AgorApp Web3 IDE Editor can be seamlessly integrated into partner websites with this package.

[**Live Demo**](https://agorapp-dao.github.io/agorapp-react-utils/)

## Installation: 

```bash
pnpm add agorapp-react-utils
```

or

```bash
yarn add agorapp-react-utils
```

## Basic usage:
Add `EmbeddedEditor` to your component:

```tsx
export const YourComponent = () => {
  return (
    <EmbeddedEditor
      aspectRatio={'4:3'}
      courseSlug={'solidity'}
      lessonSlug={'optimized-array-sum'}
    />
  )
}
```

### courseSlug
The `courseSlug` parameter specifies the course that the IDE should open. The value of the parameter is the slug of the course.

### lessonSlug
The `lessonSlug` parameter specifies the lesson that the IDE should open. The value of the parameter is the slug of the lesson.

## Customizing the appearance of the IDE
You can customize the behavior of the IDE by specifying parameters to `<EmbeddeedEditor />`.

```jsx
  <EmbeddedEditor
    ref={ref}
    aspectRatio={'4:3'}
    courseSlug={'solidity'}
    lessonSlug={'optimized-array-sum'}
    brand={'rareSkills'}
    hideTheory={true}
    style={{ border: '1px solid orange', borderRadius: '15px' }}
  />
```

### aspectRatio
Supported values: `16:9`, `4:3`, `3:2`, `1:1`. If no value is specified, the component will adjust to the size of the parent. 

### brand
Supported valued: `agorapp`, `rareSkills`. If no value is specified, the default value is `agorapp`.

### hideTheory
You can hide theory panel by setting `hideTheory` to `true`.

### style
You can customize the appearance of the IDE by specifying the `style` parameter. The style is applied to wrapper of `<iframe />` element.


## Advanced usage - MetaMask integration
AgorApp IDE can be integrated with MetaMask wallet. 

Based on a prior agreement with AgorApp, you can transfer information about your user to the IDE,
in order to match the solution with the user later.

Communication is based on [Window: postMessage() method](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

IDE verify the user by requiring him to sign the messages sent to AgorApp iframe with his MetaMask wallet. 

Sample code to pass the MetaMask towards the IDE.

```tsx
export const YourComponent = () => {
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
          // your code to sign the message
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
    />
  )
}
```

As the first argument of `useEmbeddedEditorMessage` is **Message handler** function. Over this function you will handle the messages sent from the IDE.

Complete code with example of signing the message with MetaMask wallet: [**Live Demo**](https://agorapp-dao.github.io/agorapp-react-utils/)

### Message format

Each `Message` received by **Message handler** will follow this structure:
```json
{
  "type": "<message type>",
  "payload": "<message>",
  "signature": "signature of the message"
}
```

### Message flow

This section describes what the typical interaction between AgorApp and Partner will look like:

1. User goes to the Partner website that embeds AgorApp iframe over <EmbeddedEditor ... /> component.
2. AgoraApp iframe sends a ready `Message` to the Partner window:
```json
{
  "type": "ready"
}
```
3. Partner window creates payload with user identity. Partner window sends the message to the AgoraApp iframe.
> To send the response back to the IDE, the Partner calls the function `setIdentity` function from `useEmbeddedEditorMessage` hook.
```typescript
setIdentity('metamask', '<metamask public key>');
```
4. AgorApp iframe remembers the user identity and will apply it to the messages it wants to verify from Partner. 
5. User submits a solution in the AgorApp iframe.
6. AgoraApp iframe sends a sign request `Message` to the Partner window for signing.
```json
{
  "type": "sign-request",
  "payload": {
    "action": "submit-solution",
    "identity": {
      "type": "metamask",
      "value": "<metamask public key>"
    },
    "solution": "<solution>"
  }
}
```
7. Partner window will sign payload with the MetaMask Wallet and get the `signature` of the message.
> To sign the message with MetaMask wallet, Partner will sign message:
```typescript
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = await provider.getSigner();
const signature = await signer.signMessage("<message>");
```
> To send the response back to the IDE, the Partner calls the function `signResponse` function from `useEmbeddedEditorMessage` hook:
```typescript
signResponse(message.payload, signature);
```
8. This signed message is sent back to the AgorApp iframe. AgoraApp backend verifies the signature, evaluates the 
solution and stores the result in the leaderboard.

### Payload
The `payload` in the examples above is presented as JSON for readability. In reality, payload will be a string. 
The real message will look something like this:
```json
{
  "type": "set-identity",
  "payload": "{\"action\": \"set-identity\", \"type\": \"metamask\", \"value\": \"<metamask public key>\"}",
  "signature": "<signature of the payload>"
}
```

[npm-url]: https://www.npmjs.com/package/agorapp-react-utils
[npm-image]: https://img.shields.io/npm/v/agorapp-react-utils
[github-license]: https://img.shields.io/github/license/agorapp-dao/agorapp-react-utils
[github-license-url]: https://github.com/agorapp-dao/agorapp-react-utils/blob/main/LICENSE
[github-build]: https://github.com/agorapp-dao/agorapp-react-utils/actions/workflows/publish.yml/badge.svg
[github-build-url]: https://github.com/agorapp-dao/agorapp-react-utils/actions/workflows/publish.yml
[npm-typescript]: https://img.shields.io/npm/types/agorapp-react-utils
