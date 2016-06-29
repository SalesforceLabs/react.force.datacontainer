'use strict';

import React from 'react';

import ReactNative, {
  Text,
  View
} from 'react-native';

import shallowEqual from 'shallowequal';
import findIndex from 'lodash.findindex';

import {
  getBtLogoByCompanyName,
  btLogoQuery
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
          subscriber.updateBtData(record);
        }
      }
    });
  }
};

btLogoQuery.addListener(notify);


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
    btLogoData: React.PropTypes.object,
    doRefresh: React.PropTypes.func
  },
  getInitialState(){
    return {
      btLogoData:this.props.btLogoData?this.props.btLogoData:{Name:' ',attributes:{}},
      loading:false
    };
  },
  getChildContext() {
    return {
      btLogoData: this.state.btLogoData,
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
  updateBtData(btLogoData){
    this.setState({
      btLogoData:btLogoData,
    });
  },
  handleDataLoad(){
    if(this.props.onData){
      this.props.onData({
        btLogoData:this.state.btLogoData
      });
    }
  },
  getInfo() {
    this.setState({loading:true});
    if(!this.props.id){
      return;
    }
    getBtLogoByCompanyName(this.props.id)
      .then((opts)=>{
        if(opts.cachedBtLogoData){
          this.setState({
            btLogoData: opts.cachedBtLogoData
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
    if(!shallowEqual(this.state.btLogoData, nextState.btLogoData)){
      return true;
    }
    return true;

  }
});
