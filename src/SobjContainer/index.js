/*
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the
 * following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

import React, {
  Text,
  View
} from 'react-native';

import shallowEqual from 'shallowequal';
import findIndex from 'lodash.findindex';

import {
  query,
  getByTypeAndId
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

const notify = (ids,sobjs,compactLayout,defaultLayout) => {
  if(subscribers && subscribers.length){
    subscribers.forEach((subscriber)=>{
      if(subscriber && subscriber.props && subscriber.props.id){
        const searchId = subscriber.props.id;
        const index = findIndex(ids, (id) => { 
          return id.indexOf(searchId)>-1;
        });
        if(index>-1){
          const sobj = sobjs[index];
          if(sobj && sobj.attributes && sobj.attributes.type){
            subscriber.updateSobj(sobj,compactLayout,defaultLayout);
          }
        }
      }
    });
  }
};

query.addListener(notify);

module.exports = React.createClass ({
  getDefaultProps(){
    return {
      type:null,
      id:null,
      refreshDate:new Date(),
      update:true
    };
  },
  childContextTypes: {
    sobj: React.PropTypes.object,
    compactLayout: React.PropTypes.object,
    defaultLayout: React.PropTypes.object,
    doRefresh: React.PropTypes.func,
    refreshedDate: React.PropTypes.instanceOf(Date)
  },
  getInitialState(){
    return {
      sobj:this.props.sobj?this.props.sobj:{Name:' ',attributes:{}},
      compactLayout:{},
      defaultLayout:{},
      loading:false,
      refreshedDate: new Date()
    };
  },
  getChildContext() {
    return {
      sobj: this.state.sobj,
      compactLayout:this.state.compactLayout,
      defaultLayout:this.state.defaultLayout,
      doRefresh:this.handleRefresh,
      refreshedDate:this.state.refreshedDate
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
    this.getInfo(true);
  },
  updateSobj(sobj,compactLayout,defaultLayout){
    this.setState({
      sobj:sobj,
      loading:false,
      compactLayout:compactLayout,
      defaultLayout:defaultLayout,
      refreshedDate: new Date()
    });
  },
  handleDataLoad(){
    if(this.props.onData){
      this.props.onData({
        sobj:this.state.sobj,
        compactLayout:this.state.compactLayout
      });
    }
  },
  getInfo(nocache) {
    this.setState({loading:true});
    if(!this.props.type || !this.props.id){
      return;
    }
    getByTypeAndId(this.props.type,this.props.id,nocache)
    .then((opts)=>{
        if(opts.cachedSobj){
          this.setState({
            sobj:opts.cachedSobj,
            compactTitle: opts.cachedSobj.attributes.compactTitle,
            compactLayout:opts.cachedCompactLayout,
            defaultLayout:opts.cachedDefaultLayout,
            refreshedDate: new Date()
          });
        }
      });
  },

  render() {
    return (
      <View>
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
    if(this.props.type !== nextProps.type){
      return true;
    }
    if(!shallowEqual(this.state.sobj, nextState.sobj)){
      return true;
    }
    return false;
  }

});
