
'use strict';

import React from 'react';

import ReactNative, {
  Text,
  View,
  ListView
} from 'react-native';

import shallowEqual from 'shallowequal';
import findIndex from 'lodash.findindex';
import {forceClient} from 'react.force';

import {
  reportQuery,
  getByReportId
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

const notify = (id, record) => {
  if(subscribers && subscribers.length){
    subscribers.forEach((subscriber)=>{
      if(subscriber && subscriber.props && subscriber.props.id){
        const searchId = subscriber.props.id;
        /*const index = findIndex(ids, (id) => {
          return id.indexOf(searchId)>-1;
        });*/
        const index = id.indexOf(searchId)>-1;
        if(index>-1){
          //const record = records[index];
          subscriber.updateReportData(record);
        }
      }
    });
  }
};

reportQuery.addListener(notify);

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
    reportData: React.PropTypes.object,
    doRefresh: React.PropTypes.func
  },
  getInitialState(){
    return {
      reportData:this.props.reportData?this.props.reportData:{Name:' ',attributes:{}},
      loading:false
    };
  },
  getChildContext() {
    return {
      reportData: this.state.reportData,
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
  updateReportData(reportData){
    this.setState({
      reportData:reportData,
    });
  },
  handleDataLoad(){
    if(this.props.onData){
      this.props.onData({
        reportData:this.state.reportData
      });
    }
  },
  getInfo() {
    this.setState({loading:true});
    if(!this.props.id){
      return;
    }
    getByReportId(this.props.id)
      .then((opts)=>{
        if(opts.cachedReportData){
          this.setState({
            reportData: opts.cachedReportData
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
    //only refresh reportData every 10 minutes
    if(this.props.refreshDate.getTime() <= newProps.refreshDate.getTime()-600000){
      debugger;
      this.getInfo();
    }
  },
  shouldComponentUpdate(nextProps, nextState){
    //update if change in reportId, entityId, or reportData
    if(!this.props.update){
      return false;
    }
    if(this.props.id !== nextProps.id){
      return true;
    }
    if(this.props.entityId !== nextProps.entityId) {
      return true;
    }
    if(!shallowEqual(this.state.reportData, nextState.reportData)){
      return true;
    }
    return false;
  }
});
