# SobjContainer

Retrieves Sobject data and caches it to SmartStore and updates child components.

See [Dreamhouse App](https://github.com/ForceDotComLabs/dreamhouse-mobile-react) for [sample code](https://github.com/ForceDotComLabs/dreamhouse-mobile-react/blob/master/js/app/MyProfile/index.js)

## Usage:

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

