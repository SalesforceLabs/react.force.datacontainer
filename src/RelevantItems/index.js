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
  View,
  ListView
} from 'react-native';

import {forceClient} from 'react.force';

import {requestWithTypeAndId} from 'react.force.data';

module.exports = React.createClass ({
  getDefaultProps(){
    return {
      type:null,
      refreshDate:new Date(),
      style:{}
    };
  },
  childContextTypes: {
    dataSource: React.PropTypes.object
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
      dataSource: this.state.dataSource
    };
  },
  componentDidMount(){
    this.getData();
  },
  getDataSource (items) {
    return this.state.dataSource.cloneWithRows(items);
  },
  getData() {
    this.setState({loading:true});
    forceClient.relevantItems([this.props.type],
      (response) => {
        const type = this.props.type;
        if(response && response.length){
          const typeItems = response[0];
          if(typeItems.recordIds && typeItems.recordIds.length){
            const items = typeItems.recordIds.map((recordId)=>{
              requestWithTypeAndId(type,recordId)
              return {
                Id:recordId,
                attributes:{
                  type:type
                }
              }
            });
            this.setState({
              dataSource: this.getDataSource(items),
              loading:false
            });
            return;
          }
        }
        this.setState({
          dataSource: this.getDataSource([]),
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
  componentWillReceiveProps(newProps){
    if(this.props.refreshDate !== newProps.refreshDate){
      this.getData();
    }
  },
});
