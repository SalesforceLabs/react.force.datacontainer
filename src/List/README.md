# ListContainer

ListContainer makes simple SOQL queries and updates child components.

See [Dreamhouse App](https://github.com/ForceDotComLabs/dreamhouse-mobile-react) for [sample code](https://github.com/ForceDotComLabs/dreamhouse-mobile-react/blob/master/js/app/BrokerList/index.js)

## Usage:

Import statement:

```jsx
import { ListContainer } from 'react.force.datacontainer';
```

ListContainer component JSX code:

```jsx
    <ListContainer 
      type="Property__c"
      where="City__c = 'Boston'"
      limit={100}
      style={styles.container}>
      <YourListComponent />
    </ListContainer>
```
