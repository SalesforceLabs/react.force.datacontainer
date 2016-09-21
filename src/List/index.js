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
  View,
  ListView
} from 'react-native';

import union from 'lodash.union';

import {forceClient} from 'react.force';

import {requestWithTypeAndId} from 'react.force.data';

module.exports = React.createClass ({
  getDefaultProps(){
    return {
      type:null,
      fields:[],
      where:null,
      limit:200,
      refreshDate:new Date(),
      style:{},
      fullFetch:true
    };
  },
  childContextTypes: {
    dataSource: React.PropTypes.object,
    replaceData: React.PropTypes.func,
    refreshData: React.PropTypes.func,
    listRefreshing: React.PropTypes.bool
  },
  getInitialState(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      loading:false,
      dataSource: ds.cloneWithRows([])
    };
  },
  getChildContext() {
    return {
      dataSource: this.state.dataSource,
      replaceData: this._replaceData,
      refreshData: this._refreshData,
      listRefreshing: this.state.loading
    };
  },
  componentDidMount(){
    this.getData();
  },
  getDataSource (items) {
    return this.state.dataSource.cloneWithRows(items);
  },
  _refreshData () {
    this.getData();
  },
  _replaceData (items) {
    if(items){
      this.setState({ dataSource:this.getDataSource(items) });
    }
    else{
      this.getData();
    }
  },
  getQuery() {
    if(!this.props.type) return;
    const fields = union(['Id'],this.props.fields);
    let soql = 'SELECT '+ fields.join(', ') + ' FROM '+this.props.type;
    if(this.props.where){
      soql += ' WHERE '+this.props.where;
    }
    soql += ' LIMIT '+this.props.limit;
    return soql;
  },
  getData() {
    const soql = this.getQuery();
    if(!soql){
      return;
    }
    this.setState({loading:true});
    forceClient.query(soql,
      (response) => {
        const items = response.records;
        if(this.props.fullFetch){
          items.forEach((item)=>{
            requestWithTypeAndId(this.props.type,item.Id);
          });
        }
        this.setState({
          dataSource: this.getDataSource(items),
          loading:false
        });
      },
      (err) => {
        console.log('ERROR: ',err);
        this.setState({
          loading:false
        });
      });
  },

  render() {
    return (
      <View style={[this.props.style]}>
        {this.props.children}
      </View>
    )
  },
  componentDidUpdate(prevProps){
    if(this.props.refreshDate !== prevProps.refreshDate){
      return this.getData();
    }
    if(this.props.where !== prevProps.where){
      return this.getData();
    }
    if(this.props.type !== prevProps.type){
      return this.getData();
    }
  },
});
