# react.force.datacontainer: Data Components for React Native

DataContainer components are designed to simplify Salesforce REST API usage with React Native apps.
Developers can retrieve data with Salesforce REST API using declarative JSX markup.


### Attention: This is an experimental project published under ForceDotComLabs: 

1. work in progress
2. we need your feedback

## Sample code:

Import statement:

```jsx
import { Sobj } from 'react.force.datacontainer';
```

Sobj component JSX code:

```jsx
<Sobj id={accountId} type='Account'>
<YourComponent />
</Sobj>
```


## Setup

1. add to an existing React Native project:

  ```

  npm install https://github.com/ForceDotComLabs/react.force.datacontainer.git --save

  ```
## Components:
1. SobjContainer
2. ScrollRefresh
3. List
4. SearchQueryList
5. RelevantItems
