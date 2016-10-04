# RelevantItems

RelevantItems compnent uses [Relevant Items](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_relevant_items.htm) REST API call and shares result via `context.dataSource`


## Usage:

Import statement:

```jsx
import { RelevantItems } from 'react.force.datacontainer';
```

RelevantItems component JSX code:

```jsx
    <RelevantItems
      type='Property__c'
      style={styles.container}>
      <YourListComponent />
    </RelevantItems>
```
