'use strict';

import React from 'react';

import ReactNative, {
  Text,
  View
} from 'react-native';

import shallowEqual from 'shallowequal';
import findIndex from 'lodash.findindex';

import {
  chatterQuery,
  getByChatterUserId
} from 'react.force.data';

const subscribers = [];

const subscribe = (comp)=>{
  subscribers.push(comp)
};

const unsubscribe = (comp) => {
  const i = subscribers.indexOf(comp);
  if(i != -1) {
    subscribers.splice(i, 1);
  }
};

const notify = (ids, records) => {
  if(subscribers && subscribers.length){
    subscribers.forEach((subscriber)=>{
      if(subscriber && subscriber.props && subscriber.props.id){
        const searchId = subscriber.props.id;
        const index = findIndex(ids, (id) => {
          return id.indexOf(searchId)>-1;
        });
        if(index>-1){
          const record = records[index];
          subscriber.updateChatterData(record);
        }
      }
    });
  }
};

chatterQuery.addListener(notify);


module.exports = React.createClass ({
  getDefaultProps(){
    return {
      type:null,
      id:null,
      refreshDate:new Date(),
      update:true,
      style:{}
    };
  },
  childContextTypes: {
    chatterData: React.PropTypes.object,
    doRefresh: React.PropTypes.func
  },
  getInitialState(){
    return {
      chatterData:this.props.chatterData?this.props.chatterData:{Name:' ',attributes:{}},
      loading:false
    };
  },
  getChildContext() {
    return {
      chatterData: this.state.chatterData,
      doRefresh: this.handleRefresh
    };
  },
  componentDidMount(){
    this.getInfo();
    subscribe(this);
  },
  componentWillUnmount(){
    unsubscribe(this);
  },
  handleRefresh(){
    console.log('>>> REFRESH !!!');
    this.getInfo();
  },
  updateChatterData(chatterData){
    this.setState({
      chatterData:chatterData,
    });
  },
  handleDataLoad(){
    if(this.props.onData){
      this.props.onData({
        chatterData:this.state.chatterData
      });
    }
  },
  getInfo() {
    this.setState({loading:true});
    if(!this.props.type || !this.props.id){
      return;
    }
    getByChatterUserId(this.props.id)
      .then((opts)=>{
        if(opts.cachedChatterData){
          this.setState({
            chatterData: opts.cachedChatterData
          });
        }
      });
  },

  render() {
    return (
      <View style={this.props.style}>
        {this.props.children}
      </View>
    )
  },
  componentWillReceiveProps(newProps){
    if(this.props.refreshDate !== newProps.refreshDate){
      this.getInfo();
    }
  },
  shouldComponentUpdate(nextProps, nextState){
    if(!this.props.update){
      return false;
    }
    if(this.props.id !== nextProps.id){
      return true;
    }
    if(!shallowEqual(this.state.chatterData, nextState.chatterData)){
      return true;
    }
    return false;
  }
});
