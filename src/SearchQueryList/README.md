# SearchQueryList

SearchQueryList makes simple SOSL query and shares result with child components via `context.datasource`

See [Dreamhouse App](https://github.com/ForceDotComLabs/dreamhouse-mobile-react) for [sample code](https://github.com/ForceDotComLabs/dreamhouse-mobile-react/blob/master/js/app/PropertyList/index.js)

## Usage:

Import statement:

```jsx
import { SearchQueryList } from 'react.force.datacontainer';
```

SearchQueryList component JSX code:

```jsx
    <SearchQueryList
      type='Property__c'
      searchTerm={'Boston'}
      style={styles.container}>
      <YourListComponent />
    </SearchQueryList>
```
