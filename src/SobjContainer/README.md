# SobjContainer

Retrieves Sobject displayable fields and caches it to SmartStore.
Makes Sobject data available to child components via `context.sobj`

See [Dreamhouse App](https://github.com/ForceDotComLabs/dreamhouse-mobile-react) for [code examples](https://github.com/ForceDotComLabs/dreamhouse-mobile-react/blob/master/js/app/MyProfile/index.js)

## Sample code:

Import statement:

```jsx
import { SobjContainer } from 'react.force.datacontainer';
```

SobjContainer component JSX code:

```jsx
<SobjContainer id={accountId} type='Account'>
<YourComponent />
</SobjContainer>
```
