# ScrollRefresh

Used with SobjContainer component.
Wraps child components with scroll component and on pull-to-refresh makes parent SobjContainer to refetch data from server 

See [Dreamhouse App](https://github.com/ForceDotComLabs/dreamhouse-mobile-react) for [sample code](https://github.com/ForceDotComLabs/dreamhouse-mobile-react/blob/master/js/app/MyProfile/index.js)

## Usage:

Import statement:

```jsx
import { SobjContainer, ScrollRefresh } from 'react.force.datacontainer';
```

SobjContainer component JSX code:

```jsx
<SobjContainer id={accountId} type='Account'>
<ScrollRefresh>
<YourComponent />
</ScrollRefresh>
</SobjContainer>
```

