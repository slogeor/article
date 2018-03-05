import React from 'react';
import { PView } from 'rnplus';
import { ListView, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { All, NavBar } from 'BizComponent';
import { PAGE_ANI_NO_GESTURES } from 'BizConstant';

const styles = StyleSheet.create({
  row: {
    height: 50,
    backgroundColor: 'white',
  },
  section: {
    backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  category: {
    width: 100,
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#F50',
  },
  list: {
    flex: 1,
  },
  menu: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class ListViewDemo extends PView {
  static routerPlugin = {
    sceneConfig: PAGE_ANI_NO_GESTURES,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      dataSource: ds.cloneWithRowsAndSections({
        分类1: ['面包', '牛奶', '咖啡', '啤酒', '面包', '牛奶', '咖啡', '啤酒', '面包', '牛奶', '咖啡', '啤酒', '面包', '牛奶', '咖啡', '啤酒', '面包', '牛奶', '咖啡', '啤酒', '面包', '牛奶', '咖啡', '啤酒', '面包', '牛奶', '咖啡', '啤酒'],
        分类2: ['PHP', 'JAVA', 'C++', 'Object C', 'JavaScripte', 'Vue', 'React', 'React-Native', 'CSS', 'HTML'],
        分类3: ['AAA', 'BBB', 'CVCCC', 'DDDD', 'EEEE', 'FFFF', 'GGG', 'HHHH', 'KKKKK', 'AAA', 'BBB', 'CVCCC', 'DDDD', 'EEEE', 'FFFF', 'GGG', 'HHHH', 'KKKKK', 'AAA', 'BBB', 'CVCCC', 'DDDD', 'EEEE', 'FFFF', 'GGG', 'HHHH', 'KKKKK'],
        分类4: ['AAA', 'BBB', 'CVCCC', 'DDDD', 'EEEE', 'FFFF', 'GGG', 'HHHH', 'KKKKK', 'AAA', 'BBB', 'CVCCC', 'DDDD', 'EEEE', 'FFFF', 'GGG', 'HHHH', 'KKKKK', 'AAA', 'BBB', 'CVCCC', 'DDDD', 'EEEE', 'FFFF', 'GGG', 'HHHH', 'KKKKK'],
      }),
    };

    this.renderRow = this.renderRow.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.getListView = this.getListView.bind(this);
    this.handleOnPress1 = this.handleOnPress1.bind(this);
    this.handleOnPress2 = this.handleOnPress2.bind(this);
    this.handleOnPress3 = this.handleOnPress3.bind(this);
  }

  renderRow(data, sectionID, rowID) {
    return (
      <View style={[styles.row]}>
        <Text>{`renderRow:${data}-${sectionID}-${rowID}`}</Text>
      </View>
    );
  }

  renderSectionHeader(data, sectionID) {
    return (
      <View style={styles.section}>
        <View style={{ flex: 1 }}><Text>{`renderSectionHeader:${sectionID}`}</Text></View>
      </View>
    );
  }

  getListView(ref) {
    this.listView = ref;
  }

  handleOnPress1() {
    this.listView.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });
  }

  handleOnPress2() {
    this.listView.scrollTo({
      x: 0,
      y: 1000,
      animated: true,
    });
  }

  handleOnPress3() {
    this.listView.scrollTo({
      x: 0,
      y: 2000,
      animated: true,
    });
  }

  render() {
    return (
      <All>
        <NavBar title="带锚点的ListView" />
        <View style={styles.container}>
          <View style={styles.menu}>
            <TouchableWithoutFeedback onPress={this.handleOnPress1}>
              <View style={styles.category}>
                <Text>分类1</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.handleOnPress2}>
              <View style={styles.category}>
                <Text>分类2</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.handleOnPress3}>
              <View style={styles.category}>
                <Text>分类3</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <ListView
            ref={this.getListView}
            style={styles.list}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            renderSectionHeader={this.renderSectionHeader}
            enableEmptySections
            removeClippedSubviews
            initialListSize={1}
            pageSize={1000}
            scrollEventThrottle={300}
          />
        </View>
      </All>
    );
  }
}

export default ListViewDemo;
