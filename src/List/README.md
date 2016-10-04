# ListContainer

Queries data by using Salesforce SOQL REST API.
Shares query result with child components via `context.datasource`

See [Dreamhouse App](https://github.com/ForceDotComLabs/dreamhouse-mobile-react) for [sample code](https://github.com/ForceDotComLabs/dreamhouse-mobile-react/blob/master/js/app/BrokerList/index.js)

## Sample code:

Import statement:

```jsx
import { ListContainer } from 'react.force.datacontainer';
```

ListContainer component JSX code:

```jsx
    <ListContainer 
      type='Broker__c'
      style={styles.container}>
      <YourListComponent />
    </ListContainer>
```
