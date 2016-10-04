# Data Components for React Native

DataContainer components are designed to simplify Salesforce REST API usage with React Native apps.
Developers can retrieve data with Salesforce REST API using declarative JSX markup.

See [Dreamhouse App](https://github.com/ForceDotComLabs/dreamhouse-mobile-react) for [sample code](https://github.com/ForceDotComLabs/dreamhouse-mobile-react/blob/master/js/app/)


### Attention: This is an experimental project published under ForceDotComLabs: 

1. work in progress
2. we need your feedback


## Usage:

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

add to an existing React Native project:

```

  npm install https://github.com/ForceDotComLabs/react.force.datacontainer.git --save

```

## Components:
1. [SobjContainer](/src/SobjContainer)
2. [ScrollRefresh](/src/ScrollRefresh)
3. [ListContainer](/src/List)
4. [SearchQueryList](/src/SearchQueryList)
5. [RelevantItems](/src/RelevantItems)
