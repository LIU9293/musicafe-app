/*
 * @providesModule HeaderTabBar
 */

const React = require('react');
const ReactNative = require('react-native');
const {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Navigator,
} = ReactNative;
//const Button = require('Button');
import Dimensions from 'Dimensions';
import oc from 'oc';
import Icon from 'react-native-vector-icons/Ionicons';

const DefaultTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    underlineColor: React.PropTypes.string,
    underlineHeight: React.PropTypes.number,
    backgroundColor: React.PropTypes.string,
    activeTextColor: React.PropTypes.string,
    inactiveTextColor: React.PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: View.propTypes.style,
  },

  getDefaultProps() {
    return {
      activeTextColor: oc.teal3,
      inactiveTextColor: oc.teal8,
      underlineColor: oc.teal3,
      backgroundColor: null,
      underlineHeight: 2,
    };
  },

  renderTabOption(name, page) {
    const isTabActive = this.props.activeTab === page;
    const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'bold' : 'normal';

    return <TouchableOpacity
      style={{flex: 1}}
      key={name}
      accessible={true}
      accessibilityLabel={name}
      accessibilityTraits='button'
      onPress={() => this.props.goToPage(page)}
    >
      <View style={[styles.tab, this.props.tabStyle]}>
        <Text style={[{color: textColor, fontWeight, }, textStyle, ]}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>;
  },

  render() {
    const containerWidth = 160;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: this.props.underlineHeight,
      backgroundColor: this.props.underlineColor,
      bottom: 0,
    };
    const windowWidth = Dimensions.get('window').width;

    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1, ], outputRange: [0,  containerWidth / numberOfTabs, ],
    });

    return (
      <View style={{
        width: windowWidth,
        alignItems:'center',
        justifyContent: 'center',
        borderBottomColor:'#777',
        borderBottomWidth:0.3,
        flexDirection: 'row'
      }}>
        {
          this.props.needBack
          ? <TouchableOpacity style={styles.filterButton} onPress={ e => {this.props.navigator.pop()}}>
              <Icon name="ios-arrow-back" size={30} color={oc.gray1} />
            </TouchableOpacity>
          : null
        }
        <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor, }, this.props.style, ]}>
          {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
          <Animated.View style={[tabUnderlineStyle, { left, }, ]} />
        </View>
        {
          this.props.right || null
        }
      </View>
    );
  },
});

const styles = StyleSheet.create({
  filterButton:{
    height: 50,
    position: 'absolute',
    left: 0,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    width:160,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: '#ccc',
  },
});

module.exports = DefaultTabBar;
